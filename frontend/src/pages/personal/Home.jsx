import { useCallback, useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import PersonalNav from "components/Personal/PersonalNav";
import AssetTable from "components/AssetTable";
import IncomeTable from "components/IncomeTable";
import TrustCFA from "utils/TrustCFA.json";
import useWalletCheck from "hooks/useWalletCheck";
import ContractAddresses from "utils/contractAddresses.json";
import { convertGweiToUsd } from "utils/helpers";

export default function PersonalHome() {
	const contract = useRef();

	const [employeeInfo, setEmployeeInfo] = useState({});

	const [walletAddress] = useWalletCheck();

	const viewEmployeeInfo = useCallback( async(contract) => {
		try {
			const { employer, paymentInterval, salary, startTime } = await contract.viewEmployeeInfo(
				walletAddress,
			);
			setEmployeeInfo({
				employer,
				paymentInterval,
				salary,
				startTime,
			});
		} catch (error) {
			console.error(error);
		}
	}, [walletAddress]);

	useEffect(() => {
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
				contract.current = _contract;
				viewEmployeeInfo(_contract);
			}
		} catch (e) {
			console.error(e);
		}
	}, [walletAddress, viewEmployeeInfo]);

	return (
		<>
			<PersonalNav />
			<section className="m-4">
				<div className="row">
					<div className="col-8">
						<div className="row">
							<div className="col">
								<div className="card border-0 card_shadow bg-primary">
									<div className="card-body p-4 text-white">
										<div className="mb-3">
                      Total Income Value{" "}
											<span className="ms-3 text-info">
												<i className="bi bi-caret-down-fill"></i>
											</span>
										</div>
										<div>
											<i className="bi bi-arrow-up-right"></i> +3.49%
										</div>
										<p className="h3 fw-normal mt-2 mb-2">
                      ${convertGweiToUsd(employeeInfo?.salary?._hex) ?? 0}
										</p>
									</div>
								</div>
							</div>
							<div className="col">
								<div className="card border-0 card_shadow">
									<div className="card-body p-4 text-dark">
										<div className="mb-3">
                      Your Returns{" "}
											<span className="ms-3 text-info">
												<i className="bi bi-caret-down-fill"></i>
											</span>
										</div>
										<p className="mb-0 text-primary">
											<i className="bi bi-arrow-up-right"></i> +2.75%
										</p>
										<p className="h3 fw-normal mt-2 mb-2">
                      ${convertGweiToUsd(employeeInfo?.salary?._hex) ?? 0}
										</p>
									</div>
								</div>
							</div>
						</div>
						<div className="card border-0 card_shadow mt-4">
							<div className="card-body">
								<div className="row">
									<div className="d-flex">
										<p>Your Income Source</p>
										<div className="ms-auto d-flex align-items-center">
											<p className="text-primary fw-semibold text-nowrap mb-0">
                        Download Reports <i className="bi bi-download"></i>
											</p>
											<select className="form-select ms-4 border-0" aria-label="timeline">
												<option selected>Week</option>
												<option value="month">Month</option>
												<option value="year">Year</option>
											</select>
										</div>
									</div>
									<div>
										<IncomeTable />
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-4">
						<div className="card border-0 card_shadow h-100">
							<div className="card-body p-4 text-dark">
								<div>Create or Edit Income Yield</div>
								<div className="d-flex flex-column gap-3">
									<input
										type="text"
										className="form-control border border-2 border-primary"
										id="selectWallet"
										placeholder="Select wallet or income stream source"
									/>
									<input
										type="text"
										className="form-control border border-2 border-primary"
										id="selectProtocol"
										placeholder="Select yield protocol: Aave, APWINE"
									/>
									<div className="d-flex gap-4 justify-content-between">
										<input
											type="text"
											className="form-control border border-2 border-primary"
											id="selectProtocol"
											placeholder="%Allocation"
										/>
										<select
											className="form-select border border-2 border-primary"
											aria-label="Default select example"
										>
											<option selected>Frequency Daily</option>
											<option value="1">Weekly</option>
											<option value="2">Monthly</option>
											<option value="3">Annually</option>
										</select>
									</div>
									<input
										type="text"
										className="form-control border border-2 border-primary"
										id="selectProtocol"
										placeholder="Currency: USDC, DAI, USDT"
									/>
								</div>
								<div className="d-flex flex-column mx-auto w-75 gap-2 mt-4">
									<button type="button" className="btn btn-primary px-3 text-white">
                    Start
									</button>
									<button type="button" className="btn btn-primary px-3 text-white">
                    Update
									</button>
									<button type="button" className="btn btn-primary px-3 text-white">
                    Pause
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* CREATE AN INVOICE  */}
				<div className="row mt-4">
					<div className="col-8">
						<div className="card border-0 card_shadow">
							<div className="card-body">
								<div className="row">
									<p>Your Asset</p>
									<div className="col-2"></div>
									<div>
										<AssetTable />
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-4">
						<div className="card border-0 h-100">
							<div className="card-body card_shadow">
								<p>Loan Market</p>
								<div className="d-flex justify-content-between align-items-center mb-3">
									<p className="mb-0">Open Loan Position</p>
									<button type="button" className="btn btn-primary px-3 text-white">
                    Buy Stream
									</button>
								</div>
								<p className="text-primary">15</p>
								<hr />
								<div className="d-flex justify-content-between">
									<button type="button" className="btn btn-primary px-3 text-white">
                    Sell Stream
									</button>
									<button type="button" className="btn btn-primary px-3 text-white">
                    Stop Stream
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
