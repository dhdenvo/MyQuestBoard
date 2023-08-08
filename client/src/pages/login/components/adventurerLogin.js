import { Card, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useContext } from "react";
import AdventurerContext from "../../../context/adventurer/adventurerContext";

export default function AdventurerLogin({ adventurer }) {
  const adventurerContext = useContext(AdventurerContext);
  const { loginAdventurer } = adventurerContext;

  return (
    <div className={`adventurer-${adventurer.name}`}>
      <Card
        variant="outlined"
        onClick={() => loginAdventurer(adventurer._id)}
        sx={{ minWidth: 256 }}
      >
        <Avatar
          alt={adventurer.name}
          src="https://rare-gallery.com/thumbnail/397179-wallpaper-rimuru-tempest-tensei-shitara-slime-datta-ken.jpg"
          sx={{ width: 256, height: 256 }}
        />
        <Typography variant="h3">{adventurer.name}</Typography>
      </Card>
    </div>
  );
}
