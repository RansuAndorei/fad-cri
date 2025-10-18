import { statusToColorHex } from "@/utils/functions";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { upperCase } from "lodash";
import React from "react";
import { Doughnut } from "react-chartjs-2";

export type RadialChartData = {
  label: string;
  value: number;
};

type RadialChartProps = {
  data: RadialChartData[];
  totalCount: number;
};

ChartJS.register(ArcElement, Tooltip, Legend);

const RadialChart: React.FC<RadialChartProps> = ({ data, totalCount }: RadialChartProps) => {
  const labels = ["Approved", "Pending", "Rejected", "Canceled"];
  const dataSet = data.map((d) => ({
    label: d.label,
    data: [d.value, totalCount - d.value],
    backgroundColor: [statusToColorHex(upperCase(d.label)), "#DEE2E6"],
    borderWidth: 4,
    borderRadius: 24,
  }));

  const chartData = {
    labels: labels,
    datasets: dataSet,
  };

  const chartOptions = {
    cutout: "25%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return <Doughnut data={chartData} options={chartOptions} />;
};

export default RadialChart;
