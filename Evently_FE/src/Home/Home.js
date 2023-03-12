import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import classes from "./Home.module.css";
import Navbar from "../Navbar/Navbar";
import EventModal from "../EventModal/EventModal";
import EventItem from "../Event/EventItem";
import {
  socketConnection,
  emitClientData,
  getNotifications,
} from "../Services/Socket";
import { getSavedEvents, getAllEvents } from "../Services/EventHelpers";

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
  const [notifications, setNotifications] = useState([]);
    console.log(props.userDetails.eventsAttending)
  useEffect(() => {
    let socket = socketConnection();
    socket.on("connect", () => {
      emitClientData(props.username);
      getNotifications(props.username, (data) => {
        setNotifications([...notifications, ...data.notifications]);
      });
    });
  }, []);

  const getAllEventsHandler = async () => {
    const events = await getAllEvents();
    setEvents(events);
  };

  useEffect(() => {
    getAllEventsHandler();
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

  const getSavedEventsHandler = async () => {
    const savedEvents = await getSavedEvents();
    setEvents(savedEvents);
  };

  return (
    <div className={classes.parentContainer}>
      {showEventModal && (
        <EventModal
          username={username}
          setShowEventModal={setShowEventModal}
          setEvents={setEvents}
          events={events}
        />
      )}

      <Navbar
        username={username}
        setIsAuth={props.setIsAuth}
        notifications={notifications}
      />

      <div className={classes.homePageContainer}>
        <div className={classes.eventsContainer}>
          <ul className={classes.filterOptions}>
            <li onClick={getAllEventsHandler}>All</li>
            <li onClick={getSavedEventsHandler}>Saved</li>
          </ul>
          {events.length
            ? events.map((event) => {
                return (
                  <EventItem
                    key={event._id}
                    eventData={event}
                    isAttending={eventsAttending.includes(event._id)}
                    isBookMarked={bookmarkedEvents.includes(event._id)}
                    userDetails={props.userDetails}
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
