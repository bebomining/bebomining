import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import FavoriteIcon from "@material-ui/icons/Favorite";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  AppBar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  actionbox: {
    display: "flex",
    flexDirection: "row"
  },
  redLine: {
    position: "absolute",
    width: "100%",
    height: "2px",
    top: "auto",
    bottom: "0",
    backgroundColor: "#f50057"
  },
  Buttons: {
    ["@media (max-width:900px)"]: {
      "& .btn-label": { display: "none" },
      "& .MuiButton-startIcon": { margin: "0" },
      padding: "8px 16px",
      minWidth: "initial"
    }
  }
}));

export function NavigationHeader() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();

  const [value, setValue] = useState(() => {
    const goTo = Object.keys(mapRoutes).find(basePath =>
      history.location.pathname.includes(basePath)
    );

    return mapRoutes[goTo];
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const route = Object.entries(mapRoutes).find(
      ([, index]) => index === newValue
    )?.[0];
    const { rigId } = match.params;
    typeof route !== "undefined" && history.push(`/rigs/${rigId}${route}`);
  };

  useEffect(() => {
    if (location?.pathname) {
      const path = location.pathname?.split?.("/")?.[3] || "-1";
      const newValue = mapRoutes[`/${path}`];

      if (newValue !== undefined) {
        setValue(newValue);
      }
    }
  }, [location]);

  return (
    <div className={classes.root}>
      <AppBar className={classes.AppBar} position="static">
        <Tabs value={value} onChange={handleChange} aria-label="main tabs">
          <Tab label="Workers" {...a11yProps(2)} />
          <Tab label="Miners" {...a11yProps(0)} />
          <Tab label="Wallets" {...a11yProps(1)} />
        </Tabs>
        <div className={classes.actionbox}>
          <Button
            className={classes.Buttons}
            style={{
              position: "relative",
              borderRadius: "unset"
            }}
            disableElevation
            variant="contained"
            color="primary"
            size="medium"
            startIcon={<FavoriteIcon />}
            onClick={() => {
              const { rigId } = match.params;
              history.push(`/rigs/${rigId}/donation`);
              handleChange(0, 3);
            }}
          >
            <span className="btn-label">Donate</span>
            {value === 3 && <span className={classes.redLine} />}
          </Button>
        </div>
      </AppBar>
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `main-tab-${index}`,
    "aria-controls": `main-tabpanel-${index}`
  };
}

const mapRoutes = {
  "/workers": 0,
  "/miners": 1,
  "/wallets": 2,
  "/donation": 3
};
