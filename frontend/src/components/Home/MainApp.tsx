import { useEffect, useReducer, useState } from "react";
import socketclient from "socket.io-client";
import { getServicesAPI } from "../../api/servicesAPI";
import { createUserAPI } from "../../api/usersAPI";
import {
  initialMainAppState,
  mainAppReducer,
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
      // error handler
      console.log(error);
    }
  };

  const mainFormSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await createUserAPI(mainFormState);
      mainFormClearHandler(mainFormDispatch);
    } catch (error) {
      // error handler
      console.log(error);
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
          <div>
            <p>{mainAppState.formStatusMessage}</p>
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
