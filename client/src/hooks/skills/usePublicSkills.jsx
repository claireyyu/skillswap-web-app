import { useState, useEffect, useCallback } from "react";

export default function usePublicSkills() {
  const [skills, setSkills] = useState([]);
  const [skill, setSkill] = useState();
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [errorSkills, setErrorSkills] = useState(null);

  const fetchPublicSkills = useCallback(async () => {
    setLoadingSkills(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/skills/public`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch public skills");
      }

      const skillsData = await response.json();
      setSkills(skillsData);
      return skillsData;
    } catch (error) {
      setErrorSkills(error.message);
    } finally {
      setLoadingSkills(false);
    }
  }, []);

  const fetchPublicSkillById = useCallback(async (id) => {
    setLoadingSkills(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/skills/public/${id}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch public skill");
      }

      const skillData = await response.json();
      setSkill(skillData);
    } catch (error) {
      setErrorSkills(error.message);
    } finally {
      setLoadingSkills(false);
    }
  }, []);

  return { skills, setSkills, skill, loadingSkills, errorSkills, fetchPublicSkills, fetchPublicSkillById };
}
