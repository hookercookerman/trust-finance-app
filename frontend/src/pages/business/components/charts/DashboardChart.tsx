import Chart from "react-apexcharts";

export default function DashboardChart() {
  const options = {
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    },
  };

  const series = [
    {
      name: "Cash flow",
      data: [30, 40, 45, 50, 49, 60, 70, 91, 100, 112, 123, 135]
    }
  ];
  
  return (
    <Chart
      options={options}
      series={series}
      type="line"
    />
  );
}
