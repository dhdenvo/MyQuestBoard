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
    axios.get("/api/adventurers").then((res) => {
      if (res?.data)
        dispatch({ appliesTo: "adventurers", data: res?.data?.data });
    });

  // Login as a given adventurer
  const loginAdventurer = (id) =>
    axios.post(`/api/login/${id}`).then(() => {
      dispatch({
        appliesTo: "adventurer",
        data: state.adventurers.find(({ _id }) => id === _id),
      });
      // Once logged in, redirect the user to the homepage
      window.location.replace("/");
    });

  // Get the url that a given quest
  const getAdventurerImageUrl = ({ _id }) =>
    `/api/image/adventurers/${_id}.png`;

  return (
    <AdventurerContext.Provider
      value={{
        adventurers: state.adventurers,
        adventurer: state.adventurer,
        retrieveAdventurers,
        loginAdventurer,
        getAdventurerImageUrl,
      }}
    >
      {props.children}
    </AdventurerContext.Provider>
  );
}
