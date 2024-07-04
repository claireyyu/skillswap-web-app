import { useState, useEffect } from "react";
import { useAuthToken } from "../../AuthTokenContext";

export default function useSkills() {
  const [skills, setSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [errorSkills, setErrorSkills] = useState(null);
  const { accessToken, loadingToken } = useAuthToken();

  const fetchSkills = async () => {
    if (!accessToken) return;
    try {
      setLoadingSkills(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/skills`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch skills");
      }

      const skillsData = await response.json();
      setSkills(skillsData);
    } catch (error) {
      setErrorSkills(error.message);
    } finally {
      setLoadingSkills(false);
    }
  };

  useEffect(() => {
    if (!loadingToken) {
      fetchSkills();
    }
  }, [accessToken, loadingToken]);

  const createSkill = async (skillData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/skills`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(skillData),
      });

      if (!response.ok) {
        throw new Error("Failed to create new skill");
      }

      const newSkill = await response.json();
      setSkills([...skills, newSkill]);
    } catch (error) {
      setErrorSkills(error.message);
    } finally {
      setLoadingSkills(false);
    }
  };
  
  const updateSkill = async (id, data) => {
    if (!accessToken) throw new Error("Access token not available");
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/Skills/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update skill");
      const updatedSkill = await response.json();
      setSkills(skills.map(skill => skill.id === id ? updatedSkill : skill));
    } catch (error) {
      setErrorSkills(error.message);
    }
  };

  const deleteSkill = async (id) => {
    if (!accessToken) throw new Error("Access token not available");
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/skills/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete skill");
      setSkills(skills.filter(skill => skill.id !== id));
    } catch (error) {
      setErrorSkills(error.message);
    }
  };

  return { skills, setSkills, loadingSkills, errorSkills, fetchSkills, updateSkill, deleteSkill, createSkill};
}