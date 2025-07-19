import { useState, useEffect } from "react";
import { BiExpand, BiExitFullscreen } from "react-icons/bi"; // Import icons from react-icons
import './fullScreenButton.css'
function FullScreenButton() {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenToggle = () => {
    const elem = document.documentElement; // <-- full HTML page!
  
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err) => console.error(err));
      setIsFullScreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullScreen(false);
    }
  };
  

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  return (
    <button onClick={handleFullScreenToggle} className="fullscreen-btn" >
      {isFullScreen ? (
        <>
          <BiExitFullscreen size={20} style={{ marginRight: "8px" }} />
          Exit Fullscreen
        </>
      ) : (
        <>
          <BiExpand size={20} style={{ marginRight: "8px" }} />
          Enter Fullscreen
        </>
      )}
    </button>
  );
}

export default FullScreenButton;
