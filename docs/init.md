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

Параметры запуска могут комбинироваться. Запуск rearguard init приведет к выводу на экран информации о том, какие существуют параметры запуска.

- --dll - включает сборку dll_bundle;
- --browser_lib - включает сборку lib_bundle и генерацию .d.ts файлов в директорию lib;
- --load_on_demand - отмечает пакет как загружаемый по требованию, таким образом эта зависимость не появится в index.html результирующего проекта;
- --node_lib - включает генерацию .js и .d.ts в директории lib;
- --project - отмечает проект как результирующий, такой проект генерирует директорию dist где будут находиться все подключенные зависимости.

## Комбинации запуска

### Пакет с общими зависимстями

```bash
rearguard init --dll
```

Будет инициализирован проект в котором имеется только `src/${dll_entry}`.
В результате будут собираться dll_bundle в dev и prod режиме.

### Пакет с browser library

```bash
rearguard init --browser_lib [ --dll | --load_on_demand ]
```

Будет инициализирован проект который имеет две точки входа `src/${entry}` и `src/${lib_entry}`. Первая точка входа необходима для запуска кода в браузере, вторая точка входа необходима для экспорта из библиотеки.

**Опционально** может иметь собственный dll_bundle, с уникальными только для этого пакета зависимостями. Если определен флаг --dll то появляется точка входа `src/${dll_entry}`.

На выходе будет иметь lib_bundle с соответсвующим бандлом, lib с .d.ts файдами.

Если добавлен DLL, также будет иметь директорию dll_bundle с соответсвующим бандлом.

### Пакет с node library

```bash
rearguard init --node_lib
```

Будет инициализирован проект который имеет одну точки входа `src/${lib_entry}`. Которая необходима для экспорта из библиотеки. Разработка библиотеки может вестись в трех стилях:

1. "В слепую" - опираясь только на typescrypt компиляцию и не запуская код при каждом изменении;
2. Разработка с тестированием - запускается реализация непосредственно в процессе выполнения тестов;
3. В составе целевого проекта или другой зависимости - ситуация когда пакет разрабатывается совместно с целевым проектом и слинкован через npm link на машине разработчика;

На выходе будет иметь директорию lib с .js и .d.ts файлами.

### Пакет с isomorphic library

```bash
rearguard init --browser_lib --node_lib [ --dll | --load_on_demand ]
```

Сочетает в себе browser library и node library, может иметь собственный dll_bundle.

На выходе генерирует директории lib_bundle и lib, а также опционально dll_bundle. Директория lib содержит .js и .d.ts файлы. Директории lib_bundle и dll_bundle содержать файлы бандлов.

### Результирующий проект

Результирующий проект - это результат который разворачивается на сервере. Имеет index.html и рядом все зависимости. Вся эта директория c index.html основным кодом, и зависимостями загружается на WEB сервер который отдает эти файлы в браузеры.

```bash
rearguard init --project [ --dll ]
```

Проект имеет основную точку входа это `src/${entry}`, и опционально точку входа для сборки DLL `src/${dll_entry}`.

На выходе генерирует директорию `dist`, в которой находится index.html, main.js, все подключенные зависимости (dll_bunele, lib_bundle). Те зависимости которые **НЕ** отмечены флагом `--load_on_demand` будут присутствовать в index.html, а те которы **ОТМЕЧЕНЫ** будут записаны в `src/deferred_module_list.ts`, и во времени выполнения могут быть загружены в браузер и исполнены.
