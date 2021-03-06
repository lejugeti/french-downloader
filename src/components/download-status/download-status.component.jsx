import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

import "./download-status.component.css";

const DownloadStatus = ({ downloadError, downloadDate, isDownloaded }) => {
  if (!isDownloaded) {
    return (
      <div>
        <span className='download-status-not-downloaded'>Not downloaded yet</span>
      </div>
    );
  } else if (downloadError && !isDownloaded) {
    return (
      <div>
        <span className='download-status-ERROR'>
          Download Error
          <ErrorIcon />
        </span>
        <span className='download-date'>{downloadDate}</span>
      </div>
    );
  } else {
    return (
      <div>
        <span className='download-status-OK'>
          Download Success
          <CheckCircleIcon />
        </span>
        <span className='download-date'>{downloadDate}</span>
      </div>
    );
  }
};

export default DownloadStatus;
