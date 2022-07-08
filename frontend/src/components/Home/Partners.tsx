import {Col, Container, Row } from "react-bootstrap";
import PolygonLogo from "assets/images/polygon.png";
import EthGlobalLogo from "assets/images/ethglobal.png";
import ChainlinkLogo from "assets/images/chainlink.png";
import SuperfluidLogo from "assets/images/superfluid.png";

const PartnerImages = [
  {
    id: 1,
    image: EthGlobalLogo,
  },
  {
    id: 2,
    image: PolygonLogo,
  },
  {
    id: 3,
    image: ChainlinkLogo,
  },
  {
    id: 4,
    image: SuperfluidLogo,
  },
];

export default function Partners() {
  return (
    <Container className = "bg-primary rounded-3 top-100 start-50 position-absolute translate-middle">
      {/*
      <div className="text-center">
        <h1 className="p-3 mt-5 text-light">Partners</h1>
      </div>
      */
}
      <Row className="d-flex mb-0 align-items-center mx-auto p-3">
        {
          PartnerImages.map((partner) => (
            <Col md={3} key={partner.id} className = "">
              <img className="img-fluid"src={partner.image} alt=""/>
            </Col>
          ))
        }
      </Row>
    </Container>
  );
}
