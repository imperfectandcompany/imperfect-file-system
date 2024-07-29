import { FunctionalComponent } from "preact";
import { useState } from "preact/hooks";
import { getToken } from "../../utils";

const UploadMedia: FunctionalComponent = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [folderId, setFolderId] = useState<string | null>(null); // State for folder ID

  const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      setSelectedFile(target.files[0]);
    }
  };

  const handleFolderIdChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setFolderId(target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadError(null);
    const token = getToken(); // getToken() is defined and returns the token
    if (token) {
      try {
        const formData = new FormData();
        formData.append("upload", selectedFile); // File data
        if (folderId) {
          formData.append("folder_id", folderId); // Optional folder ID
        }

        const response = await fetch(
          "https://api.imperfectgamers.org/media/upload",
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: token,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Upload failed: ${errorText}`);
        }

        alert("Media uploaded successfully!");
        setSelectedFile(null); // Clear the selected file after successful upload
      } catch (error) {
        if (error instanceof Error) {
          setUploadError(error.message);
        } else {
          setUploadError("An unknown error occurred");
        }
      } finally {
        setUploading(false);
      }
    } else {
      setUploadError("User not authenticated!");
    }
  };

  return (
    <div className="upload-media">
      <h2>Upload Media</h2>
      <input type="file" onChange={handleFileChange} />
      <input
        type="text"
        placeholder="Enter folder ID (optional)"
        onChange={handleFolderIdChange}
        value={folderId ?? ""}
      />
      {uploadError && <p className="error">{uploadError}</p>}
      <button onClick={handleUpload} disabled={!selectedFile || uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default UploadMedia;
