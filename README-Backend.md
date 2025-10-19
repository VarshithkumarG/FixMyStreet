# FixMyStreet Backend API

A comprehensive backend API for the FixMyStreet street issue management system built with Node.js, Express, and SQLite.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Issue Management**: Full CRUD operations for street issues
- **File Upload**: Image upload for issue documentation
- **Analytics**: Comprehensive analytics and reporting
- **Notifications**: Real-time notification system
- **Database**: SQLite database with proper relationships and indexes

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite3** - Database
- **JWT** - Authentication
- **Multer** - File upload handling
- **Bcrypt** - Password hashing
- **Express Validator** - Input validation

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Initialize the database:**
   ```bash
   npm run init-db
   ```

4. **Start the server:**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Issues
- `GET /api/issues` - Get all issues (with filtering)
- `GET /api/issues/:id` - Get single issue
- `POST /api/issues` - Create new issue
- `PUT /api/issues/:id/status` - Update issue status
- `POST /api/issues/:id/comments` - Add comment
- `GET /api/issues/user/my-issues` - Get user's issues
- `DELETE /api/issues/:id` - Delete issue (admin only)

### Analytics
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/issues-by-type` - Issues by type
- `GET /api/analytics/issues-by-severity` - Issues by severity
- `GET /api/analytics/issues-over-time` - Issues over time
- `GET /api/analytics/top-reporters` - Top reporters
- `GET /api/analytics/department-performance` - Department performance
- `GET /api/analytics/location-analytics` - Location analytics
- `GET /api/analytics/response-time` - Response time analytics

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user (admin only)
- `PUT /api/users/:id/deactivate` - Deactivate user (admin only)
- `PUT /api/users/:id/reactivate` - Reactivate user (admin only)
- `GET /api/users/:id/notifications` - Get user notifications
- `PUT /api/users/:id/notifications/:notificationId/read` - Mark notification as read
- `GET /api/users/:id/statistics` - Get user statistics

### File Upload
- `POST /api/upload/issue/:issueId/photos` - Upload issue photos
- `GET /api/upload/issue/:issueId/photos` - Get issue photos
- `DELETE /api/upload/photo/:photoId` - Delete photo

## Database Schema

### Users Table
- User authentication and profile information
- Role-based access control (citizen, staff, admin)

### Issues Table
- Street issue reports with full lifecycle tracking
- Location data and severity classification

### Issue Photos Table
- File attachments for issues
- Metadata and file path storage

### Comments Table
- Issue discussion and updates
- Internal and public comments

### Notifications Table
- User notification system
- Status updates and alerts

### Categories Table
- Issue type classification
- Icons and color coding

### Departments Table
- Department assignment and contact info

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "message": "Additional details (development only)"
}
```

## Rate Limiting

- 100 requests per 15 minutes per IP address
- Applied to all `/api/` routes

## File Upload

- Maximum file size: 5MB
- Allowed types: Images only
- Maximum 5 files per request
- Files stored in `uploads/issues/` directory

## Sample Data

The database initialization script creates:
- Admin user: `admin@fixmystreet.com` / `admin123`
- Test user: `john.doe@example.com` / `user123`
- Sample categories and departments
- Sample issue data

## Development

```bash
# Start with auto-reload
npm run dev

# Initialize database
npm run init-db

# Check health
curl http://localhost:3000/api/health
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong JWT secret
3. Configure proper CORS origins
4. Set up proper file storage (AWS S3, etc.)
5. Use a production database (PostgreSQL, MySQL)
6. Set up monitoring and logging

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- Input validation
- SQL injection prevention
- File type validation
- CORS protection
- Helmet security headers
