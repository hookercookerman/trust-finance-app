import { Card, Col, Container, Row } from "react-bootstrap";
import PolygonLogo from "assets/images/polygon.png";
import EthGlobalLogo from "assets/images/ethglobal.png";
import ChainlinkLogo from "assets/images/chainlink.png";
import SuperfluidLogo from "assets/images/superfluid.png";

const PartnerImages = [
  {
    id: 1,
    image: ChainlinkLogo,
  },
  {
    id: 2,
    image: PolygonLogo,
  },
  {
    id: 3,
    image: EthGlobalLogo,
  },
  {
    id: 4,
    image: SuperfluidLogo,
  },
];

export default function Partners() {
  return (
    <Container>
      <div className="text-center">
        <h1 className="p-3 mt-5 text-primary">Partners</h1>
      </div>
      <Row className="d-flex px-3">
        {
          PartnerImages.map((partner) => (
            <Col md={3} key={partner.id}>
              <Card className="border-0">
                <Card.Body>
                  <Card.Img
                    src={partner.image}
                    className="partner_image"
                  />
                </Card.Body>
              </Card>
            </Col>
          ))
        }
      </Row>
    </Container>
  );
}
