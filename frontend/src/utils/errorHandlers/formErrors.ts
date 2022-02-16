import { userUtilSetFormMessage } from "../reducers/mainAppReducer";

const formErrors = (error: any, dispatch: any) => {
  console.log(error.response.status);
  console.log(error.response);

  let formMessage = "server error";

  if (!error.response) {
    formMessage = "Please select a service";
  } else {
    if (
      error.response.data.error ===
      "User validation failed: email: email is invalid"
    ) {
      formMessage = "This is not a valid email";
    }
    if (error.response.data.error === "user not found") {
      formMessage = "This is email was not found";
    }
    if (error.response.data.error === "user with that pin not found") {
      formMessage = "Not a valid pin";
    }
    // switch (error.response.status) {
    //   case 500:
    //     formMessage = "There was a server error, please refresh";
    //     break;
    //   case 409:
    //     formMessage = "This email is already in use";
    //     break;
    //   case 406:
    //     formMessage = "All fields are required";
    //     break;
    //   case 405:
    //     formMessage = "Not a valid pin";
    //     break;
    //   case 404:
    //     formMessage = "All fields are required";
    //     break;
    //   default:
    //     formMessage = "All fields are required";
    //     break;
    // }
  }

  userUtilSetFormMessage(formMessage, "form__error", dispatch);
};

export default formErrors;
