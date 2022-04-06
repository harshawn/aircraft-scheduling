import { FC, useEffect, useState } from "react";
import { AddCircle, Flight } from "@mui/icons-material";
import {
  TextField,
  IconButton,
  Box,
  CircularProgress,
  List,
  ListItem,
  Grid,
  ListItemIcon,
  Typography,
} from "@mui/material";

import { IFlight, IRotation } from "../../interfaces/IFlights";
import { getAllFlights } from "../../services/FlightsService";

interface IFlightsList {
  rotations: IRotation[];
  setRotations: (rotations: IRotation[]) => void;
}

export const FlightsList: FC<IFlightsList> = ({ rotations, setRotations }) => {
  const [flights, setFlights] = useState<IFlight[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const searchFlights = (flight: IFlight) => {
    const flightId = flight.id.toLowerCase().includes(search.toLowerCase());
    const origin = flight.origin.toLowerCase().includes(search.toLowerCase());
    const destination = flight.destination
      .toLowerCase()
      .includes(search.toLowerCase());

    return (flightId || origin || destination) ?? false;
  };

  useEffect(() => {
    setIsLoading(true);
    if (localStorage.getItem("flights")) {
      setIsLoading(false);
      setFlights(JSON.parse(localStorage.getItem("flights") ?? ""));
    } else {
      getAllFlights().then((flights) => {
        setIsLoading(false);
        localStorage.setItem("flights", JSON.stringify(flights));
        setFlights(flights);
      });
    }
  }, []);

  return (
    <Box sx={{ pt: 2 }}>
      {isLoading && <CircularProgress size={20} />}
      {!isLoading && flights?.length > 0 && (
        <>
          <TextField
            id="outlined-basic"
            label="Search Flights"
            variant="outlined"
            sx={{ width: "100%", mb: 2 }}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Box sx={{ maxHeight: 500, overflow: "auto" }}>
            <List>
              {flights
                .filter((flight) => searchFlights(flight))
                .map((flight) => (
                  <ListItem
                    key={flight.id}
                    sx={{
                      p: 1,
                      mb: "1rem",
                      border: "1px solid #c8c8c8",
                      borderRadius: "5px",
                      display: rotations.find(({ id }) => id === flight.id)
                        ? "none"
                        : "block",
                    }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Grid container xs item spacing={2} sx={{ ml: -1 }}>
                        <Grid item xs={6}>
                          <ListItemIcon>
                            <Flight />
                            <Typography variant="subtitle1" sx={{ pl: 1 }}>
                              {flight.id}
                            </Typography>
                          </ListItemIcon>
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          sx={{ pt: 1, pb: 1, textAlign: "right" }}
                        >
                          <IconButton
                            sx={{ mr: -1 }}
                            onClick={() => {
                              setRotations([...rotations, flight]);
                            }}
                          >
                            <AddCircle />
                          </IconButton>
                        </Grid>

                        <Grid item xs={6} sx={{ mt: -1 }}>
                          <Box>
                            <Typography variant="body1">
                              {flight.origin}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body1">
                              {flight.readable_departure}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={6} sx={{ textAlign: "right", mt: -1 }}>
                          <Box>
                            <Typography variant="body1">
                              {flight.destination}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body1">
                              {flight.readable_arrival}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </ListItem>
                ))}
            </List>
          </Box>
        </>
      )}
    </Box>
  );
};
