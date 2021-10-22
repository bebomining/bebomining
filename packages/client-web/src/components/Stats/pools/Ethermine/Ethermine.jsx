import { makeStyles } from "@material-ui/core/styles";
import { useFetch } from "./../../../../hooks/useFetch";
import { HashInfo } from "./HashInfo";
import { LineChart } from "./LineChart";
import { BalanceAndWorkerInfo } from "./BalanceAndWorkerInfo";
import { CircularProgressStats } from "../../components/CircularProgressStats";
import { ErrorBoxStats } from "../../components/ErrorBoxStats";

export const Ethermine = ({ worker, meta, refreshId }) => {
  const classes = useStyles();

  const { id: workerId, poolName } = worker;

  const { data, loading, error } = useFetch(
    `pools/${poolName.toLowerCase()}/stats/${workerId}?refreshId=${refreshId}`
  );

  if (loading === null || loading) {
    return <CircularProgressStats />;
  }

  if (error) {
    return (
      <ErrorBoxStats>
        <b>{worker.poolName}</b> stats not available yet!
      </ErrorBoxStats>
    );
  }

  console.log(data?.results);

  const { hashrate, chart, balance, baseUnit } = data?.results || {};
  return (
    <div className={classes.root}>
      <BalanceAndWorkerInfo
        worker={worker}
        balance={balance}
        baseUnit={baseUnit}
      />
      <HashInfo
        hashrate={hashrate}
        worker={worker}
        meta={meta}
        balance={balance}
      />
      <LineChart dataChart={chart} hashrate={hashrate} worker={worker} />
    </div>
  );
};

const useStyles = makeStyles({
  root: {
    position: "relative",
    width: "100%",
    display: "flex",
    flexDirection: "column"
  }
});
