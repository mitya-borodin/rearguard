"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = require("chalk");
const child_process_1 = require("child_process");
const chokidar = require("chokidar");
const fs = require("fs");
const DtsCreator = require("typed-css-modules");
const target_config_1 = require("../config/target.config");
function typedCSS(forceBuild = false) {
    if (forceBuild) {
        child_process_1.execSync(`node ${target_config_1.nodeModulePath}/typed-css-modules/lib/cli.js ${target_config_1.context} -c`, { encoding: "utf8" });
    }
    else {
        const creator = new DtsCreator({
            camelCase: true,
            rootDir: process.cwd(),
            searchDir: target_config_1.context,
        });
        const watcher = chokidar.watch([`${target_config_1.context}/**/*.css`], { ignoreInitial: true });
        watcher.on("change", (filePath) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const content = yield creator.create(filePath, fs.readFileSync(filePath, { encoding: "utf-8" }));
            yield content.writeFile();
            console.log(chalk_1.default.bold.magenta(`[REARGUARD][TYPED_CSS][FROM: ${filePath}]`));
        }));
        console.log(chalk_1.default.bold.magenta(`[REARGUARD][TYPED_CSS][WATCH_CSS]`));
    }
}
exports.typedCSS = typedCSS;
//# sourceMappingURL=typedCSS.js.map