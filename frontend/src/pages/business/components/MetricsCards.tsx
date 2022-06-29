import { Link } from "react-router-dom";
import { convertGweiToUsd } from "utils/helpers";
import { BUSINESS_PATH } from "../routes/page-paths";

type Props = {
  moneyIn: string;
};

export default function MetricsCards({ moneyIn }: Props) {
  return (
    <>
      <div className="row">
        <div className="col-8">
          <div className="row">
            <div className="col">
              <div className="card border-0 card_shadow bg-primary">
                <div className="card-body p-4 text-white">
                  <p>Account Balance</p>
                  <p className="h3 fw-normal mt-2 mb-4">${convertGweiToUsd(moneyIn)}</p>
                  <div>
                    <Link to={BUSINESS_PATH.PAYMENT}>
                      <button type="button" className="btn btn-light px-4 text-primary">
                        Make Payment
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card border-0 card_shadow">
                <div className="card-body p-4 text-dark">
                  <p>Money In</p>
                  <p className="h3 fw-normal mt-2 mb-4">${convertGweiToUsd(moneyIn)}</p>
                  <div className="d-flex justify-content-between gap-3">
                    <button type="button" className="btn btn-primary px-3 text-nowrap text-white">
                      View Transactions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card border-0 card_shadow">
            <div className="card-body p-4 text-dark">
              <p>Money Out</p>
              <p className="h3 fw-normal mt-2 mb-4">$15,000</p>
              <div className="d-flex justify-content-between">
                <button type="button" className="btn btn-primary text-white">
                  View Transactions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
