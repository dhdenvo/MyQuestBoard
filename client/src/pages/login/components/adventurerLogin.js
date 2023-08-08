import { Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
export default function AdventurerLogin({ adventurer }) {
  console.log("adventurer", adventurer);
  return (
    <div className={`adventurer-${adventurer.name}`}>
      <Avatar
        alt={adventurer.name}
        src="https://rare-gallery.com/thumbnail/397179-wallpaper-rimuru-tempest-tensei-shitara-slime-datta-ken.jpg"
        sx={{ width: 256, height: 256 }}
      />
      <Typography variant="h3">{adventurer.name}</Typography>
    </div>
  );
}
