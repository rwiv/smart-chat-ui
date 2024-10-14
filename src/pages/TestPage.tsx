import {useEffect, useState} from "react";
import {login, LoginRequest} from "@/client/account.ts";
import {SketchCanvasTest} from "@/components/canvas/SketchCanvasTest.tsx";

export function TestPage() {

  const [isLogin, setIsLogin] = useState(false);

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
      {isLogin && (
        <SketchCanvasTest />
      )}
    </div>
  )
}
