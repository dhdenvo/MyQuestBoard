import { useReducer, useState } from "react";
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
    axios.get("http://localhost:8080/api/quests").then((res) => {
      if (res?.data) dispatch({ appliesTo: "quests", data: res?.data?.data });
    });

  // Create a completion for a given quest
  const completeQuest = (id) =>
    axios
      .post(`http://localhost:8080/api/quest/${id}/complete`)
      .then(retrieveQuests);

  // Set the current viewed quest
  const setQuest = (quest) => dispatch({ appliesTo: "quest", data: quest });

  return (
    <QuestContext.Provider
      value={{
        quests: state.quests,
        quest: state.quest,
        retrieveQuests,
        completeQuest,
        setQuest,
      }}
    >
      {props.children}
    </QuestContext.Provider>
  );
}
