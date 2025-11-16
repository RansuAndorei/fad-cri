import { statusToColorHex } from "@/utils/functions";
import { StackedBarChartDataType } from "@/utils/types";
import { useMantineColorScheme, useMantineTheme } from "@mantine/core";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJs,
  FontSpec,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import moment from "moment";
import React from "react";
import { Bar } from "react-chartjs-2";

ChartJs.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const defaultProps = {
  barPercentage: 0.7,
  borderSkipped: false,
  borderRadius: {
    topLeft: 20,
    topRight: 20,
    bottomLeft: 20,
    bottomRight: 20,
  },
  borderWidth: 2,
  borderColor: "transparent",
};

type StackedBarChartProps = {
  data: StackedBarChartDataType[];
  xAxisLabel?: string;
  yAxisLabel?: string;
};

const StackedBarChart: React.FC<StackedBarChartProps> = ({ data, xAxisLabel, yAxisLabel }) => {
  const { colorScheme } = useMantineColorScheme();
  const { colors } = useMantineTheme();

  const adjustGrayColor = colorScheme === "light" ? colors.dark[3] : colors.dark[0];

  const chartData = {
    labels: data.map((d) => moment(d.month).format("MMM YYYY")),
    datasets: [
      {
        ...defaultProps,
        label: "Pending",
        data: data.map((d) => d.pending),
        backgroundColor: statusToColorHex("PENDING"),
      },
      {
        ...defaultProps,
        label: "Scheduled",
        data: data.map((d) => d.scheduled),
        backgroundColor: statusToColorHex("SCHEDULED"),
      },
      {
        ...defaultProps,
        label: "Completed",
        data: data.map((d) => d.completed),
        backgroundColor: statusToColorHex("COMPLETED"),
      },
      {
        ...defaultProps,
        label: "Cancelled",
        data: data.map((d) => d.cancelled),
        backgroundColor: statusToColorHex("CANCELLED"),
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: xAxisLabel ? xAxisLabel : "",
          color: adjustGrayColor,
          font: {
            weight: "bold" as FontSpec["weight"],
          },
        },
        grid: {
          color: colorScheme === "light" ? colors.dark[0] : colors.dark[3],
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: yAxisLabel ? yAxisLabel : "",
          color: adjustGrayColor,
          font: {
            weight: "bold" as FontSpec["weight"],
          },
        },
        grid: {
          color: colorScheme === "light" ? colors.dark[0] : colors.dark[3],
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return <Bar data={chartData} options={chartOptions} />;
};

export default StackedBarChart;
