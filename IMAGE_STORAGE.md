# Image Storage in Database

## Overview
Images are now stored directly in the SQLite database as BLOB (Binary Large Object) data instead of being saved as files on disk.

## Benefits
- ✅ **Centralized Storage**: All data (including images) in one database file
- ✅ **Easy Backup**: Just backup the database file
- ✅ **No File System Dependencies**: Works on any platform
- ✅ **Atomic Operations**: Images are saved with the issue in one transaction
- ✅ **Automatic Cleanup**: Deleting an issue removes all associated images

## Database Schema
```sql
CREATE TABLE issue_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  issueId INTEGER NOT NULL,
  filename TEXT NOT NULL,
  originalName TEXT NOT NULL,
  fileSize INTEGER,
  mimeType TEXT,
  imageData BLOB NOT NULL,  -- The actual image data
  uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (issueId) REFERENCES issues (id) ON DELETE CASCADE
);
```

## API Endpoints

### Upload Images with Issue
```
POST /api/issues
Content-Type: multipart/form-data

Fields:
- title: Issue title
- description: Issue description
- type: Issue type
- severity: Issue severity
- location: Issue location
- photos: Image files (up to 5, max 5MB each)
```

### Serve Image
```
GET /api/upload/image/:photoId
Returns: Image data with proper Content-Type headers
```

### Get Issue Photos
```
GET /api/upload/issue/:issueId/photos
Returns: Array of photo metadata with URLs
```

## Frontend Integration

### Upload Form
The upload form now sends images directly with the issue creation:
```javascript
const formData = new FormData();
formData.append('title', issueData.title);
formData.append('description', issueData.description);
formData.append('photos', imageFile);
```

### Display Images
Images are displayed using the API URLs:
```html
<img src="/api/upload/image/123" alt="Issue photo">
```

## File Size Limits
- **Maximum file size**: 5MB per image
- **Maximum files**: 5 images per issue
- **Supported formats**: JPEG, PNG, WebP

## Migration
To update an existing database:
```bash
npm run update-db
```

This will:
1. Drop the old `issue_photos` table
2. Create the new table with BLOB storage
3. Add necessary indexes

## Performance Considerations
- Images are served directly from memory when possible
- Database includes proper indexing for fast lookups
- Images are cached by browsers using appropriate headers
- Large images are compressed by the client before upload

## Security
- Only authenticated users can upload images
- File type validation on both client and server
- Images are served with proper MIME types
- No direct file system access required
