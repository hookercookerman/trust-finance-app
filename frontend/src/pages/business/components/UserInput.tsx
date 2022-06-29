import { Button, Form } from "react-bootstrap";
import { BsPlusLg, BsDashLg } from "react-icons/bs";
import { useFormContext } from "react-hook-form";

export default function UserInput({ id, handleAdd, handleRemove }) {
  const { register } = useFormContext();

  return (
    <div className="row mb-3">
      <div className="col-4">
        <div className="row">
          <Form.Group controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              className="form-control"
              placeholder="Add wallet address, email, mobile number"
              {...register(`${id}-employeeAddress`, {
                required: {
                  message: "This field is required",
                  value: true,
                }
              })}
            />
          </Form.Group>
        </div>
      </div>
      <div className="col-2">
        <Form.Group controlId="amount">
          <Form.Label>Amount (ETH)</Form.Label>
          <Form.Control
            type="text"
            className="form-control text-center"
            placeholder="1000"
            {...register(`${id}-salary`, {
              required: {
                message: "This field is required",
                value: true,
              }
            })}
          />
        </Form.Group>
      </div>
      <div className="col-2">
        <div className="col-12">
          <Form.Group className="mb-3" controlId="reason">
            <Form.Label>Reason for payment</Form.Label>
            <Form.Select
              className="form-select"
              {...register(`${id}-reason`, {
                required: {
                  message: "This field is required",
                  value: true,
                },
              })}
              aria-label="select reason"
            >
              <option value="1">Payroll</option>
              <option value="2">Travel</option>
              <option value="3">Subscriptions</option>
              <option value="3">Professional Fees</option>
              <option value="3">Utilities</option>
            </Form.Select>
          </Form.Group>
        </div>
      </div>
      <div className="col-2">
        <Form.Group className="mb-3" controlId="interval">
          <Form.Label>Payment Interval</Form.Label>
          <Form.Select className="form-select" 
          {...register(`${id}-interval`, {
            required: {
              message: "This field is required",
              value: true,
            }
          })}>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </Form.Select>
        </Form.Group>
      </div>
      <div className="col-2 mt-4 pt-2">
        <Button className="me-3" variant="outline-success" onClick={handleAdd}>
          <BsPlusLg />
        </Button>
        <Button variant="outline-danger" onClick={() => handleRemove(id)}>
          <BsDashLg />
        </Button>
      </div>
    </div>
  );
}
