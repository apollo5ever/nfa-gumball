import React, { useContext, useEffect, useState } from "react";
import Machine from "./machineCard";
import { Row, Col, Container } from "react-bootstrap";
import dateString from "../dateString";
import { useGetSC } from "../hooks/useGetSC";
import hex2a from "../hex2a";
import { LoginContext } from "../LoginContext";
import { SCIDS } from "../utils/helpers";
import { useGetMachine } from "../hooks/useGetMachine";
import { useGetBalance } from "../hooks/useGetBalance";
import { useGetNFA } from "../hooks/useGetNFA";
import AssetCard from "./assetCard";

export default function View() {
  const [getSC] = useGetSC();
  const [machines, setMachines] = useState([]);
  const [state, setState] = useContext(LoginContext);
  const [getMachine] = useGetMachine();
  const [getBalance] = useGetBalance();
  const [getNFA] = useGetNFA();
  const [userCollection, setUserCollection] = useState([]);
  useEffect(() => {
    async function fetchSC() {
      const data = await getSC(SCIDS.GUMBALL_SIM, true, true);
      console.log(data);
    }
    fetchSC();
  }, []);

  useEffect(() => {
    async function fetchSC() {
      let collection = [];
      const data = await getSC(SCIDS.GUMBALL_SIM, true, true);

      const soldNFAs = Object.keys(data.balances).filter(
        (key) => data.balances[key] === 0
      );
      for (var scid of soldNFAs) {
        const bal = await getBalance(scid);
        if (bal != 0) {
          collection.push(scid);
        }
      }
      setUserCollection(collection);
    }
    fetchSC();
  }, [state.daemonMode, state.deroBridgeApiRef]);

  return (
    <>
      <Container>
        <Row>
          {userCollection.map((x) => (
            <AssetCard scid={x} />
          ))}
        </Row>
      </Container>
    </>
  );
}
