import { useEffect, useReducer, useState } from "react";
import socketclient from "socket.io-client";
import { getServicesAPI } from "../../api/servicesAPI";
import { createUserAPI } from "../../api/usersAPI";
import formErrors from "../../utils/errorHandlers/formErrors";
import {
  initialMainAppState,
  mainAppReducer,
  userUtilSetFormMessage,
} from "../../utils/reducers/mainAppReducer";
import {
  initialMainFormState,
  mainFormClearHandler,
  mainFormReducer,
} from "../../utils/reducers/mainFormReducer";
import ChildrenInputs from "./MainForm/ChildrenInputs";
import Inputs from "./MainForm/Inputs";
import Services from "./MainForm/Services";
import UtilityForms from "./UtilityForms/UtilityForms";

const MainApp = () => {
  const [servicesPayload, setServicesPayload] = useState<IService[]>([]);
  const [mainAppState, mainAppDispatch] = useReducer(
    mainAppReducer,
    initialMainAppState
  );
  const [mainFormState, mainFormDispatch] = useReducer(
    mainFormReducer,
    initialMainFormState
  );

  useEffect(() => {
    getServicePayload();
    const socket = socketclient();
    socket.on("userUpdate", () => {
      getServicePayload();
    });
  }, []);

  const getServicePayload = async () => {
    try {
      const services = await getServicesAPI();
      setServicesPayload(services);
    } catch (error) {
      userUtilSetFormMessage(
        "Database Error, Try Reloading Page!",
        "form__error",
        "main",
        mainAppDispatch
      );
    }
  };

  const mainFormSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await createUserAPI(mainFormState);
      mainFormClearHandler(mainFormDispatch);
      userUtilSetFormMessage(
        "Successfully Reserved Selection",
        "form__success",
        "main",
        mainAppDispatch
      );
    } catch (error) {
      formErrors(error, mainAppDispatch, "main");
    }
  };

  return (
    <div className="home_app">
      <form className="home_main-form " onSubmit={mainFormSubmit}>
        <div className="home_main-form-service-selector">
          <Services
            services={servicesPayload}
            mainFormState={mainFormState}
            mainFormDispatch={mainFormDispatch}
            mainAppDispatch={mainAppDispatch}
          />
        </div>
        {mainAppState.formStatusMessage && (
          <div className="utility_status_container">
            <p className={`utility_status ${mainAppState.formStatusClass}`}>
              {mainAppState.formStatusMessage}
            </p>
          </div>
        )}
        {mainFormState.serviceId && (
          <div className="home_main-form-inputs" id="home_main-form-inputs">
            <Inputs
              mainFormState={mainFormState}
              mainFormDispatch={mainFormDispatch}
            />
            <label className="label__control" htmlFor="children">
              Bringing Children?
            </label>
            <p>Sixth graders and older will attend main service</p>
            <input
              name="children"
              checked={mainFormState.children}
              type="checkbox"
              className=""
              onChange={() => {
                mainFormDispatch({
                  type: "TOGGLE CHILDERN FORM",
                });
              }}
            ></input>
            {mainFormState.children && (
              <ChildrenInputs mainFormDispatch={mainFormDispatch} />
            )}
            <button className="button__control" type="submit">
              Reserve
            </button>
          </div>
        )}
      </form>
      <UtilityForms
        services={servicesPayload}
        mainAppState={mainAppState}
        mainFormDispatch={mainFormDispatch}
        mainAppDispatch={mainAppDispatch}
      />
    </div>
  );
};

export default MainApp;
