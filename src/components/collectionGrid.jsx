import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import dateString from "../dateString";
import AssetCard from "./assetCard";

export default function CollectionGrid({ collection }) {
  return (
    <>
      <Container>
        <Row>
          {collection.map((x) => (
            <Col key={x}>
              <AssetCard scid={x} />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}
