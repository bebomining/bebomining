import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

export const Cpus = ({ cpus }) => {
  const classes = useStyles();

  if (!cpus) {
    return null;
  }

  return (
    <div className={classes.root}>
      <TableContainer className={classes.table}>
        <Table aria-label="miner details">
          <TableHead>
            <TableRow>
              <TableCell className={classes.TableHead}>CPU Model</TableCell>
              <TableCell className={classes.TableHead}>Current H/S</TableCell>
              <TableCell className={classes.TableHead}>Best H/S</TableCell>
              <TableCell className={classes.TableHead}>Cores</TableCell>
              <TableCell className={classes.TableHead}>Threads</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cpus.map(
              ({
                name,
                cores,
                threads,
                performance = 0,
                performanceHighest = 0
              }) => {
                return (
                  <TableRow key={name}>
                    <TableCell component="th" scope="row">
                      {name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {performance}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {performanceHighest}
                    </TableCell>
                    <TableCell component="th">{cores}</TableCell>
                    <TableCell component="th">{threads}</TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const useStyles = makeStyles({
  root: {
    position: "relative",
    width: "100%",
    display: "flex",
    padding: "8px 16px"
  },
  table: { flex: 1, border: "1px solid #e8eff7", borderRadius: "5px" },
  TableHead: {
    fontWeight: "bold",
    textTransform: "uppercase"
  }
});
