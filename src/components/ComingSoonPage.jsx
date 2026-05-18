import "../Array/array.css";

function ComingSoonPage({ title }) {
  return (
    <>
      <div className="logo-part">DSA Visualizer</div>
      <div className="mainbox">
        <div className="basename">{title}</div>
        <div className="def">
          <div className="d2">{title} visualizer - updating soon.</div>
        </div>
      </div>
    </>
  );
}

export default ComingSoonPage;