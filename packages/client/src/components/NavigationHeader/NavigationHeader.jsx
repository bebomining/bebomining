import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import FavoriteIcon from "@material-ui/icons/Favorite";
import Button from "@material-ui/core/Button";

import { ActionMenu } from "./components/ActionMenu/ActionMenu";

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
  }
}));

export function NavigationHeader() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const [value, setValue] = useState(() => {
    const goTo = Object.keys(mapRoutes).find(basePath =>
      history.location.pathname.startsWith(basePath)
    );
    return mapRoutes[goTo];
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const route = Object.entries(mapRoutes).find(
      ([, index]) => index === newValue
    )?.[0];
    typeof route !== "undefined" && history.push(route);
  };

  useEffect(() => {
    if (location?.pathname) {
      const path = location.pathname?.split?.("/")?.[1] || "-1";
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
          <Tab label="Cloud Settings" {...a11yProps(3)} />
        </Tabs>
        <div className={classes.actionbox}>
          <Button
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
              history.push("/donation");
              handleChange(0, 4);
            }}
          >
            Donate
            {value === 4 && <span className={classes.redLine} />}
          </Button>

          <ActionMenu />
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
  "/cloud": 3,
  "/donation": 4
};
