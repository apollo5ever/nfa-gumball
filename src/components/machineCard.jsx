import React, { useContext, useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useSendTransaction } from "../hooks/useSendTransaction";
import { useGetGasEstimate } from "../hooks/useGetGasEstimate";
import { useGetRandomAddress } from "../hooks/useGetRandomAddress";
import { useGetMachine } from "../hooks/useGetMachine";
import { useGetNFA } from "../hooks/useGetNFA";
import { Ratio } from "react-bootstrap";
import { LoginContext } from "../LoginContext";
import CollectionGrid from "./collectionGrid";
import { SCIDS } from "../utils/helpers";
import { findPurchased } from "../utils/extraElement";

export default function Machine({
  name,
  description,
  sold,
  price,
  release,
  image,
  available,
  collection,
  id,
  max,
  min,
}) {
  const [sendTransaction] = useSendTransaction();
  const [getGasEstimate] = useGetGasEstimate();
  const [getRandomAddress] = useGetRandomAddress();
  const [getMachine] = useGetMachine();
  const [getNFA] = useGetNFA();
  const [showModal, setShowModal] = useState(false);
  const [purchaseModal, setPurchaseModal] = useState(false);
  const [purchasedArr, setPurchasedArr] = useState([]);
  const [state, setState] = useContext(LoginContext);
  const [quantity, setQuantity] = useState(1);
  const [realAvail, setRealAvail] = useState(available);

  const handleIncrementQuantity = () => {
    if (quantity < realAvail && quantity < max) {
      setQuantity((prevCount) => prevCount + 1);
    }
  };

  const handleDecrementQuantity = () => {
    if (quantity > min) {
      setQuantity((prevCount) => prevCount - 1);
    }
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setPurchaseModal(false);
  };

  useEffect(() => {
    async function fetchCollection() {}
  }, [showModal]);

  const dispense = async () => {
    console.log("state", state);
    let updatedMachine;
    const destination = await getRandomAddress();
    var data = {
      scid: SCIDS.GUMBALL_SIM,
      ringsize: 2,
      signer: state.userAddress,
      transfers: [
        {
          destination: destination,
          burn: price * quantity,
        },
      ],
      sc_rpc: [
        {
          name: "entrypoint",
          datatype: "S",
          value: "Purchase",
        },
        {
          name: "id",
          datatype: "U",
          value: id,
        },
        {
          name: "price",
          datatype: "U",
          value: price,
        },
        {
          name: "quantity",
          datatype: "U",
          value: quantity,
        },
      ],
      gas_rpc: [
        {
          name: "SC_ACTION",
          datatype: "U",
          value: 0,
        },
        {
          name: "SC_ID",
          datatype: "H",
          value: SCIDS.GUMBALL_SIM,
        },
        {
          name: "entrypoint",
          datatype: "S",
          value: "Purchase",
        },
        {
          name: "id",
          datatype: "U",
          value: id,
        },
        {
          name: "price",
          datatype: "U",
          value: price,
        },
        {
          name: "quantity",
          datatype: "U",
          value: quantity,
        },
      ],
    };

    const fees = await getGasEstimate(data);
    data.fees = fees + 111;
    console.log("fees", fees);
    sendTransaction(data).then(async () => {
      setState(() => ({ ...state, pending: true }));
      setRealAvail(realAvail - quantity);
      setTimeout(async () => {
        updatedMachine = await getMachine(id);
        const scidArr = findPurchased(collection, updatedMachine.collection);
        let soldArr = [];
        for (var scid of scidArr) {
          soldArr.push(await getNFA(scid));
        }

        setPurchaseModal(true);
        setState(() => ({ ...state, pending: false }));

        setPurchasedArr(soldArr);
      }, 20000);
    });
  };

  return (
    <>
      <Card
        style={{ width: "24rem", margin: "1rem", height: "36rem" }}
        bg="dark"
        text="white"
      >
        <Ratio aspectRatio="1x1">
          <Card.Img
            style={{ "object-fit": "cover" }}
            variant="top"
            src={image}
          />
        </Ratio>

        <Card.Body className="position-relative">
          <Card.Title>{name}</Card.Title>
          <Card.Link
            className="position-absolute bottom-0 end-o mb-3 me-3"
            href="#"
            onClick={handleShow}
          >
            See More
          </Card.Link>
          <div className="position-absolute bottom-0 end-0 mb-3 me-3">
            {!realAvail ? (
              "Sold Out"
            ) : (
              <>
                <Button
                  variant="outline-secondary"
                  onClick={handleDecrementQuantity}
                >
                  -
                </Button>
                <Button variant="primary" onClick={dispense}>
                  Dispense {quantity} ({(price * quantity) / 100000} Dero)
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={handleIncrementQuantity}
                >
                  +
                </Button>
              </>
            )}
          </div>
        </Card.Body>
      </Card>

      <Modal show={purchaseModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Congratulations! You've received{" "}
            {purchasedArr.map((x, index) => (
              <React.Fragment key={x.id}>
                {x.name}
                {index !== purchasedArr.length - 1 && ","}
              </React.Fragment>
            ))}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          {purchasedArr.map((x) => (
            <>
              <img src={x.coverURL} />
              <p>{x.scid}</p>
            </>
          ))}
          {/* collection grid

          <CollectionGrid collection={getCollection(collectionID)}
          
          */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {!realAvail ? (
            "Sold Out"
          ) : (
            <>
              <Button
                variant="outline-secondary"
                onClick={handleDecrementQuantity}
              >
                -
              </Button>
              <Button variant="primary" onClick={dispense}>
                Dispense {quantity} ({(price * quantity) / 100000} Dero)
              </Button>
              <Button
                variant="outline-secondary"
                onClick={handleIncrementQuantity}
              >
                +
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <img src={image} />
          <p>{description}</p>
          <CollectionGrid collection={collection} />
          {/* collection grid

          <CollectionGrid collection={getCollection(collectionID)}
          
          */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {!realAvail ? (
            "Sold Out"
          ) : (
            <>
              <Button
                variant="outline-secondary"
                onClick={handleDecrementQuantity}
              >
                -
              </Button>
              <Button variant="primary" onClick={dispense}>
                Dispense {quantity} ({(price * quantity) / 100000} Dero)
              </Button>
              <Button
                variant="outline-secondary"
                onClick={handleIncrementQuantity}
              >
                +
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}
