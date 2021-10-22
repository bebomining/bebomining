import { useSelector } from "usetheform";
import { makeStyles } from "@material-ui/core/styles";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import Button from "@material-ui/core/Button";

import { useAppContext } from "./../../../hooks/useAppContext";
import { fetch } from "./../../../utils";

export function RefreshIdBtn() {
  const classes = useStyles();
  const [, setUUID] = useSelector(state => state.uuid);

  const { apiServer } = useAppContext();

  const refreshId = async () => {
    try {
      const res = await fetch(`${apiServer}/api/v1/settings/cloud/_refresh`, {
        method: "PUT"
      });
      const { result = {} } = await res.json();
      setUUID(result?.rigID);
    } catch (err) {}
  };

  return (
    <Button
      type="button"
      color="primary"
      variant="contained"
      className={classes.RefreshId}
      size="small"
      startIcon={<AutorenewIcon />}
      onClick={refreshId}
    >
      Refresh Id
    </Button>
  );
}

const useStyles = makeStyles(() => ({
  RefreshId: {
    marginLeft: "32px",
    flexShrink: "0"
  }
}));
