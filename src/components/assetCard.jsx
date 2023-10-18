import React, { useContext, useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useSendTransaction } from "../hooks/useSendTransaction";
import { Ratio } from "react-bootstrap";
import { LoginContext } from "../LoginContext";
import { useGetNFA } from "../hooks/useGetNFA";

export default function AssetCard({ scid }) {
  const [sendTransaction] = useSendTransaction();
  const [showModal, setShowModal] = useState(false);
  const [state, setState] = useContext(LoginContext);
  const [getNFA] = useGetNFA();
  const [NFA, setNFA] = useState({});

  useEffect(() => {
    async function fetchNFA() {
      const nfa = await getNFA(scid);
      setNFA(nfa);
    }
    fetchNFA();
  }, []);

  return (
    <>
      <Card
        style={{
          width: "12rem",
          margin: "1rem",
          height: "12rem",
          overflow: "hidden",
        }}
        bg="dark"
        text="white"
      >
        <Card.Img
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
          variant="top"
          src={NFA.coverURL}
        />

        <Card.Body className="position-absolute">
          <Card.Title>{NFA.name}</Card.Title>
        </Card.Body>
      </Card>
    </>
  );
}
