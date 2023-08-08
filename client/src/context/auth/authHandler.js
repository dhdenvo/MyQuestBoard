import { useEffect, useState } from "react";
import axios from "axios";

export default function AuthHandler(props) {
  const [isAuthed, setIsAuthed] = useState(false);

  const isOnLoginPage = () => window.location.pathname === "/adventurers";

  const checkIsAuthed = async () => {
    const res = await axios.get("/api/authed");
    const isAuthenticated = res?.data?.data[0];
    setIsAuthed(isAuthenticated);
    if (!isAuthenticated && !isOnLoginPage())
      window.location.replace("/adventurers");
  };

  useEffect(() => {
    checkIsAuthed();
    // eslint-disable-next-line
  }, []);

  return isAuthed || isOnLoginPage() ? props.children : null;
}
