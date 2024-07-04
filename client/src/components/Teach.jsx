import React from "react";
import { useState } from "react";
import useUser from '../hooks/user/useUser';
import useSkills from "../hooks/skills/useSkills";
import "../style/teach.css";

const Teach = () => {
  const { user } = useUser();
  const { loadingNewSkill, errorNewSkill, createSkill} = useSkills();
  const initialFormData = { title: '', description: '' };
  const [formData, setFormData] = useState(initialFormData);
  if (loadingNewSkill) return <div className="loading">Loading...</div>;
  if (errorNewSkill) return <div className="error">Error: {errorNewSkill}</div>;
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.title === "" || formData.description === "") {
      alert("Please fill in the form");
    } else {
      const skillData = {
        ...formData,
        userId: user.sub // Add the user ID from Auth0
      };
      await createSkill(skillData);
      setFormData(initialFormData);
      alert("Skill added successfully");
    }
  };

  return (
    <div>
      <div className="teach-form">
        <div className="form-text">
          <h1>Share your skills!</h1>
          <p>The more we share the more we have</p>
          <img className="teach-pic" src="/Teach.png" alt="Illustration"></img>
        </div>
        <form className="addSkill" onSubmit={handleSubmit}>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Skill name"/>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Description "></textarea>
          <button type="submit" disabled={loadingNewSkill}>Add Skill</button>
        </form>
      </div>
      <footer>
        <p>Copyright &copy; All Rights Reserved.</p>
      </footer>    
    </div>
  );
}

export default Teach;