import { Template } from "../Template";

export const vsCodeSettingsTemplate = new Template(
  "settings.json",
  ".vscode/settings.json",
  __dirname,
);

export const vsCodeExtensionsTemplate = new Template(
  "extensions.json",
  ".vscode/extensions.json",
  __dirname,
);
