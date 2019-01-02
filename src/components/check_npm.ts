import { ChildProcess, exec, ExecException } from "child_process";
import * as ora from "ora";

export async function check_npm(): Promise<boolean> {
  return await new Promise<boolean>((resolve) => {
    let timeout: NodeJS.Timeout;

    const spinner = ora("Checking connection with npm registry").start();

    const childProcess: ChildProcess = exec(`npm ping`, { encoding: "utf8" }, (error: ExecException | null) => {
      clearTimeout(timeout);

      if (!error) {
        spinner.succeed("Сonnection established with npm registry");
        resolve(true);
      } else {
        spinner.fail("Сonnection failure with npm registry");
        resolve(false);
      }

      console.log("");
    });

    timeout = setTimeout(() => {
      spinner.fail("Сonnection failure with npm registry");
      console.log("");
      childProcess.kill();
      resolve(false);
    }, 10000);
  });
}
