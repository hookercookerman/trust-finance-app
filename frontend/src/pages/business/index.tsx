import { useRoutes } from "react-router-dom";
import Layout from "components/Layout/Layout";
import BusinessHome from "./Home";
import BusinessWallet from "./Wallet";
import Employees from "./Employees";
import BusinessNav from "./components/BusinessNav";
import Payment from "./Payment";
import Transactions from "./Transactions";

function AppWrapper() {
  return useRoutes([
    { path: "/transactions", element: <Transactions /> },
    { path: "/dashboard", element: <BusinessHome /> },
    { path: "/employees", element: <Employees /> },
    { path: "/payment", element: <Payment /> },
    { path: "/wallet", element: <BusinessWallet /> },
    { path: "*", element: <BusinessHome /> },
  ]);
}

export default function BusinessDashboard() {
  return (
    <Layout presentLocation="/business">
      <BusinessNav />
      <section className="m-4">
        <AppWrapper />
      </section>
    </Layout>
  );
};
