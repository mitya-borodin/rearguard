# Rearguard 

[![Build Status](https://travis-ci.org/Techintouch/rearguard.svg?branch=master)](https://travis-ci.org/Techintouch/rearguard)
![david](https://david-dm.org/Techintouch/rearguard.svg)
[![Test Coverage](https://codeclimate.com/github/codeclimate/codeclimate/badges/coverage.svg)](https://codeclimate.com/github/Techintouch/rearguard/coverage)
[![Code Climate](https://codeclimate.com/github/codeclimate/codeclimate/badges/gpa.svg)](https://codeclimate.com/github/Techintouch/rearguard)
[![Greenkeeper badge](https://badges.greenkeeper.io/Techintouch/rearguard.svg)](https://greenkeeper.io/)
[![NSP Status](https://nodesecurity.io/orgs/knowledge-director/projects/cf203f22-265b-40e3-8a54-1b34506b7726/badge)](https://nodesecurity.io/orgs/knowledge-director/projects/cf203f22-265b-40e3-8a54-1b34506b7726)


Содержание
----------
* [Мотивация](#motivation)
* [Установка](#install)
* [CLI](#cli)
* [Использование](#using)
* [Конфигурация](#config)
* [Минимально необходимая структура проекта](#structure)
* [Пример работы modules](#modules)
* [Пример работы proxy](#proxy)
* [Что внутри?](#including)


<a name="motivation"></a>

### Мотивация:
- Версионирование конфигурации сборки;
- Простота разворачивания конфигурации сборки определённой версии;
- Обновление только изменившиейся части конфигурации инкрементно;
- Легкость обновления на нескольких проектах;
- Устранение избыточности в виде копий сборки в каждом проекте;
- Возможность устанавливать зависимости глобально;
- Одна единственная зависимость в package.json для разработки;	
- Быстрый старт проекта без необходимости настройки;
- Тестирование конфигурации и результа работы;
- Получить минимально доступную гибкость (подключение плагинов для PostCSS и Babel);
- Минималистичный конфигурационный файл;
- Проверка конфигурации на избыточные, недостающие или некорректные свойства. _Имеется в виду build.config.json.
Он содержит полный список полей доступных для конфигурации. Если указать неизвестные 
для rearguard поля, вы получите сообщение о том что они не используются. Если забыть указать
необходимое поле, применится значение по умолчанию и получите сообщение о произошедшем. Если указать 
неправильный тип данных для поля, то вы также получите оповещение о том какие настройки в него применились._


<a name="install"></a>

#### Установка
```sh
npm install -g rearguard
```
если глобальная установка неподходит
```sh
npm install -D rearguard
```

<a name="cli"></a>

#### CLI
```sh
rearguard [react | infernojs] [start | build]
```
Доступные флаги: 
- --typescript | -ts - включает поддержку typescript, ts, tsx файлов.
- --isomorphic | -i - переводит сборку в изоморфный режим.
- --release | -r - сборка будет работать в production режиме как для start так и для build.
- --analyze | -a - запустит [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer), позволяет 
понять что участвует в сборке, нет ли лишнего или все ли необходимое подключилось.
- --verbose | -v - делает вывод многословным.
- --debug | -d - выведет дополнительную отладочную информацию.

<a name="using"></a>

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

<a name="config"></a>

#### Конфигурация
При первом запуске будет автоматически сгенерированно два файла в текущей директории

- build.config.json - версионируется 
- socket.config.json - не версионируется 

build.config.json:
```json 
{
  "context": "src", // директория от которой будут расчитываться все остальные пути, можно указать путь внутри директории запуска. 
  "entry": "index.jsx", // точка входа в приложение, указывается относительно context.
  "output": {
    "path": "dist", // директория куда будут выгружен результат сборки. 
    "publicPath": "/"  это url по которому можно будет получить статику.
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
* комментарии здесь для наглядности, при попытке использовать этот пример в проекте (кстати зачем?) будет вызвана ошибка парсинга.

* **_context_** - 
* **_entry_** - 
* **_output.path_** - 
* **_output.publicPath_** -
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




<a name="structure"></a>

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

<a name="modules"></a>

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

<a name="proxy"></a>

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


<a name="including"></a>


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
