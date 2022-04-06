import { IFlight, IFlights } from "../interfaces/IFlights";

async function getFlights(
  offset: number = 0,
  limit: number = 25
): Promise<IFlights> {
  const response = await fetch(
    `https://infinite-dawn-93085.herokuapp.com/flights?limit=${limit}&offset=${offset}`
  );
  return await response.json();
}

export async function getAllFlights(offset: number = 0): Promise<IFlight[]> {
  const results = await getFlights(offset);
  if (results?.data?.length > 0) {
    return results.data.concat(await getAllFlights(offset + 25));
  } else {
    return [];
  }
}
