import { Card, Col, Container, Row } from "react-bootstrap";

export default function Features() {
  return (
    <Container>
      <Row className="mt-5 ms-4">
        <Col md={6}>
          <p className="h1 text-primary">Product Features</p>
          <p>Trust Finance help you...</p>
          <ol className="ps-3">
            <li>grow your community and number of users through real time payment</li>
            <li>
              attract and retain the best talents through innovative benefits package
            </li>
            <li>stay compliant and manage risk through better accounting and transaction monitoring</li>
          </ol>
        </Col>
        <Col></Col>
      </Row>
      <Row className="d-flex p-3">
        <Col md={4} sm={12}>
          <Card className="border-0">
            <Card.Body>
              <Card.Title className="mb-4 text-primary">PAYMENT</Card.Title>
              <Card.Text className="me-5 pe-5">
                Attract the best talents through our innovative real time
                investing matching and yield generation from income.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={12}>
          <Card className="border-0">
            <Card.Body>
              <Card.Title className="mb-4 text-primary">BENEFITS</Card.Title>
              <Card.Text className="me-5 pe-5">
                Attract the best talents through our innovative real time
                investing matching and yield generation from income.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={12}>
          <Card className="border-0">
            <Card.Body>
              <Card.Title className="mb-4 text-primary">ACCOUNTING</Card.Title>
              <Card.Text className="me-5 pe-5">
                Attract the best talents through our innovative real time
                investing matching and yield generation from income.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}