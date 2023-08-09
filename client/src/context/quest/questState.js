import { useReducer } from "react";
import QuestContext from "./questContext";
import QuestReducer from "./questReducer";
import axios from "axios";

export default function QuestState(props) {
  const initialState = {
    quests: [],
    quest: null,
  };
  const [state, dispatch] = useReducer(QuestReducer, initialState);

  // Retrieve a list of quests
  const retrieveQuests = () =>
    axios.get("/api/quests").then((res) => {
      if (res?.data) dispatch({ appliesTo: "quests", data: res?.data?.data });
    });

  // Create a completion for a given quest
  const completeQuest = (id) =>
    axios.post(`/api/quest/${id}/complete`).then(retrieveQuests);

  // Set the current viewed quest
  const setQuest = (quest) => dispatch({ appliesTo: "quest", data: quest });

  // Get the url that a given quest
  const getQuestImageUrl = ({ _id }) => `/api/image/quests/${_id}.png`;

  return (
    <QuestContext.Provider
      value={{
        quests: state.quests,
        quest: state.quest,
        retrieveQuests,
        completeQuest,
        setQuest,
        getQuestImageUrl,
      }}
    >
      {props.children}
    </QuestContext.Provider>
  );
}
