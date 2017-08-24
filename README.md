# Rearguard 
[![Build Status](https://travis-ci.org/Techintouch/rearguard.svg?branch=master)](https://travis-ci.org/Techintouch/rearguard)
![david](https://david-dm.org/Techintouch/rearguard.svg)
[![Test Coverage](https://codeclimate.com/github/codeclimate/codeclimate/badges/coverage.svg)](https://codeclimate.com/github/Techintouch/rearguard/coverage)
[![Code Climate](https://codeclimate.com/github/codeclimate/codeclimate/badges/gpa.svg)](https://codeclimate.com/github/Techintouch/rearguard)
[![Greenkeeper badge](https://badges.greenkeeper.io/Techintouch/rearguard.svg)](https://greenkeeper.io/)
[![NSP Status](https://nodesecurity.io/orgs/knowledge-director/projects/cf203f22-265b-40e3-8a54-1b34506b7726/badge)](https://nodesecurity.io/orgs/knowledge-director/projects/cf203f22-265b-40e3-8a54-1b34506b7726)

## Готовый к использованию инструмент сборки фронтенд проектов, основанных на React или InfernoJS.

### Мотивация
- Версионирование конфигурации сборки.
- Инкрементные обновления конфигурации сборки.
- Легкость обновления конфигурации сборки на нескольких проектах (в целевом проекте необходимо поднять версию rearguard).
- Не копировать код конфигурации от проекта к проекту.
- Устанавливать зависимости для разработки глобально, уменьшить кол-во копий пакетов если на одном ПК несколько 
проектов.
- Единственная зависимость для разработки, если глобальная установка не подходит.
- Старт проекта без необходимости настройки.
- Тестирование конфигурации и корректной сборки проекта.
- Получить минимально доступную гибкость (подключить плагины для PostCSS и Babel), минимальный конфигурационный файл.
- Проверка в конфигурации на избыточные свойства и на недостающие или не корректные, имеется в виду build.config.json 
содержит полный список полей доступных для конфигурации не больше и не меньше. Если указать каки то неизвестные 
для rearguard поля то вы получите сообщение о том что существуют поля которые не используются. Если забыть указать
какое то поле то вы увидете предупреждение что полей нехватает и какие текущие настройки применились. Если указать 
неправильный тип данных для поля то вы так же получите оповещение о том что указали неправильный тип данных в конкретном
поле и какие текущие настройки используются в этом поле.

#### Установка
```sh
npm install -g rearguard
```
если глобальная установка неподходит
```sh
npm install -D rearguard
```
#### CLI
```sh
rearguard [react | infernojs] [start | build]
```
Доступные флаги: 
- --typescript | -ts - включает поддержку typescript, ts, tsx файлов.
- --isomorphic | -i - переводит сборку в изоморфный режим.
- --onlyServer - работает только с серверной частью изоморфного приложения, фактически получается классический веб сервер где 
шаблонизатор это React или Infernojs.
- --release | -r - сборка будет работать в production режиме как для start так и для build.
- --analyze | -a - запустит [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer), позволяет 
понять что участвует в сборке, нет ли лишнего или все ли необходимо подключилось.
- --verbose | -v - делает вывод многословным.
- --debug | -d - выведет дополнительную отладочную информацию.

#### Использование
Запуск SPA приложения основанного на библиотеке [React](https://facebook.github.io/react/)
```sh
rearguard react start 
```
Сборка в production режиме SPA приложения основанного на библиотеке [React](https://facebook.github.io/react/)
```sh
rearguard react build --release 
```
Запуск SPA приложения основанного на библиотеке [infernojs](https://infernojs.org/)
```sh
rearguard infernojs start 
```
Сборка в production режиме SPA приложения основанного на библиотеке [infernojs](https://infernojs.org/)
```sh
rearguard infernojs build --release 
```

#### Конфигурация
При первом запуске будет автоматически сгенерированно два файла в текущей директории

- build.config.json - версионируется 
- socket.config.json - не версионируется 

build.config.json:
```json 
{
  "context": "src",
  "entry": "index.jsx",
  "output": {
    "path": "dist",
    "publicPath": "/"
  },
  "modules": [
    "src"
  ],
  "browserslist": [
    ">0.1%",
    "last 2 versions",
    "not ie <= 11"
  ],
  "proxy": {
    "/graphql": "http://localhost:9000",
    "/auth": "http://localhost:9000"
  },
  "isomorphic": {
    "entry": "server.jsx",
    "publicDirName": "public"
  },
  "css": {
    "isolation": true,
    "reset": {
      "all": "initial",
      "font-size": "inherit",
      "font-family": "Avenir Next, BlinkMacSystemFonts, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
      "display": "block",
      "boxSizing": "border-box",
      "cursor": "inherit"
    },
    "postCssPlugins": "postCssPlugins.js"
  },
  "typescript": {
    "configPath": "tsconfig.json",
    "showConfigForIDE": true,
    "config": {
      "compilerOptions": {},
      "compileOnSave": false
    }
  }
}
```
socket.config.json:
```json
{
  "socket": {
    "port": "5000",
    "host": "localhost"
  }
}
```
postCssPlugins.js
```javascript 1.8
module.exports = [
  require('postcss-nesting')(),
  require('postcss-nested')(),
  require('postcss-calc')(),
  require('postcss-extend')()
]
```

* **_context_** - директория от которой будут расчитываться все остальные пути, можно указать путь внутри директории запуска. 
* **_entry_** - точка входа в приложение, указывается относительно _context_.
* **_output.path_** - директория куда будут выгружен результат сборки. 
* **_output.publicPath_** - это url по которому можно будет получить статику.
* **_modules_** - это директории в которых webpack будет искать модули, пример будет ниже.
* **_[browserslist](http://browserl.ist/?q=%3E0.1%25%2C+last+2+versions%2C+not+ie+%3C%3D+11)_** - список который очерчивает 
круг поддерживаемых браузеров, используется для [env](https://github.com/babel/babel-preset-env) и 
[autoprefixer](https://github.com/postcss/autoprefixer)
* **_proxy_** - объект отписывает с кого path перенаправлять на какой host и path, примеры будут ниже.
* **_css.isolation_** - включают [postcss-autoreset](https://github.com/maximkoretskiy/postcss-autoreset) и 
[postcss-initial](https://github.com/maximkoretskiy/postcss-initial)
* **_css.reset_** - настройки для postcss-autoreset и postcss-initial
* **_css.postCssPlugins_** - путь к файлу **_postCssPlugins.js_** где подключаются плагины для PostCSS в целевом проекте.
* **_typescript.configPath_** - путь к файлу tsconfig.json где находится конфигурация для typescript, этот файл конфигурации 
генерируется автоматически и нужен для того чтобы его читала IDE. Этот файл **не версионируется**.
* **_typescript.showConfigForIDE_** - флаг необходимый для включения или выглючения генерации tsconfig.json файла. Если 
он не нужен то его можно и не генерировать. 
* **_typescript.config_** - объект с настройками компиляции TS, значия в этом объекте будут Object.assign с базовой 
конфигурацией, таким образом можно влиять на настройки TS. 

#### Минимально необходимая структура проекта
**SPA**
```
my-app
├── package.json
├── public
│   └── favicon.ico
└── src
    └── index.jsx - точка входа в SPA приложение
```
**Isomorphic**
```
my-app
├── package.json
├── public
│   └── favicon.ico
└── src
    └── index.jsx - точка входа в SPA приложение
    └── server.jsx - точка входа в серверную часть приложения, тут веб сервер рендерит SPA.
```
Дальнейшее развитие проекта остается на усмотрение разработчика.
#### Пример работы modules
```
my-app
├── package.json
├── public
│   └── favicon.ico
└── src
    ├── outSideProjectFromGitSubmodule
    │   ├── package.json
    │   ├── public
    │   │   └── favicon.ico
    │   └── src
    │       ├── components
    │       │   ├── Component3.jsx      
    │       │   └── Component4.jsx 
    │       ├── export.jsx
    │       └── index.jsx
    ├── components
    │   ├── Component1.jsx    
    │   └── Component2.jsx      
    └── index.jsx
```
export.jsx
```javascript 1.8
export {default as Component3} from 'components/Component3'
export {default as Component4} from 'components/Component4'
```
Если использовать так:
```json
{
  "modules": [
    "src"
  ]
}
```
То чтобы получить export.jsx необходимо в файле Component2.jsx написать следующий импорт.
```javascript 1.8
import { Component3 } from 'outSideProjectFromGitSubmodule/src/export'
```
А если мы хотим получить Component4.jsx то импорт будет следующий.  
```javascript 1.8
import { Component3 } from 'outSideProjectFromGitSubmodule/src/components/Component4'
```
Если добавить новую директорию для обнаружения компонентов
```json
{
  "modules": [
    "src",
    "src/outSideProjectFromGitSubmodule/src"
  ]
}
```
То чтобы получить export.jsx необходимо в файле Component2.jsx написать следующий импорт.
```javascript 1.8
import { Component3 } from 'export'
```
А если мы хотим получить Component4.jsx то импорт будет следующий.  
```javascript 1.8
import { Component3 } from 'components/Component4'
```
#### Пример работы proxy
```json
{
  "proxy": {
    "/graphql": "http://localhost:9000",
    "/auth": "http://localhost:9000"
  }
}
```
Все запросы начинающиеся на **_/graphql_** будут перенаправлениы на:
- _**/graphql**_ -> http://localhost:9000 **_/graphql_**
- _**/graphql**_/data -> http://localhost:9000 **_/graphql_**/data

Все запросы начинающиеся на _**/auth**_ будут перенаправлениы на:
- **_/auth_** -> http://localhost:9000 _**/auth**_
- _**/auth**_/user -> http://localhost:9000 _**/auth**_/user

#### Что внутри ?
- [webpack](https://webpack.js.org) 3.5.5
- [uglifyjs-webpack-plugin](https://webpack.js.org/plugins/uglifyjs-webpack-plugin/#src/components/Sidebar/Sidebar.jsx)
- [webpack-bundle-analyzer](https://github.com/th0r/webpack-bundle-analyzer)
- [babel](https://github.com/babel/babel) 6
- [babel-preset-react](https://github.com/babel/babel/tree/master/packages/babel-preset-react)
- [babel-preset-react-optimize](https://github.com/thejameskyle/babel-react-optimize)
- [babel-plugin-inferno](https://github.com/infernojs/babel-plugin-inferno)
- [babel-preset-env](https://github.com/babel/babel-preset-env)
- [transform-runtime](https://babeljs.io/docs/plugins/transform-runtime/)
- [typescript](https://www.typescriptlang.org/) 2
- [ts-loader](https://github.com/TypeStrong/ts-loader)
- [isomorphic-style-loader](https://github.com/kriasoft/isomorphic-style-loader)
- [postcss 6](https://github.com/postcss/postcss)
- [postcss-import](https://github.com/postcss/postcss-import)
- [postcss-selector-not](https://github.com/postcss/postcss-selector-not)
- [postcss-initial](https://github.com/maximkoretskiy/postcss-initial)
- [postcss-color-function](https://github.com/postcss/postcss-color-function)
- [postcss-custom-media](https://github.com/postcss/postcss-custom-media)
- [postcss-media-minmax](https://github.com/postcss/postcss-media-minmax)
- [postcss-flexbugs-fixes](https://github.com/luisrudge/postcss-flexbugs-fixes)
- [autoprefixer](https://github.com/postcss/autoprefixer)
