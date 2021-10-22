import Fab from "@material-ui/core/Fab";
import SaveIcon from "@material-ui/icons/Save";
import Joi from "joi";
import { useForm } from "usetheform";

export function GoToSummaryBtn({ goToSummary }) {
  const { state } = useForm();

  const { error: isInvalid } = formSchema.validate(state);

  return (
    <Fab
      disabled={isInvalid}
      style={{
        flexShrink: 0,
        position: "absolute",
        left: "auto",
        right: "16px",
        top: "auto",
        bottom: "16px"
      }}
      onClick={goToSummary}
      color="secondary"
      aria-label="summary"
    >
      <SaveIcon />
    </Fab>
  );
}

const formSchema = Joi.object({
  activeStep: Joi.number().required(),
  coinName: Joi.string().required(),
  minerMode: Joi.string().required(),
  walletName: Joi.string().required(),
  workerName: Joi.string().required(),
  miner: Joi.object({
    gpus: Joi.string().required(),
    minerInfo: Joi.object({
      minerAssetId: Joi.number().required(),
      minerName: Joi.string().required(),
      minerTagName: Joi.string().required(),
      supportGPUsRegex: Joi.string()
    })
  }).required(),
  poolConfig: Joi.object({
    algo: Joi.string().required(),
    poolName: Joi.string().required(),
    poolPort: Joi.string().required(),
    poolRegion: Joi.string().required()
  }).required()
});
