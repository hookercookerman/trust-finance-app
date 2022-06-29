import Chart from "react-apexcharts";

export default function EmployeesChart() {

  const options = {
    chart: {
      id: "radial",
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          total: {
            show: true,
            label: "TOTAL"
          }
        }
      },
    },
    labels: ["Accounts", "Marketing", "Product", "Engineering"],
  };

  const series = [67, 84, 97, 61];
    
  return (
    <Chart
      options={options}
      series={series}
      type="radialBar"
    />
  );
}