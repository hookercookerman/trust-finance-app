import { Button, Card, Col, Container, Row } from "react-bootstrap";
import Starter from "assets/icons/love_for_money.png";
import Professional from "assets/icons/money_bag.png";
import Enterprise from "assets/icons/cashflow.png";

const pricingRanges = [
 {
  title: "Starter",
  image: Starter,
  price: "$0/mo",
  benefits: ["Less than 3 Employees", "Investment Account \n(Less than 3 Employees)"],
  total: "$0/month",
 },
 {
  title: "Professional",
  image: Professional,
  price: "$39/mo plus $6/mo per person",
  benefits: ["Less than 25 Employees", "Investment Account \n( Less than 25 Employees)", "Accounting & Reporting \n(Less than 250 Trasactions)"],
  total: " $39/month",
 },
 {
  title: "Enterprise",
  image: Enterprise,
  price: "$149/mo plus $12/mo per person",
  benefits: ["Less than 25 Employees", "Investment Account \n(Less than 25 Employees)", "Accounting \n(Less than 1000 Trasactions)", "Custom Reporting"],
  total: "$149/month",
 },
];

export default function Pricing() {
  return (
    <div className="pricing_hero p-4 mb-5 py-3">
      <div className="top-50 end-50 text-center p-3 text-primary">
        <h1>Pricing</h1>
      </div>

      <Container>
        <Row className="d-flex shadow">
          {
            pricingRanges.map((pricing) => (
              <Col md={4} key={pricing.title} className="border-start position-relative">
                <Card className="border-0 py-5 mb-5">
                  <Card.Body className="d-flex flex-column align-items-center">
                    <Card.Title>{pricing.title}</Card.Title>
                    <Card.Text className="text-secondary my-2">{pricing.price}</Card.Text>
                    <Card.Img
                      src={pricing.image}
                      className="pricing_image my-4"
                    />
                    <Card.Text>
                      <ul className="pricing_list ps-0 text-center">
                        {
                          pricing.benefits.map((benefit) => (
                            <li key={benefit.substring(0, 5)} style={{ whiteSpace: "pre" }} className="my-4">· {benefit}</li>
                          ))
                        }
                      </ul>
                    </Card.Text>
                    <hr />
                  </Card.Body>
                </Card>{" "}
                <div className="d-flex align-items-center flex-column w-100 position-absolute bottom-0 start-50 translate-middle">
                  <p>{pricing.total}</p>
                  <Button className="w-50" variant="primary" size="lg">
                    Register
                  </Button>
                </div>
              </Col>
            ))
          }
        </Row>
      </Container>
    </div>
  );
}
