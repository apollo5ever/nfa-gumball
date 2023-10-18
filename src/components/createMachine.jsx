import React, { useContext, useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useSendTransaction } from "../hooks/useSendTransaction";
import { useGetAddress } from "../hooks/useGetAddress";
import { useGetGasEstimate } from "../hooks/useGetGasEstimate";
import { SCIDS } from "../utils/helpers";
import { LoginContext } from "../LoginContext";

export default function CreateMachine() {
  const [sendTransaction] = useSendTransaction();
  const [getGasEstimate] = useGetGasEstimate();
  const [getAddress] = useGetAddress();
  const [assets, setAssets] = useState([""]);
  const [formData, setFormData] = useState({});
  const [state, setState] = useContext(LoginContext);

  const handleChange = (event) => {
    const { id, value, type, checked } = event.target;

    if (type === "checkbox") {
      const isChecked = checked ? 1 : 0;
      setFormData((prevData) => ({ ...prevData, [id]: isChecked }));
    } else {
      setFormData((prevData) => ({ ...prevData, [id]: value }));
    }
  };

  const handleAddAsset = () => {
    setAssets((prevAssets) => [...prevAssets, ""]);
  };

  const handleAssetChange = (index, value) => {
    const updatedAssets = [...assets];
    updatedAssets[index] = value;
    setAssets(updatedAssets);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(
      formData.price,
      formData.price * 100000,
      parseInt(formData.price * 100000)
    );
    const price = parseInt((formData.price * 100000).toFixed(5));

    const signer = await getAddress(state.deroBridgeApiRef);
    const startTimestampInSeconds =
      new Date(formData.startTimestamp).getTime() / 1000;
    const expireTimestampInSeconds =
      new Date(formData.expireTimestamp).getTime() / 1000;
    var assetList = "";
    var transfers = [];
    for (var a of assets) {
      assetList += a + "00000000000000000001";
      transfers.push({
        scid: a,
        burn: 1,
      });
    }
    console.log("assetLIst", assetList);

    const data = {
      scid: SCIDS.GUMBALL_SIM,
      ringsize: 2,
      transfers: transfers,
      signer: signer,
      sc_rpc: [
        {
          name: "entrypoint",
          datatype: "S",
          value: "CreateMachine",
        },
        {
          name: "name",
          datatype: "S",
          value: formData.name,
        },
        {
          name: "image",
          datatype: "S",
          value: formData.image,
        },
        {
          name: "desc",
          datatype: "S",
          value: formData.desc,
        },
        {
          name: "assetList",
          datatype: "S",
          value: assetList,
        },
        {
          name: "price",
          datatype: "U",
          value: price,
        },
        {
          name: "priceAssetId",
          datatype: "S",
          value:
            "0000000000000000000000000000000000000000000000000000000000000000",
        },
        {
          name: "startTimestamp",
          datatype: "U",
          value: parseInt(startTimestampInSeconds),
        },
        {
          name: "expireTimestamp",
          datatype: "U",
          value: parseInt(expireTimestampInSeconds),
        },
        {
          name: "dispenseCooldown",
          datatype: "U",
          value: parseInt(formData.dispenseCooldown),
        },
        {
          name: "minDispense",
          datatype: "U",
          value: parseInt(formData.minDispense),
        },
        {
          name: "maxDispense",
          datatype: "U",
          value: parseInt(formData.maxDispense),
        },
        {
          name: "lock",
          datatype: "U",
          value: parseInt(formData.lock),
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
          value: "CreateMachine",
        },
        {
          name: "name",
          datatype: "S",
          value: formData.name,
        },
        {
          name: "image",
          datatype: "S",
          value: formData.image,
        },
        {
          name: "desc",
          datatype: "S",
          value: formData.desc,
        },
        {
          name: "assetList",
          datatype: "S",
          value: assetList,
        },
        {
          name: "price",
          datatype: "U",
          value: price,
        },
        {
          name: "priceAssetId",
          datatype: "S",
          value:
            "0000000000000000000000000000000000000000000000000000000000000000",
        },
        {
          name: "startTimestamp",
          datatype: "U",
          value: parseInt(startTimestampInSeconds),
        },
        {
          name: "expireTimestamp",
          datatype: "U",
          value: parseInt(expireTimestampInSeconds),
        },
        {
          name: "dispenseCooldown",
          datatype: "U",
          value: parseInt(formData.dispenseCooldown),
        },
        {
          name: "minDispense",
          datatype: "U",
          value: parseInt(formData.minDispense),
        },
        {
          name: "maxDispense",
          datatype: "U",
          value: parseInt(formData.maxDispense),
        },
        {
          name: "lock",
          datatype: "U",
          value: parseInt(formData.lock),
        },
      ],
    };
    const fees = await getGasEstimate(data);
    data.fees = fees;
    console.log("fees", fees);
    sendTransaction(data);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group as={Row} controlId="name">
        <Form.Label column sm={2}>
          Name
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            type="text"
            placeholder="Enter collection name"
            onChange={handleChange}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="image">
        <Form.Label column sm={2}>
          Image
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            type="text"
            placeholder="Enter collection image url"
            onChange={handleChange}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="desc">
        <Form.Label column sm={2}>
          Description
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            as="textarea"
            placeholder="Enter collection description"
            onChange={handleChange}
            style={{
              height: "100%",
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </Col>
      </Form.Group>

      {assets.map((asset, index) => (
        <Form.Group as={Row} controlId={`asset${index}`} key={index}>
          <Form.Label column sm={2}>
            NFA {index + 1}
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              placeholder="Enter NFA scid"
              value={asset}
              onChange={(event) => handleAssetChange(index, event.target.value)}
            />
          </Col>
        </Form.Group>
      ))}

      <Form.Group as={Row}>
        <Col sm={{ span: 10, offset: 2 }}>
          <Button variant="primary" onClick={handleAddAsset}>
            Add NFA
          </Button>
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="price">
        <Form.Label column sm={2}>
          Price
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            type="text"
            placeholder="Enter dispense price in Dero"
            onChange={handleChange}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="startTimestamp">
        <Form.Label column sm={2}>
          Gumball Start Date
        </Form.Label>
        <Col sm={10}>
          <Form.Control type="date" onChange={handleChange} />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="expireTimestamp">
        <Form.Label column sm={2}>
          Gumball Expiry Date
        </Form.Label>
        <Col sm={10}>
          <Form.Control type="date" onChange={handleChange} />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="dispenseCooldown">
        <Form.Label column sm={2}>
          Dispense Cooldown
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            type="number"
            placeholder="Enter dispense cooldown (seconds between dispenses)"
            onChange={handleChange}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="minDispense">
        <Form.Label column sm={2}>
          Min Dispense
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            type="number"
            placeholder="Enter min dispense"
            onChange={handleChange}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="maxDispense">
        <Form.Label column sm={2}>
          Max Dispense
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            type="number"
            placeholder="Enter max dispense"
            onChange={handleChange}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="lock">
        <Form.Label column sm={2}>
          Lock
        </Form.Label>
        <Col sm={10}>
          <Form.Check
            type="checkbox"
            label="Lock (freeze gumball for now)"
            checked={formData.lock === 1}
            onChange={handleChange}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row}>
        <Col sm={{ span: 10, offset: 2 }}>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Col>
      </Form.Group>
    </Form>
  );
}
