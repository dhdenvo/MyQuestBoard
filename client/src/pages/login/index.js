import { useContext, useEffect } from "react";
import AdventurerGrid from "./components/adventurerGrid";
import AdventurerContext from "../../context/adventurer/adventurerContext";
import { Typography } from "@mui/material";

export default function LoginPage() {
  const adventurerContext = useContext(AdventurerContext);
  const { adventurers, retrieveAdventurers } = adventurerContext;

  useEffect(() => {
    retrieveAdventurers();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="adventurersPage">
      <Typography variant="h1"> Adventurers </Typography>
      <AdventurerGrid adventurers={adventurers} className="adventurers" />
    </div>
  );
}
