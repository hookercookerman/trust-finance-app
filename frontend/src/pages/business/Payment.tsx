import { Tab, Tabs } from "react-bootstrap";
import PaymentForm from "./components/PaymentForm";

export default function Payment() {
  return (
    <>
      <div className="d-flex align-items-center mb-3">
        <p className="h5 mb-0 text-primary">Payment</p>
      </div>
      <div>
        <Tabs defaultActiveKey="fixed" id="payment" className="mb-3 payment_tab">
          <Tab eventKey="fixed" title="Fixed Payment">
            <PaymentForm paymentType="fixed" />
          </Tab>
          <Tab eventKey="recurring" title="Recurring Payment">
            <PaymentForm paymentType="recurring" />
          </Tab>
          <Tab eventKey="stream" title="Stream Payment">
            <PaymentForm paymentType="stream" />
          </Tab>
        </Tabs>
      </div>
    </>
  );
}
