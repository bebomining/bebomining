import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { Typography } from "@material-ui/core";

const defaultTitle = "TERMS OF USE";
const noop = () => null;
export function Disclaimer({ onAccept = noop, onReject = noop }) {
  const classes = useStyles();

  const [state, setState] = useState({
    checkedDisclaimer: false
  });

  const [checkBoxDisabled, setStateCheckBox] = useState(() => true);

  const handleChange = event => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const [element, setElement] = useState(() => null);

  useEffect(() => {
    let scroll;
    if (element !== null) {
      scroll = function (event) {
        var element = event.target;
        if (
          element.scrollHeight - element.scrollTop <=
          element.clientHeight + 100
        ) {
          setStateCheckBox(false);
        }
      };
      element.addEventListener("scroll", scroll);
    }
    return () => {
      if (element !== null && scroll) {
        element.removeEventListener("scroll", scroll);
      }
    };
  }, [element]);

  return (
    <Dialog
      ref={node => {
        node && setElement(node.querySelector(".MuiDialogContent-root"));
      }}
      open={true}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle disableTypography id="alert-dialog-title">
        <Typography
          variant="h6"
          component="h6"
          gutterBottom
          className={classes.DialogTitle}
        >
          {defaultTitle}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography
          variant="h6"
          component="h6"
          gutterBottom
          className={classes.Title}
        >
          Software License
        </Typography>
        <DialogContentText
          className={classes.Content}
          id="alert-dialog-description"
        >
          {content}
        </DialogContentText>
        <Typography
          className={classes.Title}
          variant="h6"
          component="h6"
          gutterBottom
        >
          Mining Pool and Miner Software
        </Typography>
        <DialogContentText
          className={classes.Content}
          id="alert-dialog-description"
        >
          {content2}
        </DialogContentText>
        <Typography
          className={classes.Title}
          variant="h6"
          component="h6"
          gutterBottom
        >
          GPU Overclocking
        </Typography>
        <DialogContentText
          className={classes.Content}
          id="alert-dialog-description"
        >
          {content3}
        </DialogContentText>

        <Typography
          className={classes.Title}
          variant="h6"
          component="h6"
          gutterBottom
        >
          Application Analytics
        </Typography>
        <DialogContentText
          className={classes.Content}
          id="alert-dialog-description"
        >
          {content4}
        </DialogContentText>

        <Typography
          className={classes.Title}
          variant="h6"
          component="h6"
          gutterBottom
        >
          Application Data and Settings
        </Typography>
        <DialogContentText
          className={classes.Content}
          id="alert-dialog-description"
        >
          {content5}
        </DialogContentText>

        <Typography
          className={classes.Title}
          variant="h6"
          component="h6"
          gutterBottom
        >
          Modifications and Interruptions
        </Typography>
        <DialogContentText
          className={classes.Content}
          id="alert-dialog-description"
        >
          {content1}
        </DialogContentText>
      </DialogContent>
      <FormControlLabel
        className={classes.FormControlLabel}
        control={
          <Checkbox
            disabled={checkBoxDisabled}
            checked={state.checkedDisclaimer}
            onChange={handleChange}
            name="checkedDisclaimer"
          />
        }
        label="I have read and understand the Terms of Use"
      />
      <DialogActions>
        <Button variant="contained" color="secondary" onClick={onReject}>
          Reject Terms
        </Button>
        <Button
          disabled={!state.checkedDisclaimer}
          onClick={onAccept}
          variant="contained"
          color="primary"
        >
          Accept Terms
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const useStyles = makeStyles({
  Content: {
    fontSize: "15px"
  },
  Title: {
    fontSize: "18px"
  },
  DialogTitle: { fontWeight: "bolder" },
  FormControlLabel: {
    padding: "4px 16px"
  }
});

const content =
  "THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.";

const content2 =
  "Application does not charge any fees on your mining balance. Fees are charged by the miner software and by the mining pool you pick to mine with. To get more information we kindly invite you to visit the official pool website as well as the miner software website.";

const content3 =
  "Application does not apply any overclock setting to your GPUs. Overclocking GPUs is at your own risk. We are not accountable for any possible GPUs damage due to wrongs overclock settings. We kindly suggest you to be cautious on applying overclock settings.";

const content1 =
  "We reserve the right to change, modify, or remove the contents of the Application at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Application. We also reserve the right to modify or discontinue all or part of the Application without notice at any time. We will not be liable to you or any third party for any modification, suspension, or discontinuance of the Application.";

const content4 =
  "We use Google Analytics for aggregated, anonymized website traffic analysis. In order to track your session usage, Google drops a cookie (_ga) with a randomly-generated ClientID. This ID is anonymized and contains no identifiable information like email, phone number, name, etc. Google Analytics collects your IP Address. We use GA to track aggregated application behavior. This information is important to us for improving the user experience, by using the application you consent to the collection of the information by Google Analytics.";

const content5 =
  "Application does not sync on the cloud any data or settings such as workers info, wallets info or any other information. Data is stored locally on your machine. The data safety, integrity and the data backup is your responsibility.";
