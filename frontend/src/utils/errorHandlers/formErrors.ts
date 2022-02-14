const formErrors = (error: any, messageHandler: any) => {
  console.log(error.response);
  if (!error.response) {
    messageHandler("Please select a service");
  } else {
    if (
      error.response.data.error ===
      "User validation failed: email: email is invalid"
    ) {
      return messageHandler("This is not a valid email");
    }
    if (error.response.data.error === "user not found") {
      return messageHandler("This is email was not found");
    }
    if (error.response.data.error === "user with that pin not found") {
      return messageHandler("Not a valid pin");
    }
    switch (error.response.status) {
      case 500:
        messageHandler("There was a server error, please refresh");
        break;
      case 409:
        messageHandler("This email is already in use");
        break;
      case 406:
        messageHandler("All fields are required");
        break;
      case 405:
        messageHandler("There are not enough seats available in that service");
        break;
      case 404:
        messageHandler("All fields are required");
        break;
      default:
        messageHandler("All fields are required");
        break;
    }
  }
};

export default formErrors;
