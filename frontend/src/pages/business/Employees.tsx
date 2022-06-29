import EmployeeInput from "./components/EmployeeInput";
import { Button } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";

export default function Employees() {
  // Add Employees
  // Manage Employees => Updating amount, Update interval
  // Delete employees
  // Add employee button at the top of the employees card

  return (
    <section className="m-4 px-3">
      <div className="mb-3 d-flex justify-content-between">
        <p className="h4">Employees</p>
        <Button>Add <BsPlus fontSize="1.3rem" className="mb-1" /></Button>
      </div>
      <EmployeeInput />
    </section>
  );
}