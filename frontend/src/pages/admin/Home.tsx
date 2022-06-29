import useContractAddress from "hooks/useContractAddress";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import ContractAddresses from "utils/contractAddresses.json";
import TrustCFA from "utils/TrustCFA.json";

export default function AdminHome() {
  const { register, handleSubmit } = useForm();

  const [contractMethods] = useContractAddress(ContractAddresses[80001].TrustCFA[0], TrustCFA.abi);

  const submit = async (submit) => {
    const { walletAddress, paymentType } = submit;
    const response = await contractMethods?._createCompany(paymentType, walletAddress, 0);
    console.log(response);
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <div className="row mb-3">
        <div className="col-4">
          <div className="row">
            <Form.Group controlId="address">
              <Form.Label>Wallet Address</Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Add wallet address, email, mobile number"
                {...register("walletAddress", {
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
          <Form.Group controlId="paymentType">
            <Form.Label>Payment Type</Form.Label>
            <Form.Control
              type="text"
              className="form-control text-center"
              placeholder="1"
              {...register("paymentType", {
                required: {
                  message: "This field is required",
                  value: true,
                },
                valueAsNumber: true,
              })}
            />
          </Form.Group>
        </div>
      </div>
      <div>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}