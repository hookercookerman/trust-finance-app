import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { BsFilter } from "react-icons/bs";
import { useTransactions } from "store";

type Props = {
  type?: string;
  location?: string;
}

export default function TransactionTables({ type, location }: Props) {
  const [fixed, recurring, stream] = useTransactions((state) => [state.fixed, state.recurring, state.stream]);

  return (
    <div>
      <Row>
        <Col md={2}>
          <Form.Select aria-label="Default select example">
            <option>Search By</option>
            <option value="reason">Reason</option>
            <option value="network">Network</option>
          </Form.Select>
        </Col>
        <Col md={8}>
          <Form.Control type="text" placeholder={`Search for ${type} payments`} />
        </Col>
        <Col md={2}>
          <Button>
            <BsFilter /> Filters
          </Button>
        </Col>
      </Row>
      <hr />
      <Table className="mt-3">
        <thead>
          <tr>
            <th>Date</th>
            <th>Recipient Address</th>
            <th>Amount</th>
            <th>Network</th>
            {type === "recurring" && <th>Frequency</th>}
            {type === "recurring" && <th>End Date</th>}
            {location && <th>Payment Type</th>}
          </tr>
        </thead>
        <tbody>
          {type === "fixed" && fixed?.map((trx) => (
            <tr key={trx?.walletAddress}>
              <td>{trx?.startDate as string}</td>
              <td>{trx?.walletAddress}</td>
              <td>{trx?.amount}</td>
              <td>{trx?.network}</td>
              {location && <td>{trx?.paymentType}</td>}
            </tr>
          ))}
          {type === "recurring" && recurring?.map((trx) => (
            <tr key={trx?.walletAddress}>
              <td>{trx?.startDate as string}</td>
              <td>{trx?.walletAddress}</td>
              <td>{trx?.amount}</td>
              <td>{trx?.network}</td>
              <td>{trx?.frequency}</td>
              <td>{trx?.endDate as string}</td>
              {location && <td>{trx?.paymentType}</td>}
            </tr>
          ))}
          {type ==="stream" && stream?.map((trx) => (
            <tr key={trx?.walletAddress}>
              <td>{trx?.startDate as string}</td>
              <td>{trx?.walletAddress}</td>
              <td>{trx?.amount}</td>
              <td>{trx?.network}</td>
              <td>{trx?.endDate as string}</td>
              {location && <td>{trx?.paymentType}</td>}
            </tr>
          ))}
          {
            location && [...fixed, ...stream, ...recurring]?.map((trx) => (
              <tr key={trx?.walletAddress}>
                <td>{trx?.startDate as string}</td>
                <td>{trx?.walletAddress}</td>
                <td>{trx?.amount}</td>
                <td>{trx?.network}</td>
                <td>{trx?.frequency}</td>
                <td>{trx?.endDate as string}</td>
                {location && <td>{trx?.paymentType}</td>}
              </tr>
            ))
          }
        </tbody>
      </Table>
    </div>
  );
}
