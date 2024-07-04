import { useState, useEffect } from "react";
import { useAuthToken } from "../../AuthTokenContext";

export default function useMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [loadingMeetings, setloadingMeetings] = useState(true);
  const [errorMeetings, setErrorMeetings] = useState(null);
  const { accessToken, loadingToken } = useAuthToken();

  const fetchMeetings = async () => {
    if (!accessToken) return;
    try {
      setloadingMeetings(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/meetings`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch meetings");
      }

      const meetingsData = await response.json();
      setMeetings(meetingsData);
    } catch (error) {
      setErrorMeetings(error.message);
    } finally {
      setloadingMeetings(false);
    }
  };

  useEffect(() => {
    if (!loadingToken) {
      fetchMeetings();
    }
  }, [accessToken, loadingToken]);

  const createMeeting = async (meetingData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/meetings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(meetingData),
      });

      if (!response.ok) {
        throw new Error("Failed to create new meeting");
      }

      const newMeeting = await response.json();
      setMeetings([...meetings, newMeeting]);
    } catch (error) {
      setErrorMeetings(error.message);
    } finally {
      setloadingMeetings(false);
    }
  };
  
  const updateMeeting = async (id, data) => {
    if (!accessToken) throw new Error("Access token not available");
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/meetings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update meeting");
      const updatedMeeting = await response.json();
      setMeetings(meetings.map(meeting => meeting.id === id ? updatedMeeting : meeting));
    } catch (error) {
      setErrorMeetings(error.message);
    }
  };

  const deleteMeeting = async (id) => {
    if (!accessToken) throw new Error("Access token not available");
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/meetings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete meeting");
      setMeetings(meetings.filter(meeting => meeting.id !== id));
    } catch (error) {
      setErrorMeetings(error.message);
    }
  };

  return { meetings, setMeetings, loadingMeetings, errorMeetings, updateMeeting, deleteMeeting, createMeeting};
}