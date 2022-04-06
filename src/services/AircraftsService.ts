import { IAircrafts } from "../interfaces/IAircrafts";

export async function getAircrafts(): Promise<IAircrafts> {
  const response = await fetch(
    "https://infinite-dawn-93085.herokuapp.com/aircrafts"
  );
  return await response.json();
}
