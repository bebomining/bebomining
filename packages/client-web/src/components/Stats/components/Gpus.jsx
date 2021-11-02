import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { formatNumber } from "./../../../utils";

export const Gpus = ({ gpus }) => {
  const classes = useStyles();

  if (!gpus) {
    return null;
  }

  return (
    <div className={classes.root}>
      <TableContainer className={classes.table}>
        <Table aria-label="miner details">
          <TableHead>
            <TableRow>
              <TableCell className={classes.TableHead}>Id</TableCell>
              <TableCell className={classes.TableHead}>GPU Model</TableCell>
              <TableCell className={classes.TableHead}>MH/S</TableCell>
              <TableCell className={classes.TableHead}>Power</TableCell>
              <TableCell className={classes.TableHead}>Temp</TableCell>
              <TableCell className={classes.TableHead}>Fan Speed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gpus.map(({ idGpu, name, performance, power, fanSpeed, temp }) => {
              return (
                <TableRow key={idGpu}>
                  <TableCell component="th" scope="row">
                    {idGpu}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {formatNumber(performance, 2)}
                  </TableCell>
                  <TableCell component="th">{power} W</TableCell>
                  <TableCell component="th">{temp} °C</TableCell>
                  <TableCell component="th">{fanSpeed} %</TableCell>
                </TableRow>
              );
            })}
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
