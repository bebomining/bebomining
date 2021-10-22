import { makeStyles } from "@material-ui/core/styles";

import { HashInfo } from "./HashInfo";
import { useFetch } from "../../../../hooks/useFetch";
import { useAppContext } from "../../../../hooks/useAppContext";

import { Gpus } from "../../components/Gpus";
import { CircularProgressStats } from "../../components/CircularProgressStats";
import { ErrorBoxStats } from "../../components/ErrorBoxStats";

export const Lolminer = ({ worker, meta, refreshId }) => {
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
  const { gpus, session } = data.results;
  return (
    <div className={classes.root}>
      <HashInfo worker={worker} meta={meta} session={session} />
      <Gpus gpus={gpus} />
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
