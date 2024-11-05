import {useEffect, useState} from "react";
import {login, LoginRequest} from "@/client/account.ts";
import {RtcVideo} from "@/components/webrtc/RtcVideo.tsx";
import {useMyInfo} from "@/hooks/common/useMyInfo.ts";

export function TestPage() {

  const [isLogin, setIsLogin] = useState(false);
  const {myInfo} = useMyInfo();

  useEffect(() => {
    onLoginUser1().then(() => setIsLogin(true));
  }, []);

  const onLoginUser1 = async () => {
    const req: LoginRequest = {
      username: "user1@gmail.com",
      password: "1234",
    };
    await login(req, false);
  }

  return (
    <div>
      {isLogin && myInfo && (
        <RtcVideo
          mediaStream={new MediaStream()}
          account={myInfo}
          type="DEFAULT"
        />
        // <SketchCanvasTest />
      )}
    </div>
  )
}
