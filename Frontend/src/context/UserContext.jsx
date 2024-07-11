import { createContext, useContext } from "react";
// import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  // const navigate = useNavigate();

  const getUserData = () => {
    const data = JSON.parse(localStorage.getItem("data"));
    return data || {};
  };

  const checkRoleAndNavigate = (allowedRoles, navigate) => {
    const data = getUserData();

    if (!allowedRoles.includes(data.role)) {
      // console.error("Unauthorized access!");
      navigate("/404");
      return false;
    }
  };

  return (
    <UserContext.Provider value={{ getUserData, checkRoleAndNavigate }}>
      {children}
    </UserContext.Provider>
  );
};
