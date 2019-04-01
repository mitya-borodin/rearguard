## Next Release

BREAKING CHANGES:

FEATURES:

IMPROVEMENTS:

BUG FIXES:

## 4.5.14 (2019-04-01)

BREAKING CHANGES:

FEATURES:

- Add command `rearguard start_node_server`;
- Add command `rearguard init --back_end`;
- Add copy deps for back-end from rearguard.back_end_deps;

IMPROVEMENTS:

BUG FIXES:

## 4.5.13 (2019-04-01)

BREAKING CHANGES:

FEATURES:

IMPROVEMENTS:

- Do not run handling change deps if current procces dose't done;

BUG FIXES:

## 4.5.12 (2019-04-01)

BREAKING CHANGES:

FEATURES:

IMPROVEMENTS:

- Add trim();
- Turn off watching deps before build intermediate deps and turn on before invalidate compiler;

BUG FIXES:

## 4.5.9 (2019-03-22)

BREAKING CHANGES:

FEATURES:

IMPROVEMENTS:

- deferred_module_list.ts add to .gitignore;
- deferred_module_list.ts processed throught prettirejs;

BUG FIXES:

## 4.5.3 (2019-03-04)

BREAKING CHANGES:

FEATURES:

IMPROVEMENTS:

- Replaced workbox-webpack-plugin to workbox-build;

BUG FIXES:

## 4.5.2 (2019-03-04)

BREAKING CHANGES:

FEATURES:

IMPROVEMENTS:

- Update documentation;

BUG FIXES:

## 4.5.1 (2019-02-28)

BREAKING CHANGES:

FEATURES:

IMPROVEMENTS:

- Moved time of last build to non versionable config;
- Saved hash of dev and prod build, and if it change I will update time of last build;

BUG FIXES:

## [4.5.0](https://gitlab.com/mitya-borodin/rearguard/tags/4.5.0) (2019-03-01)

BREAKING CHANGES:

FEATURES:

- Implemented the procedure of assembling dependencies that do not follow the chronological order.

IMPROVEMENTS:

BUG FIXES:

## 4.4.0 (2019-02-28)

BREAKING CHANGES:

- Change all --project flags to --application
- Rename (package.json).rearguard.has_project to (package.json).rearguard.is_application;
- Update isomorphic-style-loader to [5.0.1](https://github.com/kriasoft/isomorphic-style-loader/blob/master/CHANGELOG.md)

FEATURES:

IMPROVEMENTS:

- Update dependencies;
- Add time to last build for package;

BUG FIXES:

## 4.3.4 (2019-02-20)

BREAKING CHANGES:

FEATURES:

IMPROVEMENTS:

- Update dependencies;
- Add CHANGELOG.md file;

BUG FIXES:
