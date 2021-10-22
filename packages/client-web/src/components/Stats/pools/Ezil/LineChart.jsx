import React from "react";
import "chartjs-adapter-moment";
import { Line } from "react-chartjs-2";
import Typography from "@material-ui/core/Typography";

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

const hs = 1000000;
export const LineChart = ({ dataChart }) => {
  const datasets = [];

  const noData =
    dataChart?.length <= 0 ||
    dataChart?.[0] === undefined ||
    dataChart[0].long_average_hashrate === undefined ||
    dataChart[0].short_average_hashrate === undefined ||
    dataChart[0].invalid_shares_count === undefined ||
    dataChart[0].reported_hashrate === undefined ||
    dataChart[0].stale_shares_count === undefined ||
    dataChart[0].accepted_shares_count === undefined;

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

  const effectiveHashrate = prepareDataset(
    { dataChart, key: "short_average_hashrate" },
    {
      label: "Current Hashrate",
      fill: false,
      lineTension: 0.4,
      backgroundColor: "#3f51b5",
      borderColor: "rgba(63, 81, 181, 0.5)"
    }
  );

  if (effectiveHashrate) {
    datasets.push(effectiveHashrate);
  }

  const averageEffectiveHashrate = prepareDataset(
    { dataChart, key: "long_average_hashrate" },
    {
      label: "Average Hashrate",
      fill: false,
      lineTension: 0.4,
      backgroundColor: "#15cd72",
      borderColor: "rgba(21,205,114,0.5)"
    }
  );

  if (averageEffectiveHashrate) {
    datasets.push(averageEffectiveHashrate);
  }

  const reportedHashrate = prepareDataset(
    { dataChart, key: "reported_hashrate" },
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

  const labels = dataChart.map(({ time }) => new Date(time).getTime());

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

  console.log(dataChart, data);

  if (data.length > 0) {
    return { data, ...opts };
  }

  return null;
}
