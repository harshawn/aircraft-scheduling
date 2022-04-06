import { IPagination } from "./IPagination";

interface IAircraft {
  ident: string;
  type: string;
  economySeats: number;
  base: string;
}

export interface IAircrafts {
  pagination: IPagination;
  data: IAircraft[];
}
