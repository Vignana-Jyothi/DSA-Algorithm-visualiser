import { Link } from "react-router-dom";
import "../Array/array.css";

function TheoryPageHeader({ title, to, buttonText = "Open Visualizer" }) {
  return (
    <div className="theory-page-header">
      <div className="basename">{title}</div>
      <Link to={to} className="dav-btn dav-primary theory-viz-btn">
        {buttonText}
      </Link>
    </div>
  );
}

export default TheoryPageHeader;
