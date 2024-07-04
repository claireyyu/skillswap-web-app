import { useState, useEffect } from "react";

const useUserForm = (user) => {
  const [userEditData, setUserEditData] = useState({
    name: "",
    availableTime: "",
    bio: ""
  });

  const [editingUser, setEditingUser] = useState(false);

  useEffect(() => {
    if (user) {
      setUserEditData({
        name: user.name || "",
        availableTime: user.availableTime || "",
        bio: user.bio || ""
      });
    }
  }, [user]);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserEditData({
      ...userEditData,
      [name]: value,
    });
  };

  const handleEditUser = () => {
    setEditingUser(true);
  };

  const handleCancelEditUser = () => {
    setEditingUser(false);
    setUserEditData({
      name: user.name || "",
      availableTime: user.availableTime || "",
      bio: user.bio || ""
    });
  };

  const handleSaveEditUser = async (updateUser) => {
    try {
      await updateUser(userEditData);
      setEditingUser(false);
    } catch (error) {
      console.error("Error saving user info:", error);
    }
  };

  return {
    userEditData,
    handleUserChange,
    handleEditUser,
    handleCancelEditUser,
    handleSaveEditUser,
    editingUser,
  };
};

export default useUserForm;
