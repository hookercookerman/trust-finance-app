import HelpLogo from "assets/images/help.png";

export default function PaymentPlan({ numberOfEmployees }) {
  return (
    <>
      <div className="col-8">
        <div className="card border-0 card_shadow">
          <div className="card-body">
            <div className="row">
              <p>Manage Payment Plan</p>
              <div className="col-2"></div>
              <div className="col-6">
                <div>
                  <div className="mb-3 row">
                    <input
                      type="text"
                      className="form-control"
                      id="invoiceName"
                      placeholder="Customer wallet address"
                    />
                  </div>
                  <div className="mb-3 row">
                    <input
                      type="text"
                      className="form-control"
                      id="invoiceName"
                      placeholder="Customer wallet address"
                    />
                  </div>
                </div>
                <div className="mx-auto">
                  <div className="d-flex justify-content-between">
                    <button type="button" className="btn btn-primary px-5 text-white ms-auto">
                      Remove
                    </button>
                    <button type="button" className="btn btn-primary px-3 text-white ms-4">
                      Update
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="text-center">
                  <p className="h5">Employees</p>
                  <p className="lead fw-bold">{numberOfEmployees}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-4">
        <div className="card border-0 h-100">
          <div className="card-body card_shadow">
            <p>Help Center</p>
            <div className="d-flex justify-content-center">
              <img src={HelpLogo} width={250} alt="help desk" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
