import { Template } from "../Template";
import { PUBLIC_DIR_NAME } from "../../const";

export const indexHtmlTemplate = new Template(
  "index.html",
  `${PUBLIC_DIR_NAME}/index.html`,
  __dirname,
);
