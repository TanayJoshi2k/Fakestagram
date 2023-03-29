import axios from "axios";

export const getSavedEvents = async () => {
  const res = await axios.get("/events/saved/");
  return res.data.result;
};

export const getAllEvents = async () => {
  const res = await axios.get("events/all");
  return res.data.events;
};

export const getPostComments = async (
  eventId,
  setLoadingComments,
  eventComments,
  setEventComments
) => {
  try {
    setLoadingComments(true);
    const res = await axios.get(`/events/${eventId}/comments`);
    setLoadingComments(false);
    setEventComments(...[...eventComments, res.data.comments]);
  } catch (e) {}
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
    setEventComments([]);
    setComment("");
  }
};

export const eventParticipation = async (
  eventId,
  action,
  userDetails,
  setEventsAttending,
  setShowLoading
) => {
  
};
