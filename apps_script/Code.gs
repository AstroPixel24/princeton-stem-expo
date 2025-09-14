function doPost(e) {
  var action = (e.parameter && e.parameter.action) || '';
  if (action === 'createPaymentIntent') {
    return createPaymentIntent_(e);
  }
  // === EXISTING FORM SUBMISSION PATH ===
  return handleFormSubmit_(e);
}

function createPaymentIntent_(e) {
  try {
    var STRIPE_SECRET = PropertiesService.getScriptProperties().getProperty('STRIPE_SECRET');
    if (!STRIPE_SECRET) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'Missing STRIPE_SECRET in Script Properties' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var amount = parseInt((e.parameter && e.parameter.amount) || '0', 10);
    var currency = (e.parameter && e.parameter.currency) || 'usd';
    if (!amount || amount <= 0) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'Missing or invalid amount' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var payload = {
      'amount': amount,
      'currency': currency,
      'automatic_payment_methods[enabled]': 'true'
    };

    var resp = UrlFetchApp.fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'post',
      payload: payload,
      headers: { 'Authorization': 'Bearer ' + STRIPE_SECRET },
      muteHttpExceptions: true
    });

    var code = resp.getResponseCode();
    var body = resp.getContentText();
    if (code < 200 || code >= 300) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'Stripe error', detail: body }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var pi = JSON.parse(body);

    return ContentService.createTextOutput(JSON.stringify({
      clientSecret: pi.client_secret,
      paymentIntentId: pi.id
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Default form handler (replace with my existing implementation if I already have one).
 * Appends all posted fields to a sheet named "FormResponses".
 */
function handleFormSubmit_(e) {
  try {
    var ss = SpreadsheetApp.getActive();
    var sh = ss.getSheetByName('FormResponses') || ss.insertSheet('FormResponses');
    var params = e.parameter || {};
    var keys = Object.keys(params);
    // Header row
    if (sh.getLastRow() === 0) {
      sh.appendRow(keys);
    }
    // Align to header order
    var header = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0];
    var row = header.map(function(k){ return params[k] || ''; });
    sh.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}