import { RearguardConfig } from "../../configs/RearguardConfig";

// TODO Add logging;
export const setScripts = async (CWD: string): Promise<void> => {
  // * Create rearguard configs;
  const rearguardConfig = new RearguardConfig(CWD);

  // * Prepare data for creating files;
  const isNodeLib = rearguardConfig.isNodeLib();

  // ! Set scripts;
  await rearguardConfig.setScripts({
    ...(!isNodeLib ? { start: "npx rearguard start" } : {}),
    build: "npx rearguard build",
    test: "npx rearguard test",
    sync: "npx rearguard sync",
    check_deps_on_npm: "npx rearguard check_deps_on_npm",
    lint: `npx rearguard lint`,
    "lint-fix": `npx rearguard lint --fix`,
    typecheck: "tsc --noEmit",
    "validate-prettiness": "prettier -c '**/*.{ts,tsx,json,md}'",
    validate: "npm run lint && npm run typecheck && npm run validate-prettiness",
    "make-prettier": "prettier --write '**/*.{ts,tsx,json,md}'",
  });
};
