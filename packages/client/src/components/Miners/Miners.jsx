import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

import { useAppContext } from "./../../hooks/useAppContext";
import { fetch } from "./../../utils";

import { DetailsMinerTable } from "./components/DetailsMinerTable/DetailsMinerTable";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    marginTop: "8px"
  },
  loadingBar: {
    width: "100%",
    display: "flex",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  }
}));

export function Miners() {
  const classes = useStyles();
  const { apiServer } = useAppContext();

  const [minersInfo, setMinersInfo] = useState(() => null);

  useEffect(() => {
    async function getMiners() {
      const res = await fetch(`${apiServer}/api/v1/miners`);
      const miners = await res.json();
      const promises = miners.results.map(({ name, minerMode, supports }) =>
        fetch(`${apiServer}/api/v1/miners/${name.toLowerCase()}/releases`)
          .then(res => res.json())
          .then(({ results }) =>
            results.map(miner => ({
              ...miner,
              minerName: name,
              supports,
              nameWithTag: `${name} ${miner.tag_name}`,
              minerMode
            }))
          )
      );
      const results = await Promise.all(promises);
      const allMiners = results
        .reduce((acc, results) => [...acc, ...results], [])
        .sort((a, b) =>
          a.minerMode > b.minerMode ? -1 : b.minerMode > a.minerMode ? 1 : 0
        );
      setMinersInfo(allMiners);
    }

    getMiners();
  }, []);

  if (minersInfo === null) {
    return (
      <div className={classes.loadingBar}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <DetailsMinerTable minersInfo={minersInfo} />
    </div>
  );
}
