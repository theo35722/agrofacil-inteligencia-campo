
import { toast as sonnerToast } from "sonner";

export const toast = sonnerToast;

export type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  cancel?: React.ReactNode;
  duration?: number;
};
