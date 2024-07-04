import { useState, useEffect } from "react";

const useMeetingForm = (meetings) => {
  const [meetingEditData, setMeetingEditData] = useState({
    title: "",
    meetingTime: ""
  });
  const [editingMeetingId, setEditingMeetingId] = useState(null);

  useEffect(() => {
    if (editingMeetingId !== null) {
      const meeting = meetings.find(meeting => meeting.id === editingMeetingId);
      if (meeting) {
        setMeetingEditData({
          title: meeting.title,
          meetingTime: meeting.meetingTime
        });
      }
    }
  }, [editingMeetingId, meetings]);

  const handleEditMeeting = (id) => {
    setEditingMeetingId(id);
  };

  const handleCancelEditMeeting = () => {
    setEditingMeetingId(null);
    setMeetingEditData({
      title: "",
      meetingTime: ""
    });
  };

  const handleSaveMeeting = async (updateMeeting) => {
    try {
      await updateMeeting(editingMeetingId, meetingEditData);
      handleCancelEditMeeting();
    } catch (error) {
      console.error("Error saving meeting info:", error);
    }
  };

  return {
    meetingEditData,
    handleChange: (e) => {
      const { name, value } = e.target;
      setMeetingEditData({
        ...meetingEditData,
        [name]: value,
      });
    },
    setMeetingEditData,
    handleEditMeeting,
    handleCancelEditMeeting,
    handleSaveMeeting,
    editingMeetingId,
  };
};

export default useMeetingForm;
