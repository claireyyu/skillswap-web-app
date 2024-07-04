import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '../hooks/user/useUser';
import usePublicSkills from '../hooks/skills/usePublicSkills';
import "../style/learn.css";

const Learn = () => {
  const {user: learner, errorUser} = useUser();
  const {skills, fetchPublicSkills, errorSkills} = usePublicSkills();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPublicSkills();
  }, [fetchPublicSkills]);

  if (errorSkills) return <div className="error">Error: {errorSkills}</div>;
  if (errorUser) return <div className="error">Error: {errorUser}</div>;

  const handleLearnMore = (skillId) => {
    navigate(`/app/skill/${skillId}`);
  }

  const hideText = (text, maxLenght) => {
    if (text.length > 100) {
      return text.slice(0, maxLenght) + '...';
    }
    return text;
  };

  return (
    <div>
      <div className="learn">
        <h1 className="learn-header">
          Hello! {learner.name}
        </h1>
        <h2 className="learn-intro">
          Learn what you want!
        </h2>
        <ul className="skills-list-learn">
          {skills && skills
          .filter((skill) => skill.user.id !== learner.id)
          .map((skill) => (
          <li className="learn-skills" key={skill.id}>
            <p className="title">{skill.title}</p>
            <p className='description'>{hideText(skill.description || "N/A", 150)}</p>
            <p className='tutor'>Posted by: {skill.user.name}</p>
            <button className="more" onClick={() => handleLearnMore(skill.id)}>Learn more</button>
          </li>
        ))}
        </ul>
      </div>
      <footer>
        <p>Copyright &copy; All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Learn;