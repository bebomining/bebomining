import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { BtnInstall } from "./components/BtnInstall";

const useStyles = makeStyles({
  table: { flex: 1 },
  TableHead: {
    fontWeight: "bold"
  }
});

export function DetailsMinerTable({ minersInfo }) {
  const classes = useStyles();
  return (
    <TableContainer className={classes.table}>
      <Table aria-label="miner details">
        <TableHead>
          <TableRow>
            <TableCell className={classes.TableHead}>Tag Name</TableCell>
            <TableCell className={classes.TableHead}>Info Release</TableCell>
            <TableCell className={classes.TableHead}>Supports</TableCell>
            <TableCell className={classes.TableHead}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {minersInfo.map(
            ({
              minerName,
              nameWithTag,
              tag_name,
              supports,
              html_url,
              assets,
              id
            }) => (
              <TableRow key={tag_name}>
                <TableCell component="th" scope="row">
                  {nameWithTag}
                </TableCell>
                <TableCell component="th" scope="row">
                  <a
                    title={tag_name}
                    target="_blank"
                    href={html_url}
                    rel="noreferrer"
                  >
                    {html_url}
                  </a>
                </TableCell>
                <TableCell component="th">{supports}</TableCell>
                <TableCell component="th">
                  <BtnInstall
                    assetId={assets.id}
                    releaseId={id}
                    minerName={minerName}
                  />
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
