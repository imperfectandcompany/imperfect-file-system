// CreateFolder.tsx

import { FunctionalComponent } from "preact";
import { useState } from "preact/hooks";
import { getToken } from "../../utils";

const CreateFolder: FunctionalComponent = () => {
  const [folderName, setFolderName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [parentFolderId, setParentFolderId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!folderName.trim()) {
      setCreateError("Folder name is required");
      return;
    }

    setCreating(true);
    setCreateError(null);
    const token = getToken(); // getToken() is defined and returns the token
    if (token) {
      try {
        const formData = new FormData();
        formData.append("name", folderName);
        formData.append("description", description);
        if (parentFolderId !== null) {
          formData.append("parent_folder_id", parentFolderId.toString());
        }

        const response = await fetch(
          "https://api.imperfectgamers.org/media/folder/create",
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
          throw new Error(`Folder creation failed: ${errorText}`);
        }

        alert("Folder created successfully!");
        setFolderName("");
        setDescription("");
        setParentFolderId(null);
      } catch (error) {
        if (error instanceof Error) {
          setCreateError(error.message);
        } else {
          setCreateError("An unknown error occurred");
        }
      } finally {
        setCreating(false);
      }
    } else {
        setCreateError(`User not authenticated!`);
      throw new Error(`User not authenticated!`);
    }
  };

  return (
    <div className="upload-folder">
      <h2>Create Folder</h2>
      <input
        type="text"
        placeholder="Folder Name"
        value={folderName}
        onChange={(e) => setFolderName(e.currentTarget.value)}
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
      />
      <input
        type="number"
        placeholder="Parent Folder ID (optional)"
        value={parentFolderId !== null ? parentFolderId : ""}
        onChange={(e) =>
          setParentFolderId(Number(e.currentTarget.value) || null)
        }
      />
      {createError && <p className="error">{createError}</p>}
      <button onClick={handleCreate} disabled={creating}>
        {creating ? "Creating..." : "Create Folder"}
      </button>
    </div>
  );
};

export default CreateFolder;
