import { useEffect, useRef, useState } from "react";
import "./preloader.css";

const INIT_MESSAGES = [
  "Loading Components",
  "Initializing Visualizer Engine",
  "Loading Algorithms",
  "Preparing Animations",
];

const PHASE1_MS = 1000;
const PHASE2_MS = 2500;
const PHASE3_MS = 3000;
const EXIT_MS = 3500;

function Preloader({ onComplete }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showReady, setShowReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const timers = [];

    const msgInterval = (PHASE2_MS - PHASE1_MS) / INIT_MESSAGES.length;
    INIT_MESSAGES.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleCount(i + 1);
          setProgress(Math.round(((i + 1) / INIT_MESSAGES.length) * 85));
        }, PHASE1_MS + msgInterval * i)
      );
    });

    timers.push(
      setTimeout(() => {
        setShowReady(true);
        setProgress(100);
      }, PHASE3_MS)
    );

    timers.push(setTimeout(() => setExiting(true), PHASE3_MS));

    timers.push(
      setTimeout(() => {
        onCompleteRef.current();
      }, EXIT_MS)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  const activeStep = showReady
    ? INIT_MESSAGES.length
    : Math.min(visibleCount, INIT_MESSAGES.length);

  return (
    <div
      className={`preloader-overlay${exiting ? " preloader-exit" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading application"
    >
      <div className="preloader-panel">
        <div className="preloader-identity">
          <h1 className="preloader-title">DSA Visualizer</h1>
          <p className="preloader-subtitle">VNRVJIET</p>
        </div>

        <div className="preloader-system">
          {INIT_MESSAGES.slice(0, visibleCount).map((msg) => (
            <div key={msg} className="preloader-message">
              <span className="preloader-check" aria-hidden="true">
                ✓
              </span>
              <span>{msg}</span>
            </div>
          ))}

          {showReady && <div className="preloader-ready">Ready</div>}
        </div>

        <div className="preloader-progress-wrap">
          <div className="preloader-progress-meta">
            <span>System initialization</span>
            <span>
              {activeStep}/{INIT_MESSAGES.length}
              {showReady ? " · complete" : ""}
            </span>
          </div>
          <div className="preloader-progress-track">
            <div
              className="preloader-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preloader;
