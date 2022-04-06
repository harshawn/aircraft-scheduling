import { TOTAL_HOURS_IN_SECONDS, TURNAROUND_TIME } from "../constants/time";
import { IFlight, IRotation } from "../interfaces/IFlights";

const validateRotation = (currentRotation: IFlight, prevRotation?: IFlight) => {
  if (prevRotation) {
    if (prevRotation.destination === currentRotation.origin) {
      if (
        Math.abs(currentRotation.departuretime - prevRotation.arrivaltime) >
        TURNAROUND_TIME
      ) {
        const prevRotationAndTurnaround =
          prevRotation.arrivaltime + TURNAROUND_TIME;
        const prevRotationTillMidnight =
          TOTAL_HOURS_IN_SECONDS - prevRotationAndTurnaround;
        const currentRotationTillMidnight =
          TOTAL_HOURS_IN_SECONDS - currentRotation.departuretime;
        if (currentRotationTillMidnight < prevRotationTillMidnight) {
          return { ...currentRotation, errorMessage: undefined };
        } else {
          return {
            ...currentRotation,
            errorMessage: "aircrafts cannot operate over midnight",
          };
        }
      } else {
        return {
          ...currentRotation,
          errorMessage: "flight requires 20 mins turnaround time",
        };
      }
    } else {
      return {
        ...currentRotation,
        errorMessage: "aircrafts cannot teleport",
      };
    }
  }
  return { ...currentRotation, errorMessage: undefined };
};

export const validateRotations = (rotations: IRotation[]): IRotation[] => {
  let validatedRotations: IRotation[] = [];

  if (rotations.length > 1) {
    rotations.forEach((currentRotation, index) => {
      const prevRotation = rotations[index - 1];
      validatedRotations.push(validateRotation(currentRotation, prevRotation));
    });
  }
  return validatedRotations.length ? validatedRotations : rotations;
};
