import "./download-progress.component.css";

const DownloadProgress = ({ percentageDownload, timeDownload }) => {
  return (
    <div>
      <span>{percentageDownload}</span> - <span>{timeDownload}</span>
    </div>
  );
};

export default DownloadProgress;
