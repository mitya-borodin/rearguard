# Rearguard 
[![Build Status](https://travis-ci.org/Techintouch/rearguard.svg?branch=master)](https://travis-ci.org/Techintouch/rearguard)
![david](https://david-dm.org/Techintouch/rearguard.svg)
[![Greenkeeper badge](https://badges.greenkeeper.io/Techintouch/rearguard.svg)](https://greenkeeper.io/)

Содержание
----------
* [Мотивация](#motivation)
* [Проверка конфигурации](#chekConfiguration)
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
- Инкрементные обновления rearguard;
- Легкость обновления на нескольких проектах;
- Устранение избыточности в виде копий пакетов зависимостей, которые нужны для работы сборки, в каждом проекте;
- Возможность устанавливать rearguard глобально;
- Единственная зависимость в package.json для разработки;	
- Быстрый старт проекта без необходимости настройки;
- Тестирование rearguard и ключевых особенностей в целевом проекте, который был собран через rearguard;
- Получить минимально доступную гибкость (подключение плагинов для PostCSS и Babel);
- Минималистичный конфигурационный файл;
- Проверка конфигурации на избыточные, недостающие или некорректные свойства. 

<a name="chekConfiguration"></a>
#### Проверка конфигурации build.config.json
- Содержит ли полный список полей доступных для конфигурации.
- Не содержит ли лишних полей которые не используются.
- Верные ли введенные типы данных.

<a name="install"></a>
#### Установка
Локально в проект и сохранением точной версии.
```sh
npm install -D rearguard
```
Глобально для использования сразу в нескольких проектах.
```sh
npm install -g rearguard
```

<a name="cli"></a>
#### CLI
```sh
rearguard [react | infernojs] [start | build]
```
Доступные флаги: 
- --typescript | -ts - включение поддержки typescript, ts, tsx файлов.
- --isomorphic | -i - перевод сборки в изоморфный режим.
- --onlyServer - работа только с серверной частью изоморфного приложения (фактически, получается классический веб 
сервер, где шаблонизатор это React или Infernojs).
- --release | -r - работа сборки в production режиме, как для start, так и для build.
- --analyze | -a - запуск [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer), помогает
проанализировать содержимое сборки.
- --verbose | -v - многословный вывод.
- --debug | -d - вывод дополнительной отладочной информации.

<a name="using"></a>
#### Использование
Запуск SPA приложения, основанного на библиотеке [React](https://facebook.github.io/react/)
```sh
rearguard react start 
```
Сборка в production режиме SPA приложения, основанного на библиотеке [React](https://facebook.github.io/react/)
```sh
rearguard react build --release 
```
Запуск SPA приложения, основанного на библиотеке infernojs [infernojs](https://infernojs.org/)
```sh
rearguard infernojs start 
```
Сборка в production режиме SPA приложения, основанного на библиотеке infernojs [infernojs](https://infernojs.org/)
```sh
rearguard infernojs build --release 
```

<a name="config"></a>
#### Конфигурация
При первом запуске будет автоматически сгенерировано два файла в текущей директории

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
    "/auth": "http://localhost:9000",
    "/ws": {
      "changeOrigin": true,
      "target": "http://localhost:5000",
      "ws": true
    }
  },
  "isomorphic": {
    "entry": "server.jsx",
    "publicDirName": "public"
  },
  "css": {
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
* **_context_** - базовая директория проекта. 
* **_entry_** - точка входа в приложение указывается относительно _context_.
* **_output.path_** - директория, куда будет выгружен результат сборки. 
* **_output.publicPath_** - это url, по которому можно будет получить статику.
* **_modules_** - это директории, в которых webpack будет искать модули, пример будет ниже.
* **_[browserslist](http://browserl.ist/?q=%3E0.1%25%2C+last+2+versions%2C+not+ie+%3C%3D+11)_** - список, который очерчивает 
круг поддерживаемых браузеров, используется для [env](https://github.com/babel/babel-preset-env) и 
[autoprefixer](https://github.com/postcss/autoprefixer)
* **_proxy_** - объект отписывает с какого path перенаправлять на какой host и path, примеры будут ниже.
* **_isomorphic.entry_** - точка входа в приложение веб-сервера.
* **_isomorphic.publicDirName_** - имя директории, в которой содержатся файлы в основном используемые в `<meta>` тегах и поисковыми системами. Копируется в **_output.path_**. Эти файлы не импортируются в проект. 
* **_css.isolation_** - включают [postcss-autoreset](https://github.com/maximkoretskiy/postcss-autoreset) и 
[postcss-initial](https://github.com/maximkoretskiy/postcss-initial)
* **_css.reset_** - настройки для postcss-autoreset и postcss-initial
* **_css.postCssPlugins_** - путь к файлу **_postCssPlugins.js_**, где подключаются плагины для PostCSS в целевом проекте.
* **_typescript.configPath_** - путь к файлу tsconfig.json, где находится конфигурация для typescript, этот файл конфигурации 
генерируется автоматически и нужен для того, чтобы его читала IDE. Этот файл **не версионируется**.
* **_typescript.showConfigForIDE_** - флаг необходимый для включения или выключения генерации tsconfig.json файла. 
* **_typescript.config_** - объект с настройками компиляции TS, значения в этом объекте будут Object.assign с базовой 
конфигурацией, таким образом, можно влиять на настройки TS. 

<a name="structure"></a>
#### Минимально необходимая структура проекта

**SPA**
```
my-app
├── package.json
├── public - isomorphic.publicDirName
│   └── favicon.ico
└── src - context
    └── index.jsx - entry
```
**Isomorphic**
```
my-app
├── package.json
├── public - isomorphic.publicDirName
│   └── favicon.ico
└── src - context
    └── index.jsx - entry
    └── server.jsx - isomorphic.entry
```
Дальнейшее развитие проекта остаётся на усмотрение разработчика.

<a name="modules"></a>
#### Пример работы modules
**outSideProjectFromGitSubmodule** - этот проект разрабатывается отдельно, например это проект с версткой. 

**my-app** - этот проект нуждается в компонентах которые разрабатываются в проекте `outSideProjectFromGitSubmodule`.

Одним из вариантов доставки компонентов из `outSideProjectFromGitSubmodule` в `my-app`, является подключение `outSideProjectFromGitSubmodule` как git submodule в `my-app`.
```
my-app
├── package.json
├── public - isomorphic.publicDirName
│   └── favicon.ico
└── src - context
    ├── outSideProjectFromGitSubmodule (git submodule)
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
    └── index.jsx - entry
```
export.jsx
```javascript 1.8
export {default as Component3} from 'components/Component3'
export {default as Component4} from 'components/Component4'
```
Добавим `src` как директорию в которой webpack будер искать модули:
```json
{
  "modules": [
    "src"
  ]
}
```
Теперь для получения `export.jsx` необходимо в файле `Component2.jsx` написать следующий импорт:
```javascript 1.8
import { Component3 } from 'outSideProjectFromGitSubmodule/src/export'
```
Или получить `Component4` без использования `export.jsx`  
```javascript 1.8
import Component4 from 'outSideProjectFromGitSubmodule/src/components/Component4'
```

Добавим ещё одну директорию `src/outSideProjectFromGitSubmodule/src` из (git submodule) в котором имеются интересующие нас компоненты.
```json
{
  "modules": [
    "src",
    "src/outSideProjectFromGitSubmodule/src"
  ]
}
```
Теперь для получения `export.jsx` необходимо в файле `Component2.jsx` написать следующий импорт:
```javascript 1.8
import { Component3 } from 'export'
```
Или получить `Component4` без использования `export.jsx`
```javascript 1.8
import Component4  from 'components/Component4'
```

Или даже так:
```json
{
  "modules": [
    "src",
    "src/outSideProjectFromGitSubmodule/src",
    "src/outSideProjectFromGitSubmodule/src/components"
  ]
}
```
И получить `Component4` по одному только имени
```javascript 1.8
import Component4  from 'Component4'
```

<a name="proxy"></a>
#### Пример работы proxy
```json
{
  "proxy": {
    "/graphql": "http://localhost:9000",
    "/auth": "http://localhost:9000",
    "/ws": {
      "changeOrigin": true,
      "target": "http://localhost:5000",
      "ws": true
    }
  }
}
```
Все запросы начинающиеся на **_/graphql_** будут перенаправлены на:
- _**/graphql**_ -> http://localhost:9000 **_/graphql_**
- _**/graphql**_/data -> http://localhost:9000 **_/graphql_**/data

Все запросы начинающиеся на _**/auth**_ будут перенаправлены на:
- **_/auth_** -> http://localhost:9000 _**/auth**_
- _**/auth**_/user -> http://localhost:9000 _**/auth**_/user

В режиме SPA используется webpack-dev-server который в свою очередь использует [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware#core-concept) для работы proxy. 
В режиме Isomorphic или onlyServer используется веб-сервер который находится 
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

This is my consolidation of tools for building front-end apps base on react or infernojs, 
