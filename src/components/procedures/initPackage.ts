import execa from "execa";

export const initPackage = async (CWD: string): Promise<void> => {
  const execaOptions: execa.Options = {
    stdout: "inherit",
    stderr: "inherit",
    cwd: CWD,
  };

  try {
    await execa("npm", ["init", "-y"], execaOptions);
  } catch (error) {
    console.error(error);
  }
  console.log("");
};
