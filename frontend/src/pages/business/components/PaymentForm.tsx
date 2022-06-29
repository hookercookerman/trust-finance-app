import LoadingButton from "components/LoadingButton";
import TransactionTables from "components/Tables/TransactionTables";
import useBoolean from "hooks/useBoolean";
import { useCallback, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { BsPencilSquare, BsXLg } from "react-icons/bs";
import { useTransactions } from "store";

type PaymentProps = {
  paymentType: string;
};

const PAYMENT_FIELDS = [
  {
    title: "Network",
    name: "network",
    placeholder: "Ethereum (ERC20)",
  },
  {
    title: "Wallet Address",
    name: "walletAddress",
  },
  {
    title: "Amount",
    name: "amount",
    placeholder: "USDC",
  },
  {
    title: "Reason",
    name: "reason",
  },
];

export type UserInput = {
  network: string;
  walletAddress: string;
  amount: number | null;
  reason: string;
  acknowledge: boolean;
  frequency?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  paymentType?: string;
};

export default function PaymentForm({ paymentType }: PaymentProps) {
  const [payments, setPayments] = useState<UserInput[]>([]);
  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      network: "",
      walletAddress: "",
      amount: null,
      reason: "",
      acknowledge: false,
      frequency: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      paymentType,
    },
  });
  const [sendingPayment, setSendingPayment] = useBoolean();
  const [setFixed, setRecurring, setStream]  = useTransactions((state: any) => [state.setFixed, state.setRecurring, state.setStream]);

  const addEmployee = useCallback(
    (data: UserInput) => {
      setPayments([...payments, data]);
      reset();
    },
    [payments, reset],
  );

  const deleteUser = useCallback(
    (data: UserInput) => {
      const removed = payments.filter((address) => address.walletAddress !== data.walletAddress);
      setPayments(removed);
    },
    [payments],
  );

  const editUser = useCallback(
    (data) => {
      const toEdit = payments.find((address) => address.walletAddress === data.walletAddress);
      deleteUser(data);
      setValue("network", toEdit?.network as string);
      setValue("walletAddress", toEdit?.walletAddress as string);
      setValue("amount", toEdit?.amount as any);
      setValue("reason", toEdit?.reason as string);
      setValue("frequency", toEdit?.frequency as string);
    },
    [payments, deleteUser, setValue],
  );

  const sendPayment = useCallback(() => {
    setTimeout(() => {
      setSendingPayment.off();
      if (paymentType === "fixed") {
        setFixed(payments);
      }
      if (paymentType === "recurring") {
        setRecurring(payments);
      }
      if (paymentType === "stream") {
        setStream(payments);
      }
    }, 3000);
    setSendingPayment.on();
  }, [paymentType, payments, setFixed, setRecurring, setSendingPayment, setStream]);

  return (
    <>
      <div>
        <Row>
          {paymentType === "fixed" ? (
            <>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="payment date">
                  <Form.Label>Payment Date</Form.Label>
                  <Form.Control
                    type="date"
                    {...register("startDate", {
                      required: {
                        message: "Date is required",
                        value: true,
                      },
                    })}
                    placeholder="DD/MM/YYYY"
                  />
                </Form.Group>
              </Col>
              <Col md={2}></Col>
            </>
          ) : (
            <div className="d-flex justify-content-between w-50 gap-4">
              <Col md={6}>
                <Form.Group className="mb-3" controlId="startDate">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    {...register("startDate", {
                      required: {
                        message: "Date is required",
                        value: true,
                      },
                    })}
                    placeholder="DD/MM/YYYY"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="endDate">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    {...register("endDate", {
                      required: {
                        message: "Date is required",
                        value: true,
                      },
                    })}
                    placeholder="DD/MM/YYYY"
                  />
                </Form.Group>
              </Col>
            </div>
          )}
          <Col md={6}>
            <div className="d-flex justify-content-end gap-3 mt-4 pt-2 me-4 ms-auto">
              <LoadingButton disabled={!payments.length} buttonText="Send Payment" isLoading={sendingPayment} handleClick={sendPayment} />
            </div>
          </Col>
        </Row>
        <Card>
          <Card.Body className="p-4 payment_card">
            <Row>
              <Col md={8}>
                {paymentType === "recurring" && (
                  <Form.Group
                    className="mb-3 d-flex flex-row justify-content-between align-items-center"
                    controlId="frequency"
                  >
                    <Form.Label className="mb-0">Frequency</Form.Label>
                    <Form.Control
                      type="text"
                      className="w-75"
                      {...register("frequency", { required: true })}
                      placeholder="Daily"
                    />
                  </Form.Group>
                )}
                {PAYMENT_FIELDS.map((field) => (
                  <Form.Group
                    className="mb-3 d-flex flex-row justify-content-between align-items-center"
                    key={field.title}
                    controlId={field.title}
                  >
                    <Form.Label className="mb-0">{field.title}</Form.Label>
                    <Form.Control
                      type="text"
                      className="w-75"
                      placeholder={field.placeholder}
                      // @ts-ignore
                      {...register(field.name, { required: true })}
                    />
                  </Form.Group>
                ))}
                <Form.Group
                  className="mb-3 d-flex flex-row justify-content-between align-items-center"
                  controlId="acknowledge"
                >
                  <Form.Label className="mb-0">Acknowledge</Form.Label>
                  <Form.Text id="passwordHelpBlock" className="w-75 d-flex">
                    <Form.Check className="me-3" type="checkbox" {...register("acknowledge")} />
                    Please make sure you enter the correct withdrawal address of the transfer
                    network you selected. Withdrawal order cannot be cancelled after creation.
                  </Form.Text>
                </Form.Group>

                <Row className="mt-4">
                  <Col md={12}>
                    <div className="d-flex gap-3 justify-content-end">
                      {/* @ts-ignore */}
                      <Button variant="outline-primary" onClick={handleSubmit(addEmployee)}>
                        Add Recepient
                      </Button>
                      {/* <Button variant="primary">Create Payment</Button> */}
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col md={4} className="border border-1 rounded-2">
                <div className="overflow-auto h-100 py-3 address_card">
                  {payments?.map((address: any) => (
                    <Card key={address.walletAddress} className="p-3 mb-3">
                      <div className="d-flex gap-4 justify-content-end mb-2">
                        <span onClick={() => editUser(address)}>
                          <BsPencilSquare className="text-info cursor_pointer" />
                        </span>
                        <span onClick={() => deleteUser(address)}>
                          <BsXLg className="text-danger cursor_pointer" />
                        </span>
                      </div>
                      <p className="mb-0">Address: {address.walletAddress}</p>
                      <p className="mb-0">Amount: {address.amount}</p>
                    </Card>
                  ))}
                  {!payments.length && (
                    <div className="d-flex justify-content-center align-items-center">
                      <p className="text-muted">Saved employee information will show here</p>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
      <div className="mt-4">
        <Card>
          <Card.Body>
            <TransactionTables type={paymentType} />
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
