import Logo from "assets/logo.png";
import HomepageContext from "Contexts/HomepageContext";
import useMetaMask from "hooks/useMetaMask";
import { useContext } from "react";
import { Container, Form, Navbar } from "react-bootstrap";

export default function HomeNavbar() {
	const [connectWallet, walletAddress] = useMetaMask();

	const { isBusinessMode, changeTheme } = useContext(HomepageContext);

	return (
		<Navbar sticky="top" bg="white">
			<Container>
				<Navbar.Brand href="#">
					<img src={Logo} width={100} alt="trust fe logo" />
				</Navbar.Brand>
				<div className="d-flex align-items-center">
					<p className={`mb-0 me-2 h5 ${isBusinessMode ? "text-primary" : "text-secondary"}`}>Business</p>
					<Form.Check 
						type="switch"
						className="fs-4"
						id="toggleView"
						onChange={changeTheme}
					/>
					<p className={`mb-0 h5 ${!isBusinessMode ? "text-primary" : "text-secondary"}`}>Personal</p>
				</div>
				<div className="d-flex">
					<div className="d-flex align-items-center">
						{walletAddress ? (
							<button className="btn btn-success" onClick={connectWallet}>
								Connected
							</button>
						) : (
							<button className="btn btn-secondary">Not Connected</button>
						)}
					</div>
				</div>
			</Container>
		</Navbar>
	);
}
