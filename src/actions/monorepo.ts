import { readdirSync } from "fs";
import { resolve } from "path";
import { build } from "../components/mono_repository/build";
import { clear } from "../components/mono_repository/clear";
import { init } from "../components/mono_repository/init";
import { install } from "../components/mono_repository/install";
import { link } from "../components/mono_repository/link";
import { publish } from "../components/mono_repository/publish";
import { test } from "../components/mono_repository/test";
import { get_list_of_ordered_modules } from "../components/project_deps/get_list_of_ordered_modules";
import { envConfig } from "../config/env";
import { monorepoConfig } from "../config/monorepo";
import { RearguardConfig } from "../config/rearguard/RearguardConfig";

// tslint:disable:variable-name

async function monorepo() {
  if (envConfig.is_mono_init) {
    await init();
  }

  const root: string = resolve(process.cwd(), monorepoConfig.modules);
  const dirs = readdirSync(root).filter((value: string) => value.indexOf(".") === -1);
  const module_names: string[] = [];
  const module_map: Map<string, string> = new Map();

  for (const module_dir of dirs) {
    const module_path = resolve(root, module_dir);
    const { pkg } = new RearguardConfig(envConfig, resolve(module_path, "package.json"));

    module_map.set(pkg.name, module_path);
    module_names.push(pkg.name);
  }

  const oredered_modules: string[] = await get_list_of_ordered_modules(root, module_names, module_map);
  const ordered_paths: string[] = oredered_modules.map((N) => resolve(root, module_map.get(N) || ""));

  for (const module_path of ordered_paths) {
    if (!envConfig.is_mono_bootstrap && envConfig.is_mono_clear) {
      await clear(module_path);
    }

    if (!envConfig.is_mono_bootstrap && envConfig.is_mono_install) {
      await install(module_path);
    }

    if (!envConfig.is_mono_bootstrap && envConfig.is_mono_build) {
      await build(module_path);
    }

    if (!envConfig.is_mono_bootstrap && envConfig.is_mono_link) {
      await link(module_path);
    }

    if (envConfig.is_mono_bootstrap) {
      await clear(module_path);
      await install(module_path);
      await build(module_path);
      await link(module_path);
    }

    if (envConfig.is_mono_test) {
      await test(module_path);
    }

    if (envConfig.is_mono_publish) {
      await publish(module_path);
    }
  }

  console.log("monorepo");
}

monorepo();

// tslint:enable:variable-name
