import { useContext, useEffect } from "react";
import QuestContext from "../../context/quest/questContext";
import QuestGrid from "./components/questGrid";

export default function QuestPage() {
  const questContext = useContext(QuestContext);
  const { quests, retrieveQuests } = questContext;

  useEffect(() => {
    retrieveQuests();
  }, []);

  return <QuestGrid quests={quests} />;
}
