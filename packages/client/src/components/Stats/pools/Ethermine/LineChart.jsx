import React from "react";
import "chartjs-adapter-moment";
import { Line } from "react-chartjs-2";
import Typography from "@material-ui/core/Typography";

const hs = 1000000;
export const LineChart = ({ dataChart }) => {
  const datasets = [];

  const noData =
    dataChart?.length <= 0 ||
    dataChart?.[0] === undefined ||
    dataChart[0].averageHashrate === undefined ||
    dataChart[0].currentHashrate === undefined ||
    dataChart[0].invalidShares === undefined ||
    dataChart[0].reportedHashrate === undefined ||
    dataChart[0].staleShares === undefined ||
    dataChart[0].validShares === undefined;

  if (noData) {
    return (
      <div style={{ padding: "8px 16px", width: "100%", height: "100%" }}>
        <div
          style={{
            width: "100%",
            padding: "16px",
            border: "1px solid #e8eff7",
            borderRadius: "5px",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Typography variant="h4" component="h4">
            Chart data not available yet!
          </Typography>
          <Typography variant="h6" component="h6">
            Try again after some minutes!
          </Typography>
        </div>
      </div>
    );
  }

  const currentHashrate = prepareDataset(
    { dataChart, key: "currentHashrate" },
    {
      label: "Crrent Hashrate",
      fill: false,
      lineTension: 0.4,
      backgroundColor: "#3f51b5",
      borderColor: "rgba(63, 81, 181, 0.5)"
    }
  );

  if (currentHashrate) {
    datasets.push(currentHashrate);
  }

  const averageHashrate = prepareDataset(
    { dataChart, key: "averageHashrate" },
    {
      label: "Average Hashrate",
      fill: false,
      lineTension: 0.4,
      backgroundColor: "#15cd72",
      borderColor: "rgba(21,205,114,0.5)"
    }
  );

  if (averageHashrate) {
    datasets.push(averageHashrate);
  }

  const reportedHashrate = prepareDataset(
    { dataChart, key: "reportedHashrate" },
    {
      label: "Reported Hashrate",
      fill: false,
      lineTension: 0.4,
      backgroundColor: "#eab02e",
      borderColor: "rgba(237,180,49,0.5)"
    }
  );

  if (reportedHashrate) {
    datasets.push(reportedHashrate);
  }

  const labels = dataChart.map(({ time }) => time * 1000);

  const data = { labels, datasets };
  return (
    <div style={{ padding: "8px 16px" }}>
      <div
        style={{
          height: "300px",
          padding: "24px",
          border: "1px solid #e8eff7",
          borderRadius: "5px"
        }}
      >
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

function prepareDataset({ dataChart = [], key }, opts) {
  const data = dataChart
    .filter(val => val[key] !== undefined)
    .map(val => val[key] / hs);

  if (data.length > 0) {
    return { data, ...opts };
  }

  return null;
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      type: "time",
      time: {
        displayFormats: {
          hour: "HH:mm",
          minute: "HH:mm",
          second: "HH:mm",
          millisecond: "HH:mm"
        },
        tooltipFormat: "ll HH:mm:ss"
      },
      scaleLabel: {
        display: true,
        labelString: "Date"
      }
    }
  },
  plugins: {
    legend: {
      position: "bottom"
    }
  }
};
