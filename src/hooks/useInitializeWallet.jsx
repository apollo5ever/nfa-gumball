import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import { LoginContext } from "../LoginContext";
import DeroBridgeApi from "dero-rpc-bridge-api";
import to from "await-to-js";
import WebSocketService from "../webSocketService";
import { useGetAddress } from "./useGetAddress";

export function useInitializeWallet() {
  const [state, setState] = useContext(LoginContext);
  const deroBridgeApiRef = useRef();
  const [getAddress] = useGetAddress();

  async function initXSWD() {
    const ws = new WebSocketService("ws://localhost:44326/xswd");

    async function initializeWithRetry() {
      console.log("websocket status check: ", ws.getState());
      while (ws.getState() === 0) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      const payload = {
        id: "ed606a2f4c4f499618a78ff5f7c8e51cd2ca4d8bfa7e2b41a27754bb78b1df1f",
        name: "Private Islands",
        description: "The World's Most Resilient Crowd-Funding Platform",
        url: "https://privateislands.fund",
      };

      const handleResponse = async (response) => {
        if (response === "User has authorized the application") {
          console.log("authenticated!");
          const address = await getAddress();
          setState((state) => ({ ...state, ws: ws, userAddress: address }));
        }
      };

      ws.socket.addEventListener("message", (event) => {
        const response = JSON.parse(event.data);
        handleResponse(response.message);
      });

      ws.sendPayload(payload);
    }

    initializeWithRetry();
  }

  const initRPC = async () => {
    console.log("initialize rpc wallet");
    if (state.ws) {
      state.ws.closeConnection();
    }

    deroBridgeApiRef.current = new DeroBridgeApi();
    const deroBridgeApi = deroBridgeApiRef.current;

    const [err] = await to(deroBridgeApi.init());
    if (err) {
      console.log("ERR", err);
    } else {
      const address = await getAddress(deroBridgeApiRef);
      setState((state) => ({
        ...state,
        deroBridgeApiRef: deroBridgeApiRef,
        ws: null,
        userAddress: address,
      }));
    }
  };

  async function initializeWallet() {
    if (state.walletMode == "rpc") {
      initRPC();
    } else if (state.walletMode == "xswd") {
      initXSWD();
    }
  }

  return [initializeWallet];
}
