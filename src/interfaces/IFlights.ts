import { IPagination } from "./IPagination";

export interface IFlight {
  id: string;
  departuretime: number;
  arrivaltime: number;
  readable_departure: string;
  readable_arrival: string;
  origin: string;
  destination: string;
}

export interface IFlights {
  pagination: IPagination;
  data: IFlight[];
}

export interface IRotation extends IFlight {
  errorMessage?: string | undefined;
}
