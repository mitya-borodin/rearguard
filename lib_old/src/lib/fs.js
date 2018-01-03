"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = require("fs");
const glob = require("glob");
const mkdirp = require("mkdirp");
const path = require("path");
const rimraf = require("rimraf");
exports.readFile = (file) => new Promise((resolve, reject) => {
    fs.readFile(file, "utf8", (err, data) => (err ? reject(err) : resolve(data)));
});
exports.writeFile = (file, contents) => new Promise((resolve, reject) => {
    fs.writeFile(file, contents, "utf8", (err) => (err ? reject(err) : resolve()));
});
exports.renameFile = (source, target) => new Promise((resolve, reject) => {
    fs.rename(source, target, (err) => (err ? reject(err) : resolve()));
});
exports.copyFile = (source, target) => new Promise((resolve, reject) => {
    let cbCalled = false;
    function done(err) {
        if (!cbCalled) {
            cbCalled = true;
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        }
    }
    const rd = fs.createReadStream(source);
    rd.on("error", (err) => done(err));
    const wr = fs.createWriteStream(target);
    wr.on("error", (err) => done(err));
    wr.on("close", (err) => done(err));
    rd.pipe(wr);
});
exports.readDir = (pattern, options) => new Promise((resolve, reject) => glob(pattern, options, (err, result) => (err ? reject(err) : resolve(result))));
exports.makeDir = (name) => new Promise((resolve, reject) => {
    mkdirp(name, (err) => (err ? reject(err) : resolve()));
});
exports.moveDir = (source, target) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    const dirs = yield exports.readDir("**/*.*", {
        cwd: source,
        dot: true,
        nosort: true,
    });
    yield Promise.all(dirs.map((dir) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const from = path.resolve(source, dir);
        const to = path.resolve(target, dir);
        yield exports.makeDir(path.dirname(to));
        yield exports.renameFile(from, to);
    })));
});
exports.copyDir = (source, target) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    const dirs = yield exports.readDir("**/*.*", {
        cwd: source,
        dot: true,
        nosort: true,
    });
    yield Promise.all(dirs.map((dir) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const from = path.resolve(source, dir);
        const to = path.resolve(target, dir);
        yield exports.makeDir(path.dirname(to));
        yield exports.copyFile(from, to);
    })));
});
exports.cleanDir = (pattern, options) => new Promise((resolve, reject) => rimraf(pattern, { glob: options }, (err) => (err ? reject(err) : resolve())));
exports.default = {
    cleanDir: exports.cleanDir,
    copyDir: exports.copyDir,
    copyFile: exports.copyFile,
    makeDir: exports.makeDir,
    moveDir: exports.moveDir,
    readDir: exports.readDir,
    readFile: exports.readFile,
    renameFile: exports.renameFile,
    writeFile: exports.writeFile,
};
//# sourceMappingURL=fs.js.map