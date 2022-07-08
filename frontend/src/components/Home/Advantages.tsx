import { Card, Col, Container, Row } from "react-bootstrap";
import Pricing from "assets/icons/growth.png";
import Reporting from "assets/icons/reporting.png";
import Documentation from "assets/icons/documentation.png";
import HumanSupport from "assets/icons/human_support.png";

const advantageText = [
  {
    id: 1,
    title: "SIMPLE PRICING",
    description: "We provide easy payroll payments and management for your businesses by reducing gas fee and time.",
    img: Pricing,
  },
  {
    id: 2,
    title: "AUTOMATED TRACKING AND REPORTING",
    description: "Attract the best talents through our innovative real time investing matching and yield generation from income.",
    img: Reporting,
  },
  {
    id: 3,
    title: "EASY API DOCUMENTATION",
    description: "Enchance growth and compliance through real time automated transaction tracking, accounting and reporting.",
    img: Documentation,
  },
  {
    id: 4,
    title: "REAL HUMAN SUPPORT",
    description: "Find the best way to connect directly to a human at the company you are trying to contact",
    img: HumanSupport,
  },
];

export default function Advantages() {
  return (
    <Container className="p-4 align-content-center items-center text-center mt-5 py-5">
      <div className="top-50 end-50 text-center p-4 text-primary mt-5 py-auto">
        <h1>Core Advantages</h1>
      </div>
      <Row className="d-flex p-5">
        {
          advantageText.map((advantage) => (
            <Col md={3} sm={12} key={advantage.id}>
              <Card className="border-0 ">
                <Card.Img variant="top" src={advantage.img} className="core_adv mx-auto" />
                <Card.Body className="p-0">
                  <Card.Title className="my-4 fs-6 p-3">{advantage.title}</Card.Title>
                  <Card.Text className="pe-4">
                    {advantage.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        }
      </Row>
    </Container>
  );
}
