import { useReducer } from "react";
import AdventurerContext from "./adventurerContext";
import AdventurerReducer from "./adventurerReducer";
import axios from "axios";

export default function AdventurerState(props) {
  const initialState = {
    adventurers: [],
    adventurer: null,
  };
  const [state, dispatch] = useReducer(AdventurerReducer, initialState);

  // Retrieve a list of adventurers
  const retrieveAdventurers = () =>
    axios.get("http://localhost:8080/api/adventurers").then((res) => {
      if (res?.data)
        dispatch({ appliesTo: "adventurers", data: res?.data?.data });
    });

  // Login as a given adventurer
  const loginAdventurer = (id) =>
    axios.post(`http://localhost:8080/api/login/${id}`).then(() => {
      dispatch({
        appliesTo: "adventurer",
        data: state.adventurers.find(({ _id }) => id === _id),
      });
    });

  return (
    <AdventurerContext.Provider
      value={{
        adventurers: state.adventurers,
        adventurer: state.adventurer,
        retrieveAdventurers,
        loginAdventurer,
      }}
    >
      {props.children}
    </AdventurerContext.Provider>
  );
}
