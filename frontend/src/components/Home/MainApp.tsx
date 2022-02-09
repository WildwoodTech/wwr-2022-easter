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
      console.log("SOCKET!");

      getServicePayload();
    });
  }, []);

  const getServicePayload = async () => {
    console.log("triggered!");

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
        {mainFormState.serviceId && (
          <>
            <Inputs
              mainFormState={mainFormState}
              mainFormDispatch={mainFormDispatch}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                mainFormDispatch({
                  type: "TOGGLE CHILDERN FORM",
                });
              }}
            >
              Children!
            </button>
            {mainFormState.children && (
              <ChildrenInputs mainFormDispatch={mainFormDispatch} />
            )}
            <button type="submit">Reserve</button>
          </>
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
