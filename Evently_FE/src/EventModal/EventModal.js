import axios from "axios";
import react, { useEffect, useState } from "react";
import classes from "./EventModal.module.css";
import UsersDropdown from "../UsersDropdown/UsersDropdown";

function EventModal(props) {
  const [guestUserSearch, setGetUserSearch] = useState("");
  const [matchedUsers, setMatchedUser] = useState([]);
  const [eventData, setEventFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    duration: "",
    guests: [],
  });

  const eventInputHandler = (e) => {
    setEventFormData({
      ...eventData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGuestSearch = (e) => {
    if (e.target.value.trim().length) {
      axios
        .get(`/users/user/${e.target.value}`)
        .then((res) => setMatchedUser(res.data.usersFound))
        .catch((e) => console.log(e));
    }
  };

  const addGuestHandler = (e) => {
    e.preventDefault();

    if (guestUserSearch.trim().length) {
      // setEventFormData({
      //   ...eventData,
      //   guests: [...eventData.guests, guestUserSearch],
      // });
    }
  };

  const submitEventForm = (e) => {
    e.preventDefault();
    axios
      .post("/events/saveEvent", eventData)
      .then((res) => {
        props.setEvents([...props.events, res.data.message.event]);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className={classes.EventModalContainer}>
      <div className={classes.EventModal}>
        <button
          className={classes.closeBtn}
          onClick={() => {
            props.setShowEventModal(false);
          }}
        >
          X
        </button>

        <form className={classes.eventForm}>
          <div className={classes.inputControl}>
            <label>Title</label>
            <input
              type="text"
              placeholder="Event title"
              name="title"
              onChange={eventInputHandler}
            />
          </div>
          <div className={classes.dateTimeDuration}>
            <div className={classes.inputControl}>
              <label>Date</label>
              <input
                type="date"
                placeholder="Date"
                name="date"
                onChange={eventInputHandler}
              />
            </div>
            <div className={classes.inputControl}>
              <label>Time</label>
              <input
                type="time"
                placeholder="Time"
                name="time"
                onChange={eventInputHandler}
              />
            </div>
            <div className={classes.inputControl}>
              <label>Duration</label>
              <input
                type="text"
                placeholder="Duration"
                name="duration"
                onChange={eventInputHandler}
              />
            </div>
          </div>
          <div className={classes.inputControl}>
            <label>Location</label>
            <input
              type="text"
              placeholder="Location"
              name="location"
              onChange={eventInputHandler}
            />
          </div>
          <div className={classes.inputControl}>
            <label>Description</label>
            <textarea
              placeholder="Description"
              name="description"
              onChange={eventInputHandler}
            ></textarea>
          </div>
          <hr />
          <div className={classes.inputControl}>
            <label>Add Guests</label>
            <div className={classes.searchGuest}>
              {matchedUsers && matchedUsers.length ? (
                <UsersDropdown users={matchedUsers} />
              ) : null}
              <input
                type="search"
                placeholder="Guest username"
                name="guests"
                onChange={handleGuestSearch}
              />
              <button className={classes.addGuest} onClick={addGuestHandler}>
                Add
              </button>
            </div>
          </div>
          <button className={classes.submitBtn} onClick={submitEventForm}>
            SUBMIT
          </button>
        </form>
      </div>
    </div>
  );
}

export default EventModal;
