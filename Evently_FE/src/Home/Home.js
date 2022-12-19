import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import classes from "./Home.module.css";
import Navbar from "../Navbar/Navbar";
import EventModal from "../EventModal/EventModal";

function Home(props) {
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);

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

  const getEvent = (event) => {
    let eventId = event.target.id;
    axios.get(`/events/event/${eventId}`)
    .then(res=>{
      console.log(res)
    })
    .catch(e => {
      console.log(e)
    })
  };

  return (
    <div>
      {showEventModal && <EventModal setShowEventModal={setShowEventModal} />}
      <Navbar username={props.username} />
      <div className={classes.homePageContainer}>
        <div className={classes.eventsContainer}>
          {events.length
            ? events.map((event) => {
                return (
                  <div key={event._id} className={classes.event}>
                    <h2>{event.title}</h2>
                    <p>{event._id}</p>

                    <p>{event.location}</p>
                    <p>{event?.time}</p>
                    <p>{event.description}</p>
                    <button id={event._id} onClick={getEvent} className={classes.detailsBtn}>More Details</button>
                  </div>
                );
              })
            : null}
        </div>
        <div className={classes.sideContainer}>
          <button
            onClick={() => {
              setShowEventModal(true);
            }}
          >
            Create Event
          </button>
        </div>
      </div>
    </div>
  );
}
export default Home;
