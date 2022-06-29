import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, ButtonGroup, Card, Col, Row } from "react-bootstrap";
import TrustCFA from "utils/TrustCFA.json";
import useWalletCheck from "hooks/useWalletCheck";
import ContractAddresses from "utils/contractAddresses.json";
import MetricsCards from "./components/MetricsCards";
import PaymentPlan from "./components/PaymentPlan";
import DashboardChart from "pages/business/components/charts/DashboardChart";
import EmployeesChart from "pages/business/components/charts/EmployeesChart";
import { BUSINESS_PATH } from "./routes/page-paths";
import { BsPlusLg } from "react-icons/bs";
import useContractAddress from "hooks/useContractAddress";

export default function BusinessHome() {
  const [numberOfEmployees, setNumberOfEmployees] = useState(null);
  const [moneyIn, setMoneyIn] = useState(null);

  const [walletAddress] = useWalletCheck();
  const [contractMethods] = useContractAddress(ContractAddresses[80001].TrustCFA[0], TrustCFA.abi);

  useEffect(() => {
    if (!walletAddress) return;
    const getTotal = async () => {
      try {
        const totalCompanyEmployees = await contractMethods.getTotalCompanyEmployees(walletAddress);
        const totalPaying = await contractMethods.getTotalPaying(walletAddress);
        setNumberOfEmployees(Number(totalCompanyEmployees));
        setMoneyIn(String(totalPaying));
      } catch (e) {
        console.error(e);
      }
    };
    getTotal();
    return () => {
      setNumberOfEmployees(null);
      setMoneyIn(null);
    };
  }, [contractMethods, walletAddress]);

  return (
    <>
      <MetricsCards moneyIn={moneyIn} />
      {/* SEND MONEY */}
      <Row className="mt-4">
        <Col md={8}>
          <Card className="border-0 card_shadow">
            <Card.Body>
              <Card.Subtitle className="mb-2 text-primary">Cash Flow</Card.Subtitle>
              <DashboardChart />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="">
          <Card className="border-0 card_shadow h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <Card.Subtitle className="mb-0 text-primary">Employees</Card.Subtitle>
                <Button variant="link">
                  <BsPlusLg />
                </Button>
              </div>
              <div className="d-flex justify-content-center flex-column h-100">
                <EmployeesChart />
                <div className="d-flex justify-content-center mt-3">
                  <ButtonGroup>
                    <Link to={BUSINESS_PATH.EMPLOYEES}>
                      <Button>Manage Employees</Button>
                    </Link>
                  </ButtonGroup>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* CREATE AN INVOICE  */}
      <div className="row mt-4">
        <PaymentPlan numberOfEmployees={numberOfEmployees} />
      </div>
    </>
  );
}
