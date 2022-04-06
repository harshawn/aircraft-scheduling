import { FC, useEffect, useState } from "react";
import { Alert, Box, Collapse, Grid, Typography } from "@mui/material";

import { IRotation } from "./interfaces/IFlights";
import { RotationList } from "./components/RotationList/RotationList";
import { AircraftTimeline } from "./components/AircraftTimeline/AircraftTimeline";
import { Schedule } from "./components/Schedule/Schedule";
import { AircraftList } from "./components/AircraftList/AircraftList";
import { FlightsList } from "./components/FlightsList/FlightsList";

import "./App.css";

export const App: FC = () => {
  const [rotations, setRotations] = useState<IRotation[]>([]);
  const [aircraftName, setAircraftName] = useState<string>("");

  const removeFlightRotation = (id: string) => {
    setRotations(rotations.filter((rotation) => rotation.id !== id));
  };

  useEffect(() => {
    // reset rotations and selected aircraft
    setRotations([]);
    setAircraftName("");
  }, []);

  return (
    <Box className="App">
      <Box sx={{ p: 2 }}>
        <Schedule />

        <Collapse in={!aircraftName} sx={{ mt: 2, mb: 2 }}>
          <Alert severity="info">
            Please select an aircraft to create a rotation for.
          </Alert>
        </Collapse>

        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <AircraftList
              rotations={rotations}
              setAircraftName={setAircraftName}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            {aircraftName && (
              <>
                <Typography variant="h4">Rotation {aircraftName}</Typography>
                <Box sx={{ pt: 1 }}>
                  <RotationList
                    rotations={rotations}
                    onChange={(updatedRotations: IRotation[]) =>
                      setRotations(updatedRotations)
                    }
                    handleRemove={(id: string) => removeFlightRotation(id)}
                  />
                  {rotations.length > 0 && (
                    <AircraftTimeline rotations={rotations} />
                  )}
                </Box>
              </>
            )}
          </Grid>

          <Grid item xs={12} md={3}>
            {aircraftName && (
              <>
                <Typography variant="h4">Flights</Typography>
                <FlightsList
                  rotations={rotations}
                  setRotations={setRotations}
                />
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
