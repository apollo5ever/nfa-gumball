import React, { useState, useContext, useCallback } from "react";
import { LoginContext } from "../LoginContext";
import to from "await-to-js";
import WebSocketService from "../webSocketService";

export function useGetBalance() {
  const [state, setState] = useContext(LoginContext);

  const getBalanceRPC = useCallback(async (scid) => {
    if (state.activeWallet !== 0) return;
    const deroBridgeApi = state.deroBridgeApiRef.current;
    const [err, res] = await to(
      deroBridgeApi.wallet("get-balance", {
        scid: scid,
      })
    );
    console.log("rpc balance check", scid, res);
    return res.data.result.balance;
  });

  const getBalanceXSWD = async (scid) => {
    return new Promise((resolve, reject) => {
      const payload = {
        jsonrpc: "2.0",
        method: "GetBalance",
        id: `balance${scid}`,
        params: { scid: scid },
      };

      const handleResponse = (response) => {
        if (response.id === `"balance${scid}"`) {
          resolve(response.result.balance);
        }
      };

      // Subscribe to WebSocket messages
      state.ws.socket.addEventListener("message", (event) => {
        const response = JSON.parse(event.data);
        handleResponse(response);
      });

      // Send the payload
      state.ws.sendPayload(payload);
    });
  };

  async function getBalance(scid) {
    if (state.walletMode == "xswd") {
      return await getBalanceXSWD(scid);
    } else if (state.walletMode == "rpc") {
      return await getBalanceRPC(scid);
    }
  }

  return [getBalance];
}
