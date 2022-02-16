export const mainAppReducer = (state: IMainAppState, action: any) => {
  switch (action.type) {
    case "SWITCH USERUTIL FORM":
      return {
        ...state,
        [action.field]: action.payload,
      };
    case "SWITCH USERUTIL CLASS":
      return {
        ...state,
        [action.field]: action.payload,
      };
    case "SET UTIL MESSAGE AND CLASS":
      return {
        ...state,
        [action.field_message]: action.payload,
        [action.field_class]: action.payload_two,
      };
    default:
      return state;
  }
};

export const initialMainAppState: IMainAppState = {
  formStatusMessage: "",
  formStatusClass: "",
  userUtilFormState: "",
  userUtilFormMessage: "",
  userUtilFormClass: "",
};

export const userUtilFormHandler = (
  payload: string,
  mainAppDispatch: (value: any) => void
) => {
  mainAppDispatch({
    type: "SWITCH USERUTIL FORM",
    field: "userUtilFormState",
    payload: payload,
  });
};

export const userUtilFormClassHandler = (
  payload: string,
  mainAppDispatch: (value: any) => void
) => {
  mainAppDispatch({
    type: "SWITCH USERUTIL CLASS",
    field: "userUtilFormClass",
    payload: payload,
  });
};

export const userUtilSetFormMessage = (
  payload: string,
  payload_two: "form__success" | "form__error",
  mainAppDispatch: (value: any) => void
) => {
  mainAppDispatch({
    type: "SET UTIL MESSAGE AND CLASS",
    field_message: "userUtilFormMessage",
    field_class: "userUtilFormClass",
    payload: payload,
    payload_two: payload_two,
  });
};
