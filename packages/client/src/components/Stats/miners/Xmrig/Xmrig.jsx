import { makeStyles } from "@material-ui/core/styles";
import { HashInfo } from "./HashInfo";
import { Cpus } from "../../components/Cpus";
import { CircularProgressStats } from "../../components/CircularProgressStats";
import { ErrorBoxStats } from "../../components/ErrorBoxStats";
import { useAppContext } from "../../../../hooks/useAppContext";
import { useFetch } from "../../../../hooks/useFetch";

export const Xmrig = ({ worker, meta, refreshId }) => {
  const classes = useStyles();
  const { apiServer } = useAppContext();

  const { data, loading, error } = useFetch(
    `${apiServer}/api/v1/workers/${worker.id}/_stats?refreshId=${refreshId}`
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

  console.log(data.results);
  const { cpus, session } = data?.results || {};
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
    height: "100%",
    display: "flex",
    flexDirection: "column"
  }
});
