# SkillSwap SaaS Web Application

## Overview
SkillSwap is a Software as a Service (SaaS) web application designed to facilitate the exchange of skills between users. The application allows users to create profiles, list skills they can teach, and book meetings to learn from others. This project was developed using React, Node.js, Auth0 for authentication, and Prisma for database management.

## Features
- **Anonymous Browsing**: Users can browse and view public skills without logging in.
- **User Authentication**: Integration with Auth0 for secure login and registration.
- **User Profiles**: Users can view and edit their profiles, including their skills and availability.
- **Skill Details**: Detailed view of each skill, including the ability to book meetings with the skill provider.
- **Responsive Design**: The application is responsive and works on desktop, tablet, and mobile devices.
- **External API Integration**: Integration with LocationIQ for mapping services.
- **Accessibility**: Includes Lighthouse accessibility reports for key pages.
- **Testing**: Contains unit tests using React Testing Library.
- **Deployment**: The application is fully deployed with links provided.

## API Requirements
- **/ping**: Public endpoint to check server status.
- **User Endpoints**: Secure endpoints for user verification, fetching, updating, and deleting user data.
- **Skill Endpoints**: Public endpoints for fetching skills and secure endpoints for CRUD operations on skills.
- **Meeting Endpoints**: Secure endpoints for creating, fetching, updating, and deleting meetings.

## Database Requirements
- **Users**: Stores user information including email, name, skills, and availability.
- **Skills**: Stores skill details linked to users.
- **Meetings**: Stores meeting details between users.

## Pages
### Homepage
- Displays dynamic content based on the latest data for both anonymous and logged-in users.
- Anonymous users can view public skills.
- Logged-in users can view personalized content and skill recommendations.

### Login/Register
- Uses Auth0 for user authentication.
- Users are only required to log in when they need to perform actions that require identification (e.g., booking a meeting).

### Profile Page
- Allows users to view and edit their profile information.
- Displays the user's skills and booked meetings.

### Skill Detail Page
- Provides a detailed view of each skill.
- Includes a "Book Meeting" button for logged-in users to schedule a session with the skill provider.

## Deployment
- The application is deployed on Vercel for the client side and Heroku for the API server.
- Database is deployed using Prisma.

### Deployment Links
- **Client**: [SkillSwap Client](https://client-k361vdky8-claires-projects-3c1b49ee.vercel.app)
- **API Server**: Deployed on Heroku (link provided by your deployment)

## Accessibility
- Includes Lighthouse accessibility reports for the homepage, profile page, and skill detail page.
- Reports are available in the `accessibility_reports` folder.

## Testing
- Contains unit tests using React Testing Library.
- Tests cover key functionalities and ensure the application behaves as expected.

## External API Integration
- Integrated with LocationIQ for mapping services.
- Example usage includes displaying user locations on their profiles.

## Project Structure
- **Client**: Built with React and styled using CSS.
- **API**: Built with Node.js and Express, using Prisma for database management.
- **Auth**: Managed with Auth0 for secure authentication.
