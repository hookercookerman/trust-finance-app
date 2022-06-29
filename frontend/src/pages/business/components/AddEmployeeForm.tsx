import { useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useFieldArray, useForm } from "react-hook-form";
import { BsDashLg, BsPlusLg } from "react-icons/bs";


export default function AddEmployeeForm() {
  const { register, control, handleSubmit } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    append({ employeeAddress: "", salary: "", reason: "", interval: "" });
    return () => { remove(); };
  }, [append, remove]);
  
  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      {fields.map((item, index) => (
        <div className="row mb-3" key={item.id}>
          <div className="col-4">
            <div className="row">
              <Form.Group controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control"
                  placeholder="Add wallet address, email, mobile number"
                  {...register(`items-${index}-employeeAddress`, {
                    required: {
                      message: "This field is required",
                      value: true,
                    },
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
                {...register(`items-${index}-salary`, {
                  required: {
                    message: "This field is required",
                    value: true,
                  },
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
                  {...register(`items-${index}-reason`, {
                    required: {
                      message: "This field is required",
                      value: true,
                    },
                  })}
                  aria-label="select reason"
                >
                  <option value="">Reason</option>
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
              <Form.Select
                className="form-select"
                {...register(`items-${index}-interval`, {
                  required: {
                    message: "This field is required",
                    value: true,
                  },
                })}
              >
                <option value="">Interval</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </Form.Select>
            </Form.Group>
          </div>
          <div className="col-2 mt-4 pt-2">
            <Button
              className="me-3"
              variant="outline-success"
              onClick={() =>
                append({ employeeAddress: "", salary: "", reason: "", interval: "" })
              }
            >
              <BsPlusLg />
            </Button>
            <Button variant="outline-danger" onClick={() => remove(index)}>
              <BsDashLg />
            </Button>
          </div>
        </div>
      ))}
      <div className="text-end">
        <Button variant="primary" type="submit">Submit</Button>
      </div>
    </form>
  );
}
