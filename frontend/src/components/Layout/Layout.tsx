import { ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
  children: ReactNode,
  presentLocation: string,
};

const SidebarLinks = [
	{
		title: "Dashboard",
		destination: "dashboard",
		icon: "bi-grid",
	},
	{
		title: "Wallet",
		destination: "wallet",
		icon: "bi-wallet",
	},
	{
		title: "Income",
		destination: "income",
		icon: "bi-credit-card",
	},
	{
		title: "Payment",
		destination: "payment",
		icon: "bi-cash-coin",
	},
	{
		title: "Transactions",
		destination: "transactions",
		icon: "bi-credit-card-2-front",
	},
	{
		title: "Announcement",
		destination: "announcement",
		icon: "bi-volume-up",
	},
];

export default function Layout({ children, presentLocation }: Props) {
	return (
		<div className="d-flex">
			<div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-primary custom_sidebar sticky-top">
				<a
					href="/"
					className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
				>
					<span className="fs-4">
						{/* <img src={Logo} width={100} /> */}
            Trust
					</span>
				</a>
				<hr />
				<ul className="nav nav-pills flex-column mb-auto">
					{
						SidebarLinks.map((link) => (
							<Link to={`${presentLocation}/${link.destination}`} key={link.title} className="text-decoration-none">
								<li className="nav-item">
									<p
										className="nav-link my-2 active"
										aria-current="page"
									>
										<i className={`me-3 bi ${link.icon}`} />
										{link.title}
									</p>
								</li>
							</Link>
						))
					}
				</ul>
				<hr />
				<div className="dropdown">
					<a
						href="#"
						className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
						id="dropdownUser1"
						data-bs-toggle="dropdown"
						aria-expanded="false"
					>
						<img
							src="https://github.com/mdo.png"
							alt=""
							width="32"
							height="32"
							className="rounded-circle me-2"
						/>
						<strong>Satoshi Nakomoto</strong>
					</a>
				</div>
			</div>
			<div className="custom_body">{children}</div>
		</div>
	);
}
