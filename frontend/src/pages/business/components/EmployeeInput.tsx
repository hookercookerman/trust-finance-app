import { ethers } from "ethers";
import TrustCFA from "utils/TrustCFA.json";
import ContractAddresses from "utils/contractAddresses.json";
import AddEmployeeForm from "./AddEmployeeForm";

export default function EmployeeInput() {

  const convertIntervalToInt = (interval: string) => {
    const day = 60 * 60 * 24;
    if (interval === "Daily") return Number(day);
    if (interval === "Weekly") return Number(day * 7);
    if (interval === "Monthly") return Number(day * 30);
  };
 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const submitForm = async ({ employeeAddress, interval, salary }) => {
    const amount = Number(salary * 10 ** 18);
    const _interval = convertIntervalToInt(interval);
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const _contract = new ethers.Contract(
          ContractAddresses[80001].TrustCFA[0],
          TrustCFA.abi,
          signer,
        );
        const response = await _contract._addemployee(employeeAddress, BigInt(amount), _interval);
        console.log("Add Employee ==>", response);
        alert("Employee created successfully");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="card border-0 card_shadow">
        <div className="card-body">
          <p className="h6 text-primary mb-3">Manage Employees</p>
          <div className="row ms-1">
            <AddEmployeeForm />
          </div>
        </div>
      </div>
    </>
  );
}
