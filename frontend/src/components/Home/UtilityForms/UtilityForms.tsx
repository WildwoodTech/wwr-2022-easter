import React from "react";
import { userUtilFormHandler } from "../../../utils/reducers/mainAppReducer";
import { mainFormClearHandler } from "../../../utils/reducers/mainFormReducer";
import Deleter from "./Deleter";
import Requester from "./Requester";
import Updater from "./Updater";

interface Props {
  services: IService[];
  mainAppState: IMainAppState;
  mainFormDispatch: React.Dispatch<any>;
  mainAppDispatch: React.Dispatch<any>;
}

const UtilityForms = (props: Props) => {
  return (
    <>
      <button
        onClick={() => {
          userUtilFormHandler("updater", props.mainAppDispatch);
          mainFormClearHandler(props.mainFormDispatch);
        }}
      >
        Update Your Selection
      </button>
      <button
        onClick={() => {
          userUtilFormHandler("deleter", props.mainAppDispatch);
          mainFormClearHandler(props.mainFormDispatch);
        }}
      >
        Remove Your Spot
      </button>
      <button
        onClick={() => {
          userUtilFormHandler("requester", props.mainAppDispatch);
          mainFormClearHandler(props.mainFormDispatch);
        }}
      >
        Request User Pin
      </button>
      {props.mainAppState.userUtilFormState === "updater" && (
        <Updater
          // form={props.setUtilForm}
          services={props.services}
          // formMessage={props.setUtilFormMessage}
          // formStatusStyle={setUtilFormStatusStyle}
        ></Updater>
      )}
      {props.mainAppState.userUtilFormState === "deleter" && (
        <Deleter
        // form={props.setUtilForm}
        // formMessage={props.setUtilFormMessage}
        // formStatusStyle={setUtilFormStatusStyle}
        ></Deleter>
      )}
      {props.mainAppState.userUtilFormState === "requester" && (
        <Requester
        // form={props.setUtilForm}
        // formMessage={props.setUtilFormMessage}
        // formStatusStyle={setUtilFormStatusStyle}
        ></Requester>
      )}
    </>
  );
};

export default UtilityForms;
