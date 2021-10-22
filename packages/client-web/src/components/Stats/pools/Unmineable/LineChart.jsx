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

export const LineChart = ({ dataChart }) => {
  const datasets = [];
  const { reported = {}, calculated = {} } = dataChart || {};
  const { timestamps } = reported;

  const noData =
    timestamps?.length <= 0 ||
    calculated?.data?.length <= 0 ||
    reported?.data?.length <= 0;

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

  const labels = filtersFromToday(timestamps);

  let pickDataFrom = calculated.data.length - labels.length;
  const effectiveHashrate = {
    data: calculated.data.slice(pickDataFrom),
    label: "Effective Hashrate",
    fill: false,
    lineTension: 0.4,
    backgroundColor: "#3f51b5",
    borderColor: "rgba(63, 81, 181, 0.5)"
  };

  if (effectiveHashrate) {
    datasets.push(effectiveHashrate);
  }

  pickDataFrom = reported.data.length - labels.length;
  const reportedHashrate = {
    data: reported.data.slice(pickDataFrom),
    label: "Reported Hashrate",
    fill: false,
    lineTension: 0.4,
    backgroundColor: "#15cd72",
    borderColor: "rgba(21,205,114,0.5)"
  };

  if (reportedHashrate) {
    datasets.push(reportedHashrate);
  }

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

function filtersFromToday(categories) {
  const startFrom = new Date().getUTCDate();
  return categories.filter(ms => new Date(ms).getUTCDate() >= startFrom);
}
