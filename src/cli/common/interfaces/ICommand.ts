export interface ICommand {
  name: string;

  addCommand(leaf: ICommand): void;
  addFlag(flag: string): void;
  getExecutor(commands: string[]): void;
  getFlags(
    commands: string[],
    prev_flag_values: { [name: string]: boolean },
  ): { [name: string]: boolean };
  getHelp(
    commands: string[],
    prev_command?: string,
    prev_flags?: Set<string>,
    skip_check?: boolean,
  ): string[];
}
