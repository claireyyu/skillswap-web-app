import useUser from "../hooks/user/useUser";
import useSkills from "../hooks/skills/useSkills";
import useMeetings from "../hooks/meetings/useMeetings";
import useUserForm from "../hooks/user/useUserForm";
import useSkillForm from "../hooks/skills/useSkillForm";
import useMeetingForm from "../hooks/meetings/useMeetingForm";
import LocationIQ from "./LocationIQ";
import "../style/profile.css";

const Profile = () => {
  const { user, loadingUser, errorUser, updateUser } = useUser();
  const { meetings, loadingMeetings, errorMeetings, updateMeeting, deleteMeeting } = useMeetings();
  const { skills, loadingSkills, errorSkills, updateSkill, deleteSkill } = useSkills();

  const {
    userEditData,
    handleUserChange,
    handleEditUser,
    handleCancelEditUser,
    handleSaveEditUser,
    editingUser
  } = useUserForm(user);

  const {
    skillEditData,
    editingSkillId,
    handleEditSkill,
    handleCancelEditSkill,
    setSkillEditData,
    handleSaveSkill
  } = useSkillForm(skills);

  const {
    meetingEditData,
    editingMeetingId,
    handleEditMeeting,
    handleCancelEditMeeting,
    setMeetingEditData,
    handleSaveMeeting
  } = useMeetingForm(meetings);

  if (loadingUser || loadingMeetings || loadingSkills) return <div className="loading">Loading...</div>;
  if (errorUser || errorMeetings || errorSkills) return <div className="error">Error: {errorUser || errorMeetings || errorSkills}</div>;

  return (
    <div>
      <div className="profile">
        <div className="profile-header">
          {editingUser ? (
            <input
              type="text"
              name="name"
              value={userEditData.name}
              onChange={handleUserChange}
              className="profile-input"
              placeholder="User Name"
            />
          ) : (
            <h2>{user.name || "Name not available"}</h2>
          )}
          <p className="profile-email">{user.email || "Email not available"}</p>
          <div className="location-section">
            <LocationIQ />
          </div>
        </div>
        <div className="profile-details">
          <h3>Availability</h3>
          {editingUser ? (
            <input
              type="text"
              name="availableTime"
              value={userEditData.availableTime}
              onChange={handleUserChange}
              className="profile-input"
              placeholder="Available Time"
            />
          ) : (
            <p>{user.availableTime || "Not specified"}</p>
          )}

          <h3>Bio</h3>
          {editingUser ? (
            <textarea
              name="bio"
              value={userEditData.bio}
              onChange={handleUserChange}
              className="profile-textarea"
              placeholder="Introduce yourself..."
            />
          ) : (
            <p>{user.bio || "Bio not available"}</p>
          )}

          <h3>Skills</h3>
          <div className="skills-section">
            {skills.length === 0 ? (
              <p>No skills added yet</p>
            ) : (
              <ul>
                {skills.map(skill => (
                  <li key={skill.id}>
                    {editingSkillId === skill.id ? (
                      <div>
                        <input
                          type="text"
                          name="title"
                          value={skillEditData.title}
                          onChange={(e) => setSkillEditData({ ...skillEditData, title: e.target.value })}
                          className="profile-input"
                          placeholder="Skill Name"
                        />
                        <input
                          type="text"
                          name="description"
                          value={skillEditData.description}
                          onChange={(e) => setSkillEditData({ ...skillEditData, description: e.target.value })}
                          className="profile-input"
                          placeholder="Skill Description"
                        />
                        <button onClick={() => handleSaveSkill(updateSkill)} className="save-button">Save</button>
                        <button onClick={handleCancelEditSkill} className="cancel-button">Cancel</button>
                      </div>
                    ) : (
                      <>
                        <p className="skill-display-title">{skill.title}</p>
                        <button onClick={() => handleEditSkill(skill.id, skill)} className="edit-button">Edit</button>
                        <button onClick={() => deleteSkill(skill.id)} className="delete-button">Delete</button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <h3>Meetings</h3>
          <div className="meetings-section">
            {meetings.length === 0 ? (
              <p>No meetings added yet</p>
            ) : (
              <ul className="meetings-list">
                {meetings.map(meeting => (
                  <li key={meeting.id}>
                    {editingMeetingId === meeting.id ? (
                      <div>
                        <input
                          type="text"
                          name="title"
                          value={meetingEditData.title}
                          onChange={(e) => setMeetingEditData({ ...meetingEditData, title: e.target.value })}
                          className="profile-input"
                          placeholder="Meeting Title"
                        />
                        <input
                          type="datetime-local"
                          name="meetingTime"
                          value={meetingEditData.meetingTime.split(".")[0]}
                          onChange={(e) => setMeetingEditData({ ...meetingEditData, meetingTime: e.target.value })}
                          className="profile-input"
                        />
                        <button onClick={() => handleSaveMeeting(updateMeeting)} className="save-button">Save</button>
                        <button onClick={handleCancelEditMeeting} className="cancel-button">Cancel</button>
                      </div>
                    ) : (
                      <>
                        <p className="meeting-title">{meeting.title}</p>
                        <p className="meeting-date">{new Date(meeting.meetingTime).toISOString().split('T')[0].replace(/-/g, '.')}</p>
                        <div className="meeting-buttons">
                          <button className="edit-button" onClick={() => handleEditMeeting(meeting.id)}>Edit</button>
                          <button className="delete-button" onClick={() => deleteMeeting(meeting.id)}>Delete</button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {editingUser ? (
            <div className="profile-actions">
              <button onClick={() => handleSaveEditUser(updateUser)} className="save-button">Save</button>
              <button onClick={handleCancelEditUser} className="cancel-button">Cancel</button>
            </div>
          ) : (
            <button onClick={handleEditUser} className="edit-button edit-profile-button">Edit Profile</button>
          )}
        </div>
      </div>
      <footer>
        <p>Copyright &copy; All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Profile;