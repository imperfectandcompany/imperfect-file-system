# Imperfect File System Documentation

## Overview

This documentation outlines our internal file system, designed to manage and share documents easily within our team. Our file system is integrated with our file server, allowing seamless file uploads, updates, and retrieval. Files are stored in a structured manner, supporting versioning and logging of all operations to ensure traceability and management.

When a media file is uploaded through the API, it is first validated and then stored in a designated directory on the file server. Metadata about the file, including its version and location, is stored in the database. This allows for efficient retrieval and management of files while ensuring data consistency and security.

### Features

- **File Storage and Organization**: Media files are stored in a structured directory on the server, organized by folders. Each folder can contain multiple files and subfolders, allowing for nested structures. The API supports operations like creating folders, uploading files, and moving files between folders.

- **Version Control**: Both media files and folders are versioned. This allows the system to maintain a history of changes, making it possible to track modifications and restore previous versions if needed. Each update to a media file or folder creates a new entry in the respective `MediaVersions` or `MediaFolderVersions` table, without altering the original data.

- **Logging and Auditing**: All actions performed on media files and folders, such as uploads, updates, and deletions, are logged in the `MediaLogs` table. This logging mechanism ensures traceability and accountability, providing a clear audit trail of who performed what action and when.

- **File Validation and Security**: The system enforces file type and size restrictions to ensure that only allowed file types (e.g., jpg, png) are uploaded, and that file sizes do not exceed a specified limit (4MB). This is implemented in the `MediaController` class, which includes methods for validating and processing file uploads.

## API Endpoints

```plaintext
POST /media/upload
Description: Uploads a new media file. The file is stored on the server, and metadata is recorded in the database.
Parameters: None (Uses multipart form data).
Returns: JSON object with media details.

POST /media/folder/create
Description: Creates a new folder for organizing media files. Folders can nest within each other, allowing for a hierarchical structure.
Parameters: `name` (required), `parent_folder_id` (optional).
Returns: JSON object with folder details.

GET /media/all
Description: Fetches all media files, regardless of their folder organization.
Parameters: None.
Returns: JSON array of media files.

POST /media/update
Description: Updates an existing media file's metadata or moves it to a new folder. Supports renaming and changing the description.
Parameters: `media_id` (required), `filename`, `folder_id`, `description`.
Returns: JSON object with updated media details.

POST /media/delete
Description: Soft deletes a media file by moving it to a designated 'deleted' directory and marking it in the database.
Parameters: `media_id` (required).
Returns: JSON confirmation of deletion.

GET /media/single/:media_id
Description: Fetches details of a specific media file based on its ID. Includes metadata and storage location.
Parameters: `media_id` (path parameter).
Returns: JSON object with media details.

GET /media/folder/fetch/:folder_id
Description: Fetches all media files and subfolders within a specific folder. Useful for navigating through the folder structure.
Parameters: `folder_id` (path parameter).
Returns: JSON object with media files and subfolders.

GET /media/top-level
Description: Fetches the top-level folders and media items that are not in any folder (root directory items).
Parameters: None.
Returns: JSON object with top-level folders and media.

GET /media/logs
Description: Fetches logs for all media actions, including uploads, updates, and deletions. Helps in auditing and monitoring file operations.
Parameters: None.
Returns: JSON array of log entries.
```

## Database Schema Overview

### Tables and Fields

1. **Media**
   - Stores information about media files.
   - Fields:
     - `media_id`: Primary key, auto-incremented.
     - `current_version_id`: References the current version in `MediaVersions`.

2. **MediaFolder**
   - Stores folder data for organizing media.
   - Fields:
     - `folder_id`: Primary key, auto-incremented.
     - `current_version_id`: References the current version in `MediaFolderVersions`.

3. **MediaFolderVersions**
   - Tracks version history for folders.
   - Fields:
     - `version_id`: Primary key, auto-incremented.
     - `folder_id`: References the folder in `MediaFolder`.
     - `parent_folder_id`: References the parent folder, if applicable.
     - `name`: Name of the folder.
     - `description`: Optional description of the folder.
     - `created_at`, `deleted_at`, `updated_at`: Timestamps for tracking folder history.

4. **MediaLogs**
   - Logs actions performed on media files and folders.
   - Fields:
     - `log_id`: Primary key, auto-incremented.
     - `context_version_id`: ID of the relevant version in `MediaVersions` or `MediaFolderVersions`.
     - `context_type`: Enum indicating the context ('media' or 'folder').
     - `action`: Description of the action taken.
     - `user_id`: Optional ID of the user who performed the action.
     - `details`: Additional details about the action.
     - `created_at`: Timestamp of when the action occurred.

5. **MediaVersions**
   - Tracks version history for media files.
   - Fields:
     - `version_id`: Primary key, auto-incremented.
     - `media_id`: References the media in `Media`.
     - `folder_id`: References the folder in `MediaFolder`, if applicable.
     - `filename`: Name of the media file.
     - `filepath`: Path to the media file.
     - `filesize`: Size of the media file.
     - `filetype`: Type of the media file (e.g., 'jpg', 'png').
     - `description`: Optional description of the media.
     - `created_at`, `deleted_at`, `updated_at`: Timestamps for tracking media history.

## Tested MVP

This section of the README focuses on the Minimum Viable Product (MVP) developed to test the fundamental interactions with the REST API of our internal file system. The MVP, built with Preact, served as a proof of concept to ensure that key functionalities—such as media upload, folder creation, and media management—interact correctly with the backend.

The MVP was essential for:
- Validating the backend API's design and response handling.
- Identifying potential user experience improvements.
- Ensuring that file and folder management functionalities were correctly implemented.
- Testing security and authentication mechanisms through practical scenarios.

### Key Components

The MVP included several components, each tailored to test specific parts of the system:

#### `AdminMedia`
- Manages the main interface for media management, providing navigation between different functionalities like viewing media, uploading media, creating folders, and viewing logs.

#### `UploadMedia`
- Allows users to upload media files. The component handles file selection, folder selection, and manages the upload process, including displaying success or error messages.

#### `CreateFolder`
- Facilitates the creation of new folders. Users can specify a folder name, description, and parent folder ID.

#### `ViewMedia`
- Displays a list of media files and folders. It includes features for editing media metadata, deleting media, and navigating through folders.

### MVP Screenshots (UI was not considered, purpose was validation)

#### Main Screen (allows for folders and files in root):
<img src="https://github.com/user-attachments/assets/6dad3b49-cd10-48a3-87eb-790dbf94ae6c" width="600" />

#### Traversing folders:
<img src="https://github.com/user-attachments/assets/1475f587-dd62-4379-bd28-89e5825dbdd0" width="600" />

#### Upload media:
<img src="https://github.com/user-attachments/assets/ae8724bf-79a9-4363-bc55-03e24f805805" width="600" />

#### Create Folder:
<img src="https://github.com/user-attachments/assets/84c3c6ec-6dc2-4576-b19b-c119a4c34178" width="600" />
