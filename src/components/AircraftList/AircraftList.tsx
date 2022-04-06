import { FC, useEffect, useState } from "react";
import { FlightTakeoff } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import { TURNAROUND_TIME, TOTAL_HOURS_IN_SECONDS } from "../../constants/time";
import { IAircrafts } from "../../interfaces/IAircrafts";
import { IRotation } from "../../interfaces/IFlights";
import { getAircrafts } from "../../services/AircraftsService";
import { validateRotations } from "../../utils/validateRotations";

interface IAircraftList {
  rotations: IRotation[];
  setAircraftName: (ident: string) => void;
}

export const AircraftList: FC<IAircraftList> = ({
  rotations,
  setAircraftName,
}) => {
  const [aircrafts, setAircrafts] = useState<IAircrafts>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const totalRotationsTime = validateRotations(rotations)
    .filter((rotation) => rotation.errorMessage === undefined)
    .reduce((total, rotation) => {
      return (total +=
        rotation.arrivaltime - rotation.departuretime + TURNAROUND_TIME);
    }, 0);

  const utilisation = totalRotationsTime
    ? ((totalRotationsTime / TOTAL_HOURS_IN_SECONDS) * 100).toFixed(2)
    : 0;

  useEffect(() => {
    setIsLoading(true);
    getAircrafts().then((response) => {
      setIsLoading(false);
      setAircrafts(response);
    });
  }, []);

  return (
    <Box>
      <Typography variant="h4">Aircrafts</Typography>
      {isLoading && <CircularProgress size={20} />}
      {!isLoading && aircrafts && aircrafts.data?.length > 0 && (
        <List>
          {aircrafts.data.map(({ ident }) => (
            <ListItem
              key={ident}
              disablePadding
              onClick={() => setAircraftName(ident)}
            >
              <ListItemButton>
                <ListItemIcon>
                  <FlightTakeoff fontSize="large" />
                </ListItemIcon>
                <ListItemText
                  primary={ident}
                  secondary={`Utilisation: ${utilisation}%`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};
