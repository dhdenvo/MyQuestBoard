import { useContext, useEffect } from "react";
import AdventurerGrid from "./components/adventurerGrid";
import AdventurerContext from "../../context/adventurer/adventurerContext";

export default function LoginPage() {
  const adventurerContext = useContext(AdventurerContext);
  const { adventurers, retrieveAdventurers } = adventurerContext;

  useEffect(() => {
    retrieveAdventurers();
    // eslint-disable-next-line
  }, []);

  return <AdventurerGrid adventurers={adventurers} />;
}
