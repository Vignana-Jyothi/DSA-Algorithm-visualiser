import { useCallback, useState } from "react";
import App from "./App.jsx";
import Preloader from "./components/Preloader.jsx";

function AppShell() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [appVisible, setAppVisible] = useState(false);

  const handlePreloaderComplete = useCallback(() => {
    setShowPreloader(false);
    requestAnimationFrame(() => setAppVisible(true));
  }, []);

  return (
    <>
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} />}
      <div
        className={`app-shell${appVisible ? " app-enter" : " app-hidden"}`}
        aria-hidden={showPreloader}
      >
        <App />
      </div>
    </>
  );
}

export default AppShell;
