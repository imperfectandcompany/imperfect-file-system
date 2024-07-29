// ViewMedia.tsx

import { FunctionalComponent } from "preact";
import { useState, useEffect } from "preact/hooks";
import { getToken } from "../../utils"; // Assuming getToken is available

interface MediaItem {
  media_id: number;
  filename: string;
  filepath: string;
  filesize: number;
  filetype: string;
  description: string;
  folder_id: number | null;
  created_at: string;
  folder_name: string | null;
}

const ViewMedia: FunctionalComponent = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [folders, setFolders] = useState<any[]>([]); // Replace any with a proper type
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [newFilename, setNewFilename] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [newFolderId, setNewFolderId] = useState<string | null>(null);
  const CDN_BASE_URL = "https://cdn.imperfectandcompany.com";

  useEffect(() => {
    fetchTopLevelFoldersAndMedia();
  }, []);





  const fetchMedia = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken(); // Get token for authentication
      if (!token) {
        throw new Error("User not authenticated!");
      }

      const response = await fetch('https://api.imperfectgamers.org/media/all', {
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch media');
      }

      const data = await response.json();
      setMediaList(data.media);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while fetching media.');
      }
    } finally {
      setLoading(false);
    }
  };







  const fetchTopLevelFoldersAndMedia = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        throw new Error("User not authenticated!");
      }

      const response = await fetch('https://api.imperfectgamers.org/media/top-level', {
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch top-level folders and media');
      }

      const data = await response.json();
      setMediaList(data.root_media);
      setFolders(data.folders);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while fetching media.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchFolderContents = async (folderId: number) => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        throw new Error("User not authenticated!");
      }

      const response = await fetch(`https://api.imperfectgamers.org/media/folder/fetch/${folderId}`, {
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch folder contents');
      }

      const data = await response.json();
      setMediaList(data.media);
      setFolders(data.folders);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while fetching folder contents.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this media?')) return;

    try {
      const token = getToken();
      if (!token) {
        throw new Error("User not authenticated!");
      }

      const response = await fetch(`https://api.imperfectgamers.org/media/delete`, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ media_id: id })
      });

      if (!response.ok) {
        throw new Error('Failed to delete media');
      }

      setMediaList((prev) => prev.filter(media => media.media_id !== id));
      alert('Media deleted successfully!');
    } catch (error) {
      if (error instanceof Error) {
        alert('Error deleting media: ' + error.message);
      } else {
        alert('An unknown error occurred while deleting media.');
      }
    }
  };

  const handleEdit = (media: MediaItem) => {
    setEditingMedia(media);
    setNewFilename(media.filename.replace(/\.[^/.]+$/, "")); // Remove extension for editing
    setNewDescription(media.description || "");
    setNewFolderId(media.folder_id?.toString() || "");
  };

  const handleUpdate = async () => {
    if (!editingMedia) return;

    try {
      const token = getToken();
      if (!token) {
        throw new Error("User not authenticated!");
      }

      const response = await fetch("https://api.imperfectgamers.org/media/update", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          media_id: editingMedia.media_id,
          filename: newFilename,
          description: newDescription,
          folder_id: newFolderId ? parseInt(newFolderId) : null,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Update failed: ${errorText}`);
      }

      alert("Media updated successfully!");
      setEditingMedia(null);
      fetchMedia(); // Refresh the media list to reflect changes
    } catch (error) {
      if (error instanceof Error) {
        alert("Error updating media: " + error.message);
      } else {
        alert("An unknown error occurred while updating media.");
      }
    }
  };

  const getCdnUrl = (filepath: string) => {
    // Remove the internal server path segment
    const internalPathSegment = "/usr/www/igfastdl/imperfectandcompany-cdn";
    return `${CDN_BASE_URL}${filepath.replace(internalPathSegment, "")}`;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="view-media">
      <h2>View Media</h2>
      {editingMedia && (
        <div>
          <h3>Edit Media</h3>
          <input
            type="text"
            placeholder="New Filename"
            value={newFilename}
            onChange={(e) => setNewFilename((e.target as HTMLInputElement).value)}
          />
          <textarea
            placeholder="New Description"
            value={newDescription}
            onChange={(e) => setNewDescription((e.target as HTMLTextAreaElement).value)}
          />
          <input
            type="text"
            placeholder="Folder ID"
            value={newFolderId ?? ""}
            onChange={(e) => setNewFolderId((e.target as HTMLInputElement).value)}
          />
          <button onClick={handleUpdate}>Update Media</button>
          <button onClick={() => setEditingMedia(null)}>Cancel</button>
        </div>
      )}
      <div className="media-folders">
        {folders.map(folder => (
          <div key={folder.folder_id}>
            <h3>{folder.name}</h3>
            <button onClick={() => fetchFolderContents(folder.folder_id)}>Open</button>
          </div>
        ))}
      </div>
      {mediaList.length === 0 ? (
        <p>No media available.</p>
      ) : (
        <ul>
          {mediaList.map((media) => (
            <li key={media.media_id}>
              <img src={getCdnUrl(media.filepath)} alt={media.filename} width="100" />
              <div>
                <p>{media.filename}</p>
                <p>Uploaded on: {new Date(media.created_at).toLocaleDateString()}</p>
                <p>Folder: {media.folder_name ?? "None"}</p>
                <p>Description: {media.description ?? "No description"}</p>
                <button onClick={() => handleEdit(media)}>Edit</button>
                <button onClick={() => handleDelete(media.media_id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewMedia;
