import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import classes from "./Home.module.css";
import Navbar from "../Navbar/Navbar";
import EventModal from "../EventModal/EventModal";
import EventItem from "../Event/EventItem";

function Home(props) {
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const location = useLocation();
  const [username, setUsername] = useState(
    props.username || location.state.username
  );
  const [eventsAttending, setEventsAttending] = useState(
    props.userDetails.eventsAttending || []
  );
  const [bookmarkedEvents, setBookmarkedEvent] = useState(
    props.userDetails.bookedmarkedEvents || []
  );
  const getAllEvents = () => {
    axios
      .get("events/all")
      .then((res) => {
        setEvents(res.data.events);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    getAllEvents();
  }, [eventsAttending, bookmarkedEvents]);

  const getEvent = (event) => {
    let eventId = event.target.id;
    axios
      .get(`/events/event/${eventId}`)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getSavedEvents = () => {
    axios
      .get("/events/saved/")
      .then((res) => {
        console.log(res)
        setEvents(res.data.result);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <div>
      {showEventModal && (
        <EventModal
          setShowEventModal={setShowEventModal}
          setEvents={setEvents}
          events={events}
        />
      )}
      <Navbar username={username} setIsAuth={props.setIsAuth} />

      <div className={classes.homePageContainer}>
        <div className={classes.eventsContainer}>
          <ul className={classes.filterOptions}>
            <li onClick={getAllEvents}>All</li>
            <li onClick={getSavedEvents}>Saved</li>
          </ul>
          {events.length
            ? events.map((event) => {
                return (
                  <EventItem
                    key={event._id}
                    eventData={event}
                    username={props.username || location.state.username}
                    isAttending={eventsAttending.includes(event._id)}
                    isBookMarked={bookmarkedEvents.includes(event._id)}
                    avatarURL={props.userDetails.avatarURL}
                    getEvent={getEvent}
                    setEventsAttending={setEventsAttending}
                    setBookmarkedEvent={setBookmarkedEvent}
                  />
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
            <span>Create Event</span>
          </button>
        </div>
      </div>
    </div>
  );
}
export default Home;
