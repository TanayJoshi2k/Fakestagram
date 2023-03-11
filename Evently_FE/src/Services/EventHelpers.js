import axios from "axios";

export const getSavedEvents = async () => {
  const res = await axios.get("/events/saved/");
  return res.data.result;
};

export const getAllEvents = async () => {
  const res = await axios.get("events/all");
  return res.data.events;
};

export const getPostComments = async (eventId) => {
  const res = await axios.get(`/events/${eventId}/comments`);
  return res.data.comments;
};

export const addEventToBookmarks = async (
  eventId,
  username,
  setShowToast,
  setToastMessage,
  setBookmarkedEvent
) => {
  try {
    const res = await axios.post(`events/addToBookmarks/${eventId}`, {
      username: username,
    });
    setToastMessage({ text: res.data.message, error: false });
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
    setBookmarkedEvent(res.data.bookedmarkedEvents);
  } catch (e) {
    setToastMessage({ text: e.response.data.error, error: true });
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
    setBookmarkedEvent(e.response.data.bookedmarkedEvents);
  }
};

export const addComment = async (
  eventId,
  userDetails,
  comment,
  setEventComments,
  setComment
) => {
  try {
    const res = await axios.post(`/events/${eventId}/comments`, {
      username: userDetails.username,
      comment: comment,
      avatarURL: userDetails.avatarURL,
    });
    const comments = res.data.comments;
    setEventComments([...comments]);
    setComment("");
  } catch (e) {
    console.log(e);
    setComment("");
    setEventComments([]);
  }
};

export const eventParticipation = async (
  eventId,
  action,
  userDetails,
  setEventsAttending,
  setShowLoading
) => {
  try {
    setShowLoading(true);
    const res = await axios.post(`/events/${action}/${eventId}`, {
      username: userDetails.username,
    });

    setEventsAttending(res.data.eventsAttending);
    setShowLoading(false);
  } catch (e) {
    console.log(e);
  }
};
