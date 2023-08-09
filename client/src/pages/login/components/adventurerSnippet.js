import { Card, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useContext } from "react";
import AdventurerContext from "../../../context/adventurer/adventurerContext";

const getColour = () => "#" + Math.floor(Math.random() * 16777215).toString(16);

export default function AdventurerSnippet({ adventurer }) {
  const adventurerContext = useContext(AdventurerContext);
  const { loginAdventurer } = adventurerContext;

  const avatar = adventurer?.avatarUrl ? (
    <Avatar
      alt={adventurer.name}
      src={adventurer.avatarUrl}
      sx={{ width: 256, height: 256 }}
    />
  ) : (
    <Avatar
      alt={adventurer.name}
      sx={{ width: 256, height: 256, fontSize: 150, bgcolor: getColour() }}
    >
      {adventurer.name[0].toUpperCase()}
    </Avatar>
  );

  return (
    <div className={`adventurer-${adventurer.name}`}>
      <Card
        variant="outlined"
        onClick={() => loginAdventurer(adventurer._id)}
        sx={{ minWidth: 256, p: 1, m: 1, cursor: "pointer" }}
      >
        {avatar}
        <Typography variant="h3">{adventurer.name}</Typography>
      </Card>
    </div>
  );
}
