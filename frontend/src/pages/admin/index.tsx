import Layout from "components/Layout/Layout";
import { Route, Routes } from "react-router-dom";
import AdminHome from "./Home";

export default function AdminDashboard() {
  return (
    <Layout presentLocation="/admin">
			<section className="m-4">
				<Routes>
					<Route path="/dashboard" element={<AdminHome />} />
					<Route path="*" element={<AdminHome />} />
				</Routes>
			</section>
		</Layout>
  );
}