import React from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '../hooks/user/useUser';
import usePublicSkills from '../hooks/skills/usePublicSkills';
import { useEffect } from 'react';

const Preview = () => {
  const {user: learner, errorUser} = useUser();
  const {skills, fetchPublicSkills} = usePublicSkills();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPublicSkills();
  } , [fetchPublicSkills]);

  if (errorUser) return <div className="error">Error: {errorUser}</div>;

  const handleLearnMore = (skillId) => {
    navigate(`/app/skill/${skillId}`);
  }

  return (
    <div className="preview">
      <ul className="skills-list">
        {skills && skills.map((skill) => (
        <li className="skills" key={skill.id}>
          <p>{skill.title}</p>
          <button className="more" onClick={() => handleLearnMore(skill.id)}>Learn more</button>
        </li>
      ))}
      </ul>
    </div>
  );
}

export default Preview;