import { useState, useEffect } from "react";

const useSkillForm = (skills) => {
  const [skillEditData, setSkillEditData] = useState({ title: "", description: "" });
  const [editingSkillId, setEditingSkillId] = useState(null);

  useEffect(() => {
    if (editingSkillId !== null) {
      const skill = skills.find(skill => skill.id === editingSkillId);
      if (skill) {
        setSkillEditData({
          title: skill.title,
          description: skill.description
        });
      }
    }
  }, [editingSkillId, skills]);

  const handleEditSkill = (id, skill) => {
    setEditingSkillId(id);
  };

  const handleCancelEditSkill = () => {
    setEditingSkillId(null);
    setSkillEditData({ title: "", description: "" });
  };

  const handleSaveSkill = async (updateSkill) => {
    await updateSkill(editingSkillId, skillEditData);
    handleCancelEditSkill();
  };

  return {
    skillEditData,
    setSkillEditData,
    editingSkillId,
    handleEditSkill,
    handleCancelEditSkill,
    handleSaveSkill
  };
};

export default useSkillForm;
