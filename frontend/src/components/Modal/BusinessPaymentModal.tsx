import { Button, Modal } from "react-bootstrap";

export default function BusinessPaymentModal({ show, handleClose }) {
  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Select a payment method</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-grid gap-4">
          <Button variant="primary" size="lg">
            Fixed Payment
          </Button>
          <Button variant="primary" size="lg">
            Recurring Payment
          </Button>
          <Button variant="primary" size="lg">
            Stream Payment
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
