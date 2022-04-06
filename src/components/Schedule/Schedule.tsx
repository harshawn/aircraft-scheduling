import { FC } from "react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";

export const Schedule: FC = () => {
  const dateOrdinal = (date: number): string => {
    let ordinal = "";
    if (date > 3 && date < 21) {
      ordinal = "th";
    } else {
      switch (date % 10) {
        case 1:
          ordinal = "st";
          break;
        case 2:
          ordinal = "nd";
          break;
        case 3:
          ordinal = "rd";
          break;
        default:
          ordinal = "th";
      }
    }
    return `${date}${ordinal}`;
  };

  const monthNames: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentDate = new Date();
  const tommorow = new Date(currentDate.setDate(currentDate.getDate() + 1));

  return (
    <Grid item xs={12}>
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <ChevronLeft fontSize="medium" sx={{ pr: 2 }} />
        <Typography variant="h6">
          {dateOrdinal(tommorow.getDate())} {monthNames[tommorow.getMonth()]}{" "}
          {tommorow.getFullYear()}
        </Typography>
        <ChevronRight fontSize="medium" sx={{ pl: 2 }} />
      </Box>
    </Grid>
  );
};
