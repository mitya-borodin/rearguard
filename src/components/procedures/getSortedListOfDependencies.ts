import { getMapOfDependencies } from "./getMapOfDependencies";

const getSortedListOfDependenciesBase = async (
  CWD: string,
  monoDependencyDirs: string[],
  target = "",
  searchInMonoDirectory = false,
): Promise<string[]> => {
  const mapOfDependencies = await getMapOfDependencies(
    CWD,
    monoDependencyDirs,
    new Map(),
    target,
    searchInMonoDirectory,
  );

  const listOfDependencies: Array<[string, number]> = [];

  for (const [key, value] of mapOfDependencies.entries()) {
    listOfDependencies.push([key, value]);
  }

  return listOfDependencies.sort((a, b) => (a[1] > b[1] ? 1 : -1)).map((item) => item[0]);
};

export const getSortedListOfDependencies = async (CWD: string): Promise<string[]> => {
  return await getSortedListOfDependenciesBase(CWD, []);
};

export const getSortedListOfMonoComponents = async (
  CWD: string,
  components: string[],
): Promise<string[]> => {
  return await getSortedListOfDependenciesBase(CWD, components, "", true);
};
