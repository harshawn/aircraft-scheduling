import { FC, Fragment, useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";

import {
  TOTAL_HOURS_IN_SECONDS,
  TURNAROUND_TIME_PERCENTAGE,
} from "../../constants/time";
import { IRotation } from "../../interfaces/IFlights";
import { validateRotations } from "../../utils/validateRotations";

interface IAircraftTimeline {
  rotations: IRotation[];
}

interface IFlightTimes {
  name: string;
  blockStart: number; // percentage
  blockEnd: number; // percentage
  blockWidth: number; // blockEnd - blockStart
  error: string | undefined;
}

export const AircraftTimeline: FC<IAircraftTimeline> = ({ rotations }) => {
  const [flightTimes, setFlightTimes] = useState<IFlightTimes[]>([]);

  const getFlightTimeBlocks = (latestRotations: IRotation[]) => {
    return latestRotations.reduce(
      (flightTimeBlocks: IFlightTimes[], rotation) => {
        const blockStart = parseFloat(
          ((rotation.departuretime / TOTAL_HOURS_IN_SECONDS) * 100).toFixed(3)
        );

        const blockEnd = parseFloat(
          ((rotation.arrivaltime / TOTAL_HOURS_IN_SECONDS) * 100).toFixed(3)
        );

        const flightTimeBlock: IFlightTimes = {
          name: rotation.id,
          blockStart,
          blockEnd,
          blockWidth: blockEnd - blockStart,
          error: rotation.errorMessage,
        };

        flightTimeBlocks.push(flightTimeBlock);
        return flightTimeBlocks;
      },
      []
    );
  };

  useEffect(() => {
    setFlightTimes(getFlightTimeBlocks(validateRotations(rotations)));
  }, [rotations]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid item container xs sx={{ position: "relative" }}>
        <Typography sx={{ left: 0, position: "absolute" }}>00:00</Typography>
        <Typography sx={{ margin: "auto" }}>12:00</Typography>
        <Typography sx={{ position: "absolute", right: 0 }}>23:59</Typography>
        <Grid
          item
          container
          xs={12}
          sx={{
            backgroundColor: "#e6e6e6",
            height: "50px",
            position: "relative",
          }}
        >
          {flightTimes.length > 0 &&
            flightTimes
              .filter((flightTime) => flightTime.error === undefined)
              .map((flightTime, index: number) => (
                <Fragment key={`${flightTime.name}-${index}`}>
                  <Box
                    sx={{
                      width: `${flightTime.blockWidth}%`,
                      backgroundColor: "#7bc94e",
                      marginLeft: `${flightTime.blockStart}%`,
                      position: "absolute",
                      height: "50px",
                    }}
                  />
                  <Box
                    sx={{
                      width: `${TURNAROUND_TIME_PERCENTAGE}%`,
                      backgroundColor: "#9360b8",
                      marginLeft: `${flightTime.blockEnd}%`,
                      position: "absolute",
                      height: "50px",
                    }}
                  />
                </Fragment>
              ))}
        </Grid>
      </Grid>
    </Box>
  );
};
