import { getMapOfDependencies } from "./getMapOfDependencies";

export const getSortedListOfDependencies = async (CWD: string): Promise<string[]> => {
  const mapOfDependencies = await getMapOfDependencies(CWD);
  const listOfDependencies: Array<[string, number]> = [];

  for (const [key, value] of mapOfDependencies.entries()) {
    listOfDependencies.push([key, value]);
  }

  return listOfDependencies.sort((a, b) => (a[1] > b[1] ? 1 : -1)).map((item) => item[0]);
};
