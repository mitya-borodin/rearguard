# rearguard init

Инициализация - процесс добавления всех необходимых файлов и полей в package.json.

## Список генерируемых файлов

- [**tslint.json**](https://palantir.github.io/tslint/usage/configuration/)
- [**tsconfig.json**](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
- [**.prettierrc**](https://prettier.io/docs/en/configuration.html)
- **rearguard.json** - не версионируемый конфигурационный файл, исползуемый для конфигурации прокси, сокета webpac-dev-server, порта для вывода аналитики сборки.
- [**.dockerignore**](https://docs.docker.com/engine/reference/builder/)
- [**.editorconfig**](https://editorconfig.org)
- [**.gitignore**](https://git-scm.com/docs/gitignore)
- [**.npmrc**](https://docs.npmjs.com/files/npmrc)
- **postcss.config.js** - файл для подключения плагинов для postCSS
- **pre_publish.sh** - сценарий для проверки пакета перед публикацией
- **src/typings.d.ts** - typescript декларации для импорта не TS модулей в концепции webpack; Это необходимо чтобы не генерировать .d.ts файлы для импорта css, png, и прочих форматов файлов
- **src/index.tsx** - точка входа в проект, используется для разработки / сборки финального результата.
- **src/lib_exports.ts** - точка экспорта API.
- **src/vendors.ts** - точка входа для составления API.

## Список полей в package.json

- [**main**](https://docs.npmjs.com/files/package.json#main)
- [**types**](http://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html)
- [**module**](https://docs.npmjs.com/files/package.json#main)
- [**files**](https://docs.npmjs.com/files/package.json#files)
- [**scripts**](https://docs.npmjs.com/files/package.json#scripts)
- [**rearguard**](https://gitlab.com/mitya-borodin/rearguard#версионируемые)

## Параметры запуска

- --dll
- --browser_lib
- --load_on_demand
- --project
- --node_lib
- --force
