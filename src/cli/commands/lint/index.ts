import { lint_executor } from "../../../components/lint";
import { Command } from "../../common/Command";

export const lint = new Command("lint", lint_executor);

lint.addFlag("--fix");
