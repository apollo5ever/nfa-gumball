import { useContext } from "react";
import { LoginContext } from "./LoginContext";
import WebSocketService from "./webSocketService";
//import LoggerContext, { LOG } from "@/components/providers/LoggerContext.jsx";

export function useInitXSWD() {
  const [state, setState] = useContext(LoginContext);
  // const logger = useContext(LoggerContext);

  async function initXSWD() {
    return new Promise((resolve, reject) => {
      const payload = {
        id: "ed606a2f4c4f499618a78ff5f7c8e51cd2ca4d8bfa7e2b41a27754bb78b1df1f",
        name: "NFA GUMBALL",
        description: "FUN!",
        url: "https://dero.ao",
      };

      const handleResponse = (response) => {
        if (response == "User has authorized the application") {
          console.log("authenticated!");
          setState((state) => ({ ...state, authenticated: true }));
        }
      };
      state.ws.socket.addEventListener("message", (event) => {
        const response = JSON.parse(event.data);
        handleResponse(response.message);
      });

      // Send the payload

      state.ws.sendPayload(payload);
    });

    return res.data.result;
  }

  return [initXSWD];
}
