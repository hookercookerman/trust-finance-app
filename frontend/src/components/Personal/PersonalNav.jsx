import { Link } from "react-router-dom";

export default function PersonalNav() {
	return (
		<nav className="navbar navbar-expand-lg bg-white">
			<div className="container-fluid">
				<div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
					<ul className="navbar-nav">
						<Link to="/" className="text-decoration-none">
							<li className="nav-item">
								<button className="nav-link fw-semibold  bg-transparent border-0">
									Add Income
								</button>
							</li>
						</Link>
						<li className="nav-item">
							<button className="nav-link fw-semibold bg-transparent border-0">
								Pay or Request
							</button>
						</li>
						<li className="nav-item">
							{
								<button className="btn btn-primary" disabled>Connected</button>
							}
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
}
