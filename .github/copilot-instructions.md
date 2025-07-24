<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Princeton STEM Expo (PSE) Website Development Instructions

This is a static website project for the Princeton STEM Expo, a mathematics competition and STEM event for middle and high school students.

## Project Context

- **Event**: Princeton STEM Expo (PSE)
- **Target Audience**: Middle and high school students, parents, teachers, coaches
- **Purpose**: Information, registration, and resources for a STEM competition event
- **Technology Stack**: HTML5, CSS3, vanilla JavaScript (no frameworks)

## Design Guidelines

### Visual Style
- Modern, clean, student-friendly design
- STEM-inspired color palette with blues and purples
- Professional but approachable tone
- High contrast for accessibility
- Responsive design for all devices

### Color Scheme
- Primary: #2563eb (blue)
- Secondary: #667eea to #764ba2 (gradient)
- Dark text: #1e293b
- Light text: #64748b
- Backgrounds: #ffffff, #f8fafc

### Typography
- Font family: Inter (Google Fonts)
- Hierarchy: Clear headings, readable body text
- Consistent spacing and sizing

## Code Standards

### HTML
- Use semantic HTML5 elements
- Include proper meta tags for SEO
- Ensure accessibility with ARIA labels
- Maintain consistent structure across pages

### CSS
- Use CSS Grid and Flexbox for layouts
- Implement mobile-first responsive design
- Use CSS custom properties for maintainability
- Follow BEM naming convention when appropriate
- Optimize for performance

### JavaScript
- Use vanilla JavaScript (no frameworks)
- Implement progressive enhancement
- Handle form validation and user interactions
- Ensure cross-browser compatibility
- Use modern ES6+ features where appropriate

## Content Guidelines

### Tone and Voice
- Professional yet approachable
- Encouraging and inspiring for students
- Clear and informative for parents/teachers
- Educational focus with emphasis on growth and learning

### Content Structure
- Clear navigation between pages
- Logical information hierarchy
- Comprehensive but not overwhelming
- Include practical details (dates, times, locations)
- Provide multiple contact methods

## Functional Requirements

### Forms
- Registration form with validation
- Contact form with inquiry categorization
- Proper error handling and user feedback
- Accessibility compliance

### Navigation
- Responsive navigation with mobile hamburger menu
- Clear active page indicators
- Smooth scrolling for internal links
- Consistent across all pages

### Interactivity
- Form submission handling
- Mobile menu toggle
- FAQ accordion functionality
- Notification system for user feedback

## File Organization

```
/
├── *.html (main pages)
├── styles/
│   └── style.css
├── js/
│   └── script.js
└── README.md
```

## When Making Changes

1. **Maintain consistency** across all pages
2. **Test responsiveness** on multiple screen sizes
3. **Validate HTML** and ensure accessibility
4. **Check cross-browser compatibility**
5. **Update README.md** if adding new features
6. **Consider performance impact** of changes

## Common Tasks

### Adding New Content
- Follow existing HTML structure patterns
- Use established CSS classes for styling
- Maintain consistent spacing and typography
- Test on mobile devices

### Styling Updates
- Use existing color variables
- Follow responsive design patterns
- Test across different screen sizes
- Maintain accessibility standards

### JavaScript Enhancements
- Follow existing code patterns
- Use event delegation where appropriate
- Ensure graceful degradation
- Test thoroughly across browsers

## Placeholder Information

Some content uses placeholder information:
- Email addresses (@princetonstem.org domain)
- Phone numbers (555 prefix)
- Dates (April 12, 2025)
- Statistics and participant numbers

Update these with real information when available.

## Notes for Developers

- This is a static website suitable for hosting on GitHub Pages, Netlify, or similar services
- No backend functionality is implemented - forms would need server-side processing
- All external links are placeholders and should be updated with real URLs
- Images are referenced but not included - add actual event photos and graphics
- Consider implementing a content management system for dynamic updates in the future
