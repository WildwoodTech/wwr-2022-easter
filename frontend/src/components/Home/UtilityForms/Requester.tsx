import React, { useState } from "react";
import { requestUserPinByEmailAPI } from "../../../api/usersAPI";
import { userUtilFormHandler } from "../../../utils/reducers/mainAppReducer";

interface Props {
  mainAppDispatch: React.Dispatch<any>;
}

const Requester = (props: Props) => {
  const [email, setEmail] = useState("");
  const [formStatus, setFormStatus] = useState("");

  const requestUserPinHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await requestUserPinByEmailAPI(email);
      //   setEmail("");
      //   props.formStatusStyle("form__pass");
      //   props.formMessage("Check email for pin");
      //   props.form("");
    } catch (error) {
      // handle error
      console.log(error);

      //   props.formStatusStyle("form__error");
      //   setFormStatus(styles["Form--Error"]);
      //   formErrors(error, props.formMessage);
    }
  };

  return (
    <div className={`utility_container ${formStatus}`}>
      <div className="utility_header">
        <div className="utility_header-title">
          <p>Request User Pin:</p>
        </div>
        <div
          className="utility_header-exit"
          onClick={() => {
            userUtilFormHandler("", props.mainAppDispatch);
          }}
        >
          <svg
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
          </svg>
        </div>
      </div>
      <form className="utility_form" onSubmit={requestUserPinHandler}>
        <label className="label__control" htmlFor="seatsInput">
          Email
        </label>
        <input
          name="email"
          className="input__control"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <button className="button__control" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Requester;
