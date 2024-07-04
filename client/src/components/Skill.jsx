import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import useUser from '../hooks/user/useUser';
import useMeetings from '../hooks/meetings/useMeetings';
import usePublicSkills from "../hooks/skills/usePublicSkills";
import "../style/skill.css";

const Skill = () => {
  const { isAuthenticated } = useAuth0();
  const { user: learner } = useUser();
  const { id } = useParams();
  const { skill, fetchPublicSkillById } = usePublicSkills();
  const [meetingTime, setMeetingTime] = useState({});
  const { createMeeting } = useMeetings();
  const [error, setError] = useState(null); 
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchPublicSkillById(id);
  }, [id, fetchPublicSkillById]);

  const handleTimeChange = (e, skillId) => {
    setMeetingTime({
      ...meetingTime,
      [skillId]: e.target.value,
    });
    console.log(meetingTime);
  };

  const handleBooking = (skillId) => {
    const time = meetingTime[skillId];
    if (!time) {
      setError('Meeting time not set');
      return;
    }

    if (!isAuthenticated) {
      setError('You need to log in to book a meeting.');
      return;
    }

    const tutorUserId = skill.user.id;
    const learnerUserId = learner.id;
    const title = skill.title;

    // Check if the learner is trying to book a meeting with themselves
    if (tutorUserId === learnerUserId) {
      setError("You cannot book a meeting with yourself."); // Set error message
      return;
    }

    if (tutorUserId && title && time) {
      createMeeting({
        learnerUserId,
        tutorUserId,
        meetingTime: time,
        title,
      });
      setSuccess('Meeting successfully booked!');
    } else {
      setError("Missing fields");
    }
  };

  return (
    <div className="skill">
      <h1 className="skill-header">Skill Detail</h1>
      {skill ? (
        <div className="skill-detail">
          <p className="title">{skill.title}</p>
          <p className="description">{skill.description || "N/A"}</p>
          <p className="tutor">Posted by: {skill.user.name}</p>
          <p className="availableTime">Available Time: {skill.user.availableTime || "N/A"}</p>
          <label className="meetingTime" htmlFor={`meeting-time-${skill.id}`}>Choose meeting time:</label>
          <input
            id={`meeting-time-${skill.id}`}
            className="skill-date"
            type="datetime-local"
            name="meeting"
            defaultValue="2024-06-26T08:30"
            onChange={(e) => handleTimeChange(e, skill.id)} />
          <button className="more" onClick={() => handleBooking(skill.id)}>Book now</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Skill;