import { MouseEventHandler } from "react";
import { Button } from "react-bootstrap";

type Props = {
  disabled?: boolean;
  isLoading: boolean;
  buttonText: string;
  handleClick?: MouseEventHandler;
}

export default function LoadingButton({ isLoading, buttonText, handleClick, disabled }: Props) {
  return (
    <Button
      variant="primary"
      disabled={isLoading || disabled}
      onClick={handleClick}
    >
      {isLoading ? "Loading…" : buttonText}
    </Button>
  );
}