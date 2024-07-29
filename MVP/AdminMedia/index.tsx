// AdminMedia.tsx

import { useState } from "preact/hooks";
import ViewMedia from "./ViewMedia";
import UploadMedia from "./UploadMedia";
import CreateFolder from "./CreateFolder";
import MediaLogs from "./MediaLogs";
import { FunctionalComponent } from "preact";

interface Props {}

const AdminMedia: FunctionalComponent<Props> = () => {
  const [activeTab, setActiveTab] = useState('view');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'upload':
        return <UploadMedia />;
      case 'uploadFolder':
        return <CreateFolder />;
      case 'logs':
        return <MediaLogs />;
      case 'view':
      default:
        return <ViewMedia />;
    }
  };

  return (
    <div className="admin-media">
      <nav>
        <button onClick={() => setActiveTab('view')}>View Media</button>
        <button onClick={() => setActiveTab('upload')}>Upload Media</button>
        <button onClick={() => setActiveTab('uploadFolder')}>Create Folder</button>
        <button onClick={() => setActiveTab('logs')}>Logs</button>
      </nav>
      <div className="tab-content">
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default AdminMedia;
