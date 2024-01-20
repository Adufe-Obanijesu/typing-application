import { toast } from "react-toastify";

const successNotification = (message: string) => {
  toast.success(message, { position: toast.POSITION.TOP_CENTER });
};

const errorNotification = (message: string) => {
  toast.error(message, { position: toast.POSITION.TOP_CENTER });
};

export { successNotification, errorNotification };
