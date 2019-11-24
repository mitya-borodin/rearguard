import { RearguardConfig } from "../../configs/RearguardConfig";

// TODO Add logging;
export const setScripts = async (CWD: string): Promise<void> => {
  // * Create rearguard configs;
  const rearguardConfig = new RearguardConfig(CWD);

  // * Prepare data for creating files;
  const isBrowser = rearguardConfig.isBrowser();
  const isDll = rearguardConfig.isDll();
  const isIsomorphic = rearguardConfig.isIsomorphic();
  const startScripts: { [key: string]: string } = {};

  if (!(isBrowser && isDll)) {
    startScripts.start = "rearguard start";
  }

  if (isIsomorphic) {
    startScripts["start:ts_node_dev"] = "rearguard start --ts_node_dev";
  }

  // ! Set scripts;
  await rearguardConfig.setScripts({
    ...startScripts,
    build: "rearguard build",
    test: "rearguard test",
    sync: "rearguard sync",
    check_deps_on_npm: "rearguard check_deps_on_npm",
    lint: `rearguard lint`,
    "lint-fix": `rearguard lint --fix`,
    typecheck: "tsc --noEmit",
    "validate-prettiness": "prettier -c '**/*.{ts,tsx,json,md}'",
    validate: "npm run lint && npm run typecheck && npm run validate-prettiness",
    "make-prettier": "prettier --write '**/*.{ts,tsx,json,md}'",
    postinstall: "npx typesync",
  });
};
