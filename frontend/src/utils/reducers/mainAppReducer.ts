export const mainAppReducer = (state: IMainAppState, action: any) => {
  switch (action.type) {
    case "SWITCH USERUTIL FORM":
      return {
        ...state,
        [action.field]: action.payload,
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
