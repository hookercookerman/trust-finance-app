import { Button, Col, Container, Nav, Row } from "react-bootstrap";
import DAO from "assets/icons/dao.png";
import cryptobusiness from "assets/icons/business.png";
import nft from "assets/icons/nftproject.png";
import useMetaMask from "hooks/useMetaMask";
import { BUSINESS_PATH } from "pages/business/routes/page-paths";
import { INDIVIDUAL_PATHS } from "pages/personal/routes/page-paths";
import useBoolean from "hooks/useBoolean";
import Partners from "./Partners";

export default function Hero({ isBusinessMode }) {
  const [connectWallet] = useMetaMask();
  const [selectOption, setOptionSelected] = useBoolean(false);

  const handleWalletConnect = () => {
    connectWallet(isBusinessMode ? BUSINESS_PATH.DASHBOARD : INDIVIDUAL_PATHS.DASHBOARD);
  };

  return (
    <div className="position-relative">
    <Container fluid className={`hero_bg ${ isBusinessMode ? "business_bg" : "personal_bg" }`}>
      <div className="row flex-lg-row-reverse align-items-center py-5">
        <Container className="ps-5">
          <Row className="ms-5 mt-5">
            <Col md={5} sm={12} className="z_10">
              <h1 className="display-5 fw-normal mb-3 ms-3" style={{ fontSize: "2.5rem" }}>
                Set your business up with real-time payroll payment, benefit, and accounting solution
              </h1>
              <Nav onSelect={() => setOptionSelected.on()} variant="pills" className="d-inline">
                <Nav.Item>
                  <Nav.Link className="bg-transparent" eventKey="link-1">
                    <div className="text-left hero_button p-2 border border-dark border-1 rounded">
                      <div className="d-flex px-5 align-items-center">
                        {" "}
                        <img
                          className="p-2"
                          src={nft}
                          style={{ width: "2.5rem", height: "2.5rem" }}
                          alt="nft"
                        />
                        <p className="mb-0 ms-2 fs-5">{ isBusinessMode ? "I am a NFT Project" : "I am a Web3 Contributor" }</p>
                      </div>
                    </div>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link className="bg-transparent" eventKey="link-2">
                    <div className="text-left hero_button p-2 border border-dark border-1 rounded">
                      <div className="d-flex px-5 align-items-center">
                        {" "}
                        <img
                          className="p-2"
                          src={DAO}
                          style={{ width: "2.5rem", height: "2.5rem" }}
                          alt="nft"
                        />
                        <p className="mb-0 ms-2 fs-5">{ isBusinessMode ? "I am a DAO" : "I am freelancer" }</p>
                      </div>
                    </div>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link className="bg-transparent" eventKey="link-3">
                    <div className="text-left hero_button p-2 border border-dark border-1 rounded">
                      <div className="d-flex px-5 align-items-center">
                        {" "}
                        <img
                          className="p-2"
                          src={cryptobusiness}
                          style={{ width: "2.5rem", height: "2.5rem" }}
                          alt="nft"
                        />
                        <p className="mb-0 ms-2 fs-5">{ isBusinessMode ? "I am a Crypto adopted Business" : "I am a gig worker" }</p>
                      </div>
                    </div>
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              <Row className="mb-5 px-3 py-5">
                <Col>
                  <Button onClick={handleWalletConnect} disabled={!selectOption} className="w-100 rounded" variant="primary" size="lg">
                    Get Started
                  </Button>
                </Col>
                <Col>
                  <Button className="w-100 rounded" variant="light" size="lg">
                    Learn More
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col></Col>
          </Row>
        </Container>
      </div>
    </Container>
    <Partners />
    </div>
  );
}