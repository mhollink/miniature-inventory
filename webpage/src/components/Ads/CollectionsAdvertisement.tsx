import { AdSenseComponent } from "@components/Ads/Advertisement.tsx";
import { Paper } from "@mui/material";
import Typography from "@mui/material/Typography";

export const RowAdvertisement = () => {
  return (
    <Paper
      elevation={0.5}
      sx={{
        position: "relative",
      }}
    >
      <AdSenseComponent
        client={"ca-pub-9812873127099670"}
        slot={"9045196717"}
        style={{
          zIndex: 2,
        }}
      />
      <Typography
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1,
          opacity: 0.5,
        }}
      >
        Advertisement by Google Adsense
      </Typography>
    </Paper>
  );
};
