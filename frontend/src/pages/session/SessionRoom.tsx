
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const SessionRoom = () => {
  const { roomId } = useParams();
  const containerRef = useRef(null);

  const appID = 1316344511;
  const serverSecret = "872daf0c3506c4ee496abe8da43bd647"; 

  useEffect(() => {
    const initMeeting = async () => {
      if (!roomId) return;

      const userID = Date.now().toString(); 
      const userName = "Your Name"; 

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        userID,
        userName
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: containerRef.current,
        sharedLinks: [
          {
            name: "Copy Session Link",
            url: `${window.location.origin}/session/${roomId}`,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall, 
        },
        showScreenSharingButton: true,
      });
    };

    initMeeting();
  }, [roomId]);

  return (
     <div
      ref={containerRef}
      className="sticky inset-0  w-screen h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center"
    >
      <p className="text-gray-500 text-sm">Loading your session...</p>
    </div>
  );
};

export default SessionRoom;
