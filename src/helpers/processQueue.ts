import { EventEmitter } from "@borodindmitriy/isomorphic";
import { isArray, isString } from "@borodindmitriy/utils";
import chalk from "chalk";
import { watch } from "chokidar";
import * as fs from "fs";
import * as os from "os";
import * as delay from "delay";
import * as path from "path";
import { mkdir } from "./mkdir";
import { random } from "lodash";

const chokidarOptions = {
  followSymlinks: false,
  ignoreInitial: true,
};

enum queueEvent {
  QUEUE_UPDATED = "QUEUE_UPDATED",
}

const queueCopy: Set<string> = new Set();

class ProcessQueue {
  private readonly tmpDirName: string;
  private readonly fileName: string;
  private readonly pathToTmpDir: string;
  private readonly pathToProcessQueueFile: string;
  private watcherIsActive: boolean;
  private watcher: fs.FSWatcher | undefined;
  private readonly pubSub: EventEmitter;

  constructor() {
    this.tmpDirName = "rearguard";
    this.fileName = ".rearguardProcessQueue";
    this.pathToTmpDir = path.resolve(os.tmpdir(), this.tmpDirName);
    this.pathToProcessQueueFile = path.resolve(this.pathToTmpDir, this.fileName);
    this.pubSub = new EventEmitter();
    this.watcher = undefined;
    this.watcherIsActive = false;
    this.shutdownWatcher = this.shutdownWatcher.bind(this);
    this.activateWatcher = this.activateWatcher.bind(this);

    mkdir(this.pathToTmpDir);

    if (!fs.existsSync(this.pathToProcessQueueFile)) {
      /* console.log([], JSON.stringify([]));
      console.log(""); */

      fs.writeFileSync(this.pathToProcessQueueFile, JSON.stringify([]));
    }
  }

  async getInQueue(name: string, bypassTheQueue = false): Promise<void> {
    await delay(random(500, 1000));

    if (bypassTheQueue) {
      return;
    }

    const queue = this.getQueue(this.pathToProcessQueueFile);

    queue.push(name);
    queueCopy.add(name);

    console.log(chalk.bold.yellow(`[ GET IN THE GLOBAL QUEUE OF PROCESSES ]`));
    console.log(chalk.bold.yellow(`[ TIME ][ ${new Date().getTime()} ]`));
    console.log(chalk.bold.yellow(`[ ${this.pathToProcessQueueFile} ]`));
    console.log(chalk.bold.green(`[ CURRENT QUEUE ][ ${queue.join(", ")} ]`));
    console.log("");

    fs.writeFileSync(
      this.pathToProcessQueueFile,
      new Uint8Array(Buffer.from(JSON.stringify(queue))),
    );

    if (queue.length === 1) {
      return;
    }

    this.activateWatcher();

    return new Promise((resolve, reject): void => {
      const queueHandler = (queue: string[]): void => {
        try {
          if (isArray(queue)) {
            if (name === queue[0]) {
              this.pubSub.off(queueEvent.QUEUE_UPDATED, queueHandler);

              resolve();
            }
          } else {
            throw new Error("Queue should be a string[]");
          }
        } catch (error) {
          console.error(error);

          this.pubSub.off(queueEvent.QUEUE_UPDATED, queueHandler);

          reject(error);
        }
      };

      this.pubSub.on(queueEvent.QUEUE_UPDATED, queueHandler);
    });
  }

  getOutQueue(name: string, bypassTheQueue = false): void {
    if (bypassTheQueue) {
      return;
    }

    let queue = this.getQueue(this.pathToProcessQueueFile);

    queue = queue.filter((item) => item !== name);
    queueCopy.delete(name);

    console.log(chalk.bold.yellow(`[ GET OUT THE GLOBAL QUEUE OF PROCESSES ]`));
    console.log(chalk.bold.yellow(`[ ${this.pathToProcessQueueFile} ]`));
    console.log(chalk.bold.magenta(`[ CURRENT QUEUE ][ ${queue.join(", ")} ]`));
    console.log("");

    fs.writeFileSync(
      this.pathToProcessQueueFile,
      new Uint8Array(Buffer.from(JSON.stringify(queue))),
    );

    this.shutdownWatcher();
  }

  dropQueue(): void {
    fs.writeFileSync(this.pathToProcessQueueFile, JSON.stringify([]));
  }

  private activateWatcher(): void {
    if (!this.watcherIsActive) {
      const watcher = watch(this.pathToProcessQueueFile, chokidarOptions);

      const errorHandler = (error: Error): void => {
        this.shutdownWatcher();

        console.error(error);
      };

      watcher.on("error", errorHandler);

      watcher.on("ready", () => {
        watcher.off("error", errorHandler);
        watcher.on("error", (error) => console.error(error));

        this.watcherIsActive = true;
      });

      watcher.on("all", (type: string, pathToProcessQueueFile: string): void => {
        this.pubSub.emit(queueEvent.QUEUE_UPDATED, this.getQueue(pathToProcessQueueFile));
      });

      process.on("exit", this.shutdownWatcher);
      process.on("SIGINT", this.shutdownWatcher);
      process.on("rejectionHandled", this.shutdownWatcher);
      process.on("uncaughtException", this.shutdownWatcher);
      process.on("unhandledRejection", this.shutdownWatcher);

      this.watcher = watcher;
    }
  }

  private shutdownWatcher(): void {
    console.log(chalk.bold.yellow(`[ SHUTDOWN GLOBAL QUEUE OBSERVATION ]`));
    console.log("");

    if (this.watcher) {
      process.off("exit", this.shutdownWatcher);
      process.off("SIGINT", this.shutdownWatcher);
      process.off("rejectionHandled", this.shutdownWatcher);
      process.off("uncaughtException", this.shutdownWatcher);
      process.off("unhandledRejection", this.shutdownWatcher);

      this.watcher.close();
      this.watcherIsActive = false;
      this.watcher = undefined;
    }

    if (queueCopy.size > 0) {
      const queue = this.getQueue(this.pathToProcessQueueFile).filter(
        (item) => !queueCopy.has(item),
      );

      fs.writeFileSync(
        this.pathToProcessQueueFile,
        new Uint8Array(Buffer.from(JSON.stringify(queue))),
      );

      queueCopy.clear();
    }
  }

  private getQueue(pathToProcessQueueFile: string): string[] {
    if (fs.existsSync(pathToProcessQueueFile)) {
      const JSONString = fs.readFileSync(pathToProcessQueueFile, { encoding: "utf-8" });

      try {
        const queue = JSON.parse(JSONString);
        const result: string[] = [];

        if (isArray(queue)) {
          for (const item of queue) {
            if (isString(item)) {
              result.push(item);
            } else {
              throw new Error("Every item of queue should be a string");
            }
          }
        } else {
          throw new Error("Queue should be a string[]");
        }

        return result;
      } catch (error) {
        console.error(error);

        console.log(chalk.bold.red("[ JSONString ]"));
        console.log(chalk.bold.red(JSONString));
        console.log("");

        fs.writeFileSync(this.pathToProcessQueueFile, JSON.stringify([]));
      }
    }

    return [];
  }
}

export const processQueue = new ProcessQueue();
