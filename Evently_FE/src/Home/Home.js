import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import classes from "./Home.module.css";
import Navbar from "../Navbar/Navbar";

function Home(props) {
  const [events, setEvents] = useState([]);
  console.log(events)
  useEffect(() => {
    axios
      .get("events/all")
      .then((res) => {
        setEvents(res.data.events);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  return (
    <div>
      <Navbar username={props.username} />
      <div className={classes.homePageContainer}>
        <div className={classes.eventsContainer}>
          {events.length
            ? events.map((event) => {
               return <div className={classes.event}>
                  <h2>{event.title}</h2>
                  <p>{event.location}</p>
                  <p>{event?.time}</p>
                  <p>{event.description}</p>
                </div>;
              })
            : null}
        </div>
        <div className={classes.sideContainer}>
          <button>Create Event</button>
        </div>
      </div>
    </div>
  );
}
export default Home;
