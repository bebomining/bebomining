import { makeStyles } from "@material-ui/core/styles";
import { HashInfo } from "./HashInfo";
import { Cpus } from "../../components/Cpus";
import { CircularProgressStats } from "../../components/CircularProgressStats";
import { ErrorBoxStats } from "../../components/ErrorBoxStats";
import { useFetch } from "../../../../hooks/useFetch";

export const Xmrig = ({ worker, meta, refreshId }) => {
  const classes = useStyles();

  const { data, loading, error } = useFetch(
    `workers/${worker.id}/_stats?refreshId=${refreshId}`
  );

  if (loading === null || loading) {
    return <CircularProgressStats />;
  }

  if (error) {
    return (
      <ErrorBoxStats>
        <b>{worker.minerName}</b> stats not available yet!
      </ErrorBoxStats>
    );
  }

  const { cpus, session } = data.results;
  return (
    <div className={classes.root}>
      <HashInfo worker={worker} meta={meta} session={session} />
      <Cpus cpus={cpus} />
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
