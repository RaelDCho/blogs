# Blog App
---
A modern full-stack blogging platform built with React, Node.js, Express, PostgreSQL, Sequelize, and Umzug. The application allows users to create, edit, publish, and manage blog posts through a secure and responsive web interface.

## Features
### User Features
- User registration and authentication
- Secure JWT-based authorization
- Create, edit, and delete blog posts
- View all published articles
- Read individual blog posts
- Responsive user interface


### Admin Features
- Disabling accounts


## Technology Stack

### Frontend
- React (JS)
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- JWT Authentication
- Bcrypt Password Hashing

### Database
- PostgreSQL
- Sequelize Object Relation Mapper
- Umzug Migration Framework
- Docker

### Testing
- Playwright
- Vitest
- supertest

## Database Setup
Database was set up through Docker and PSQL


## Installation
Clone Repository

`git clone https://github.com/RaelDCho/blogs.git`

`cd blog-app`



Install Backend Dependencies

`cd backend`

`npm install`



Install Frontend Dependencies

`cd ../frontend`

`npm install`



## API Endpoints
### Authentication
| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST | /api/user | Register a new user |
| POST | /api/login | Authenticate user |

### Blog Posts
| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | /api/blogs | Retrieve all blogs |
| GET | /api/blogs/:id | Retrieve a specific blog |
| POST | /api/blogs | Register a new blog |
| PUT | /api/blogs/:id | Update a specific blog |
| DELETE | /api/blogs/:id | Delete a specific blog |


## Security Features
- JWT Authentication
- Password Hashing with Bcrypt
- Protected API Routes
- Input Validation
- Environment Variable Configuration
- Sequelize Query Parameterization


## Future Enhancements
- CORS Protection
- User:
  - Image Uploads
  - User profile management
- Admin:
  - Manage blog content
  - Moderate posts
  - User administration
  - Content publishing controls

---
Developed using React, Node.js, Express, PostgreSQL, Sequelize, and Umzug