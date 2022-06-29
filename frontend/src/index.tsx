
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "styles/index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import PersonalDashboard from "pages/personal";
import BusinessDashboard from "pages/business";
import Registration from "pages/Registration";
import BusinessRegistration from "pages/BusinessRegistration";
import reportWebVitals from "./reportWebVitals";
import AdminDashboard from "pages/admin";


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/login" element={<Login />} />
				<Route path="/registration" element={<Registration />} />
				<Route path="/business-registration" element={<BusinessRegistration />} />
				<Route path="/personal/*" element={<PersonalDashboard />} />
				<Route path="/business/*" element={<BusinessDashboard />} />
				<Route path="/admin/*" element={<AdminDashboard />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
