import { Link } from "react-router-dom";
import "../Array/array.css";

function VisualizerPageHeader({ title, backTo, backText = "← Back to Explanation" }) {
  return (
    <div className="theory-page-header">
      <div className="basename">{title}</div>
      <Link to={backTo} className="dav-btn dav-ghost theory-viz-btn">
        {backText}
      </Link>
    </div>
  );
}

export default VisualizerPageHeader;
