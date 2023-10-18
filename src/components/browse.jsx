import React, { useContext, useEffect, useState } from "react";
import Machine from "./machineCard";
import { Row, Col, Container } from "react-bootstrap";
import dateString from "../dateString";
import { useGetSC } from "../hooks/useGetSC";
import hex2a from "../hex2a";
import { LoginContext } from "../LoginContext";
import { SCIDS } from "../utils/helpers";
import { useGetMachine } from "../hooks/useGetMachine";

export default function Browse() {
  const [getSC] = useGetSC();
  const [machines, setMachines] = useState([]);
  const [state, setState] = useContext(LoginContext);
  const [getMachine] = useGetMachine();
  useEffect(() => {
    async function fetchSC() {
      const data = await getSC(SCIDS.GUMBALL_SIM, false, true);
      for (var i = 0; i < data.stringkeys.gb_ctr; i++) {
        let assetList = [];
        for (var a = 0; a < data.stringkeys[`gb_${i}_storeIndex`]; a++) {
          assetList.push(hex2a(data.stringkeys[`gb_${i}_dp_${a}_asset`]));
        }
        let machine = await getMachine(i);
        setMachines((machines) => [...machines, machine]);
      }
    }
    fetchSC();
  }, []);

  useEffect(() => {
    setMachines([]);
    async function fetchSC() {
      const data = await getSC(SCIDS.GUMBALL_SIM, false, true);
      for (var i = 0; i < data.stringkeys.gb_ctr; i++) {
        let assetList = [];
        for (var a = 0; a < data.stringkeys[`gb_${i}_storeIndex`]; a++) {
          assetList.push(hex2a(data.stringkeys[`gb_${i}_dp_${a}_asset`]));
        }
        let machine = await getMachine(i);
        setMachines((machines) => [...machines, machine]);
      }
    }
    fetchSC();
  }, [state.daemonMode, state.deroBridgeApiRef]);

  return (
    <>
      <Container>
        <Row>
          {machines.length == 0
            ? "No gumball machines found. Check connection or create the first!"
            : ""}
          {machines.map((x) => (
            <Col key={x.id}>
              <Machine
                id={x.id}
                name={x.name}
                price={x.price}
                description={x.description}
                release={dateString(0)}
                sold={0}
                image={x.image}
                available={x.collection.length}
                collection={x.collection}
                min={x.min}
                max={x.max}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}
