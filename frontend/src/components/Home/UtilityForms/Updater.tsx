import React, { useState } from "react";
import { updateUserSeatsByPinAPI } from "../../../api/usersAPI";

interface Props {
  services: IService[];
}

const Updater = (props: Props) => {
  const [userPin, setUserPin] = useState("");
  const [seats, setSeats] = useState(0);
  const [selectedService, setSelectedService] = useState("");
  const [formStatus, setFormStatus] = useState("");

  const updateUserHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserSeatsByPinAPI(userPin, seats, selectedService);
      // setUserPin("");
      // setSeats("");
      // setSelectedService("");
      // props.formStatusStyle("form__pass");
      // props.formMessage("Successfully Updated");
      // props.form("");
    } catch (error) {
      // error handler
      console.log(error);
      // props.formStatusStyle("form__error");
      // setFormStatus(styles["Form--Error"]);
      // formErrors(error, props.formMessage);
    }
  };

  const serviceInputs = props.services.map((service) => {
    const date = new Date(service.time);
    return (
      <div
        key={service._id}
        // className={styles["Input-Container__form"]}
      >
        <input
          // className={styles["UserUtils-Checkbox"]}
          type="checkbox"
          value={service._id}
          name={service._id}
          checked={selectedService === service._id}
          onChange={() => setSelectedService(service._id)}
          disabled={!service.seats || service.seats <= 0}
        ></input>
        <span
        // className={styles["Input__span"]}
        >
          {date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
          })}{" "}
          {date.toLocaleTimeString("en-US", {
            weekday: "long",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    );
  });

  return (
    <div
    // className={`${styles["UserUtils-Container"]} ${formStatus}`}
    >
      <div
      // className={styles["UserUtils-Header"]}
      >
        <div
        // className={styles["UserUtils-Header__title"]}
        >
          <p>Update Selection:</p>
        </div>
        <div
        // className={styles["UserUtils-Header__close"]}
        // onClick={() => {
        //   props.form(false);
        //   props.formMessage("");
        // }}
        >
          {/* <svg
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
          </svg> */}
        </div>
      </div>
      <form
        // className={styles["UserUtils-Form"]}
        onSubmit={updateUserHandler}
      >
        <label className="label__control" htmlFor="seatsInput">
          Updater pin
        </label>
        <input
          name="userPin"
          className="inputs__control"
          type="text"
          value={userPin}
          onChange={(e) => setUserPin(e.target.value)}
        ></input>
        <label className="label__control" htmlFor="seatsInput">
          New seat total
        </label>
        <input
          name="seatsInput"
          className="inputs__control"
          type="number"
          min="1"
          max="10"
          value={seats}
          onChange={(e) => setSeats(parseInt(e.target.value))}
        ></input>
        {serviceInputs}
        <button className="inputs__button">Submit</button>
      </form>
    </div>
  );
};

export default Updater;
