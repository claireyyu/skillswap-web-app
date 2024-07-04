import { useState, useEffect } from "react";
import { useAuthToken } from "../../AuthTokenContext";

export default function useUser() {
  const [user, setUser] = useState({
    email: "",
    name: "",
    bio: "",
    availableTime: "",
    skills: [],
    learnerMeetings: [],
    tutorMeetings: [],
  });
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorUser, setErrorUser] = useState(null);
  const { accessToken, loadingToken } = useAuthToken();

  const fetchUser = async () => {
    if (!accessToken) return;
    try {
      setLoadingUser(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const profile = await response.json();
      if (profile) {
        setUser(profile);
      } else {
        throw new Error("Profile data is missing");
      }
    } catch (error) {
      setErrorUser(error.message);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    if (!loadingToken) {
      fetchUser();
    }
  }, [accessToken, loadingToken]);

  const updateUser = async (data) => {
    if (!accessToken) throw new Error("Access token not available");
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update user profile");
      const updatedProfile = await response.json();
      await fetchUser();
      return updatedProfile;
    } catch (error) {
      setErrorUser(error.message);
    }
  };

  return { user, setUser, loadingUser, errorUser, updateUser };
}