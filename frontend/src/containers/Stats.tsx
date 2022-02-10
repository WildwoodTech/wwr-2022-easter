import React, { useState } from "react";
import axios from "axios";

import "./Stats.scss";

interface IStat {
  service: string;
  signUps: {
    nursery: number;
    twoYears: number;
    threeYears: number;
    fourYears: number;
    kindergarten: number;
    wildlife: number;
  };
}

const Stats = () => {
  const [logged, setLogged] = useState(false);
  const [password, setPassword] = useState("");
  const [stats, setStats] = useState<IStat[]>([]);
  const [formErrorMessage, setFormErrorMessage] = useState("");

  const getStats = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await axios.post("/api/v5/users/stats", {
        password: password,
      });
      setStats(data.data.childrensStatistics);
      setLogged(true);
    } catch (error) {
      setFormErrorMessage("Password Incorrect");
    }
  };

  const statsJSX = stats.map((stat) => {
    return (
      <div key={stat?.service}>
        <div className="stats_service">{stat?.service}</div>
        <div className="stats_signups">
          <p>Nursery: {stat.signUps?.nursery}</p>
          <p>Two Years: {stat.signUps?.twoYears}</p>
          <p>Three Years: {stat.signUps?.threeYears}</p>
          <p>Four Years:{stat.signUps?.fourYears}</p>
          <p>5 - Kindergarten: {stat.signUps?.kindergarten}</p>
          <p>Wildlife: {stat.signUps?.wildlife}</p>
        </div>
      </div>
    );
  });

  return (
    <div className="stats">
      {!logged ? (
        <div className="stats_not-logged">
          <form className="" onSubmit={getStats}>
            <input
              className="stats_input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <button className="stats_button" type="submit">
              Login
            </button>
          </form>
          <span className="stats_error-message">{formErrorMessage}</span>
        </div>
      ) : (
        <>{statsJSX}</>
      )}
    </div>
  );
};

export default Stats;
