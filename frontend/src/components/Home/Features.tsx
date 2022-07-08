import { Card, Col, Container, Row } from "react-bootstrap";
import { motion } from "framer-motion";
import {AiOutlineStock} from "react-icons/ai";
import {RiSecurePaymentLine} from "react-icons/ri";
import {MdOutlineManageAccounts} from "react-icons/md";
import {FaExchangeAlt} from "react-icons/fa";
import {GiTakeMyMoney} from "react-icons/gi";
import {FcCurrencyExchange} from "react-icons/fc";

export default function Features({isBusinessMode}) {

  const BusinessFeatures = [
    { id: 1,
      title: "PAYMENT",
      icon: <RiSecurePaymentLine className = "w-25 h-25" style = {{color: "#0d6efd"}}/>,
      description: " We provide easy payroll payments and management for you business, reducting gas fee and time."
    },
    {id: 2,
      title: "Benefits",
      icon: <AiOutlineStock className = "w-25 h-25" style = {{color: "#0d6efd"}}/>,
      description: "Attract the best talents through our innovative real time investing matching and yield generation from income."
    },
    {id: 3,
      title: "Accounting",
      icon: <MdOutlineManageAccounts className = "w-25 h-25" style = {{color: "#0d6efd"}}/>,
      description: "Enhance growth and compliance through real time automated transaction tracking, accounting and reporting."
    },
  ];

  const PersonalFeatures = [
    { id: 1,
      title: "Real Time Staking",
      icon: <FcCurrencyExchange className = "w-25 h-25" style = {{color: "#0d6efd"}}/>,
      description: " We provide easy payroll payments and management for you business, reducting gas fee and time.",
    },
    {id: 2,
      title: "Access to Rewards",
      icon: <GiTakeMyMoney className = "w-25 h-25" style = {{color: "#0d6efd"}} />,
      description: "Attract the best talents through our innovative real time investing matching and yield generation from income.",
    },
    {id: 3,
      title: "Easy Payout",
      icon: <FaExchangeAlt className = "w-25 h-25" style = {{color: "#0d6efd"}} />,
      description: "Enhance growth and compliance through real time automated transaction tracking, accounting and reporting.",
    },
  ];

  return (
    <div className="bg-primary">
    <Container className = "text-center p-4 bg-primary">
      <Row className=" ms-4">
        <Col>
          <p className="h1 text-light p-5">Product Features</p>
          {/*
          <p>Trust Finance help you...</p>
          <ol className="ps-3">
            <li>grow your community and number of users through real time payment</li>
            <li>
              attract and retain the best talents through innovative benefits package
            </li>
            <li>stay compliant and manage risk through better accounting and transaction monitoring</li>
          </ol>
  */}
        </Col>
      </Row>
      <Row className="d-flex p-3">
        { 
        isBusinessMode ?
        BusinessFeatures.map((features) => (
        <Col md={4} sm={12} key={features.id}>
          <motion.div className ="w-75 h-100 rounded p-2" whileHover={{scale: 1.1, textShadow: "0px 0px 8px rgb(255, 255, 255)", boxShadow: "3px 3px 8px" }}>
          <Card className="border-0">
            <Card.Body>
              <Card.Title className="mb-4">{features.title}</Card.Title>
              {features.icon}
              <Card.Text className="p-3">
               {features.description}
              </Card.Text>
            </Card.Body>
          </Card>
          </motion.div>
        </Col>
        )) :
        PersonalFeatures.map((features) => (
          <Col md={4} sm={12} key={features.id}>
            <motion.div className ="w-75 h-100 rounded p-2" whileHover={{scale: 1.1, textShadow: "0px 0px 8px rgb(255, 255, 255)", boxShadow: "3px 3px 8px" }}>
            <Card className="border-0">
              <Card.Body>
                <Card.Title className="mb-4">{features.title}</Card.Title>
                {features.icon} 
                <Card.Text className="p-3">
                 {features.description}
                </Card.Text>
              </Card.Body>
            </Card>
            </motion.div>
          </Col>
          ))
}
{/*
        <Col md={4} sm={12}>
        <motion.div className ="w-75 h-100 rounded p-2" whileHover={{scale: 1.1, textShadow: "0px 0px 8px rgb(255, 255, 255)", boxShadow: "3px 3px 8px" }}>
          <Card className="border-0">
            <Card.Body>
              <Card.Title className="mb-4">BENEFITS</Card.Title>
              <AiOutlineStock className = "w-25 h-25" style = {{color: "#0d6efd"}}/>
              <Card.Text className="p-3">
                Attract the best talents through our innovative real time
                investing matching and yield generation from income.
              </Card.Text>
            </Card.Body>
          </Card>
          </motion.div>
        </Col>
        <Col md={4} sm={12}>
        <motion.div className ="w-75 h-100 rounded p-2" whileHover={{scale: 1.1, boxShadow: "0px 0px 8px" }}>
          <Card className="border-0">
            <Card.Body>
              <Card.Title className="mb-4">ACCOUNTING</Card.Title>
              <MdOutlineManageAccounts className = "w-25 h-25" style = {{color: "#0d6efd"}}/>
              <Card.Text className="p-3">
                Enhance growth and compliance through real time automated transaction tracking, accounting and reporting.
              </Card.Text>
            </Card.Body>
          </Card>
          </motion.div>
        </Col>
*/}
      </Row>
    </Container>
    </div>
  );
}