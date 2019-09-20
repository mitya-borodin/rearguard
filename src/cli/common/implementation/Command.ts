import { isString } from "@borodindmitriy/utils";
import { Executor } from "../interfaces/Executor";
import { ICommand } from "../interfaces/ICommand";
import { IFlags } from "../interfaces/IFlags";

export class Command implements ICommand {
  public name: string;
  private flags: Set<string>;
  private executor: Executor;
  private leafs: Set<ICommand>;

  constructor(
    name: string,
    executor: Executor = async (flags?: { [key: string]: boolean }) =>
      console.log("Executor", flags),
  ) {
    this.name = name;
    this.flags = new Set();
    this.executor = executor;
    this.leafs = new Set();

    this.addCommand = this.addCommand.bind(this);
    this.addFlag = this.addFlag.bind(this);
    this.getExecutor = this.getExecutor.bind(this);
    this.getFlags = this.getFlags.bind(this);
    this.getHelp = this.getHelp.bind(this);
  }

  public addCommand(leaf: ICommand): void {
    this.leafs.add(leaf);
  }

  public addFlag(flag: string): void {
    this.flags.add(flag);
  }

  public getExecutor(commands: string[]): Executor | void {
    const [command_name, next_command_name, next_commands] = this.preparedCommands(commands);

    if (command_name === this.name && next_command_name !== "help") {
      if (this.leafs.size > 0) {
        for (const leaf of this.leafs) {
          if (leaf.name === next_command_name) {
            return leaf.getExecutor(next_commands);
          }
        }
      } else {
        return this.executor;
      }
    }
  }

  public getFlags(commands: string[], prev_flag_values: IFlags = {}): IFlags {
    const [command_name, next_command_name, next_commands] = this.preparedCommands(commands);

    const cur_flag_values: IFlags = { ...prev_flag_values };

    for (const flag of this.flags) {
      const flag_name: string = flag.replace("--", "");

      cur_flag_values[flag_name] = commands.includes(flag);
    }

    if (command_name === this.name) {
      if (this.leafs.size > 0) {
        for (const leaf of this.leafs) {
          if (leaf.name === next_command_name) {
            return leaf.getFlags(next_commands, cur_flag_values);
          }
        }
      } else {
        return cur_flag_values;
      }
    }

    return cur_flag_values;
  }

  public getHelp(
    commands: string[],
    prev_command_path?: string,
    prev_flags: Set<string> = new Set(),
    skip_command_check = false,
  ): string[] {
    const [command_name, next_command_name, next_commands] = this.preparedCommands(commands);

    let command_path: string = this.name;
    let flags: Set<string> = new Set(prev_flags);

    if (isString(prev_command_path)) {
      command_path = `${prev_command_path} ${this.name}`;
    }

    if (this.flags.size > 0) {
      flags = new Set([...flags, ...this.flags]);
    }

    // * Trying to verify a command.
    if (!skip_command_check) {
      if (command_name === this.name && next_command_name !== "help") {
        if (this.leafs.size > 0) {
          for (const leaf of this.leafs) {
            if (leaf.name === next_command_name && next_command_name !== "help") {
              return leaf.getHelp(next_commands, command_path, flags, false);
            }
          }
        } else {
          return [];
        }
      }
    }

    // * Compilation of commands that can be performed.
    let help: string[] = [];

    if (this.leafs.size > 0) {
      for (const leaf of this.leafs) {
        const result_helps: string[] = leaf.getHelp(next_commands, command_path, flags, true);

        help = [...help, ...result_helps];
      }
    } else {
      if (flags.size > 0) {
        help.push(`${command_path} [ ${Array.from(flags).join(" | ")} ]`);
      } else {
        help.push(command_path);
      }
    }

    return help;
  }

  protected preparedCommands(commands: string[]): [string, string, string[]] {
    const [command_name, next_command_name, ...other_commands] = commands;
    const next_commands = [next_command_name, ...other_commands];

    return [command_name, next_command_name, next_commands];
  }
}
