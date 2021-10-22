import { useForm, STATUS } from "usetheform";
import Button from "@material-ui/core/Button";

const noop = () => null;
export const SubmitFormButton = ({
  size,
  startIcon,
  onClick = noop,
  children
}) => {
  const { isValid, formStatus, submitted } = useForm();
  const isSubmitting = formStatus === STATUS.ON_SUBMIT;

  return (
    <Button
      disabled={!isValid || isSubmitting || submitted > 0}
      type="submit"
      size={size}
      variant="contained"
      color="primary"
      onClick={onClick}
      startIcon={startIcon}
    >
      {children}
    </Button>
  );
};
