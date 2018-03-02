# Rearguard 
[![Build Status](https://travis-ci.org/Techintouch/rearguard.svg?branch=master)](https://travis-ci.org/Techintouch/rearguard)
![david](https://david-dm.org/Techintouch/rearguard.svg)
[![Greenkeeper badge](https://badges.greenkeeper.io/Techintouch/rearguard.svg)](https://greenkeeper.io/)

Содержание
----------
* [Что такое rearguard?](#whatIsIt)
* [Под капотом](#underTheHood)
* [Конфигурация](#configuration)
* [DLL](#dll)
* [Установка](#install)
* [CLI](#cli)
* [Структура проекта](#structure)
* [Пример работы modules](#modules)

<a name="whatIsIt"></a>
#### Что такое rearguard?:
Rearguard - это консольная утилита, включающая комплект настроек для разработки SPA, приложения основанного на технологиях
Typescript, React, CSS-Modules, Webpack, PostCSS.

<a name="underTheHood"></a>
#### Под капотом:
- webpack
- webpack-dev-server
- ts-loader
- tslint-loader
- postCSS
- css-modules
- isomorphic-style-loader
- DLLPlugin
- hard-source-webpack-plugin
- workbox-webpack-plugin

<a name="configuration"></a>
#### Конфигурация:
Для начала работы ничего конфигурировать не нужно. Все необходимые файлы будут добавлены в проект автоматически.

Rearguard ожидает, что имеется package.json и src/index.tsx.

Файл конфигурации называется `build.config.json` и он будет создан автоматически, если его нет. Также этот файл **ДОЛЖЕН 
находиться под версионированием.**

Файлы `tsconfig.json` и `tslint.json` генерируются автоматически и при каждом запуске перезаписываются. Эти файлы **НЕ 
ДОЛЖНЫ** находиться под версионированием.

Файл `socket.config.json` генерируется автоматически и **НЕ перезаписывается при каждом запуске**. Описывает три
сущности:
- Порт сервера, который обслуживает аналитику по сборке (webpack-bundle-analyzer).
- Настройки для всех прокси (webpack-dev-server).
- Хост и порт для webpack-dev-server.

Файл `src/typings.d.ts` генерируется автоматически и при каждом запуске перезаписывается. 

Декларирует модули для css и других файлов ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2.

Этот файл необходим для того, чтобы не решать задачу с генерацией d.ts файлов, для css и прочих файлов.

Файлы `build.config.json`, `socket.config.json` - проходят валидацию на:
- наличие необходимых полей;
- отсутствие полей, которые не участвуют в конфигурации;
- типы значений, которые содержат поля;

##### build.config.json:
Полное содержание этого файла:
```json
{
  "context": "src",
  "entry": "index.tsx",
  "output": {
    "path": "dist",
    "publicPath": "/"
  },
  "modules": [
    "src"
  ],
  "typescript": {
    "configPath": "tsconfig.json",
    "config": {
      "compilerOptions": {
        "importHelpers": true,
        "noImplicitAny": false,
        "noUnusedParameters": false,
        "strictPropertyInitialization": false,
        "types": [
          "node"
        ]
      },
      "compileOnSave": false
    }
  },
  "postCSS": {
    "plugins" : "postCssPlugins.js"
  }
}
```
- context - директория, в которой находится исходный код.
- entry - точка входа в приложение, так как этот набор настроек для SPA приложения, то и точка входа может быть только
одна.
- output.path - путь до директории, в которую будет выгружен результат сборки, рассчитывается от места запуска консольной 
утилиты.
- output.publicPath - описывает по какому URL буду загрузаться файлы. Например: если указать /assets, то URL всех файлов 
будут начинаться с /assets.
- modules - описывает директории, в которых webpack будет искать модули. Необходимо для того, чтобы не описывать полные
или относительные пути, ниже я приведу примеры использования.
- typescript.configPath - путь до конфигурационного файла, относительно директории запуска консольной утилиты.
- typescript.config.compilerOptions - настройки которые будут добавлены в файл `tsconfig.json` и использованы в
ts-loader.
- typescript.config.compileOnSave - смотреть [тут](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
- postCSS.plugins - указывает на файл с плагинами для postCSS которые будут подключены к webpack + к тем которые
втроенные.

Пример `postCssPlugins.js`: 
```js
  module.exports = [
    require('postcss-nesting')(),
    require('postcss-nested')(),
    require('postcss-calc')(),
    require('postcss-extend')()
  ]
```

##### socket.config.json:
Полное содержание этого файла:
```json
{
  "analyze": {
    "port": 20000
  },
  "proxy": {
    "/graphql": "http://localhost:9900",
    "/auth": "http://localhost:9900",
    "/ws": {
      "target": "ws://localhost:9900",
      "ws": true
    }
  },
  "socket": {
    "host": "localhost",
    "port": 5500
  }
}
```
- analyze.port - порт для webpack-bundle-analyzer.
- proxy - описывает все необходимые вам проксирования.
- socket - описывает хост и порт для webpack-dev-server.

<a name="dll"></a>
#### DLL:
DLL - динамическая загрузка библиотек.
Для работы этой возможности необходим файл `src/vendors.ts`.
Следующего содержания **внимание - это ПРИМЕР не для копирования**:
```ecmascript 6
import "antd";
import "antd/dist/antd.css";
import "antd/lib/locale-provider/en_US";
import "crew";
import "hoist-non-react-statics";
import "isomorphic-style-loader/lib/withStyles";
import "mobx";
import "mobx-react";
import "mobx-react-devtools";
import "mobx-utils";
import "normalize.css";
import "prop-types";
import "react";
import "react-dom";
import "react-router";
import "react-router-dom";
import "twix";
import "validatorjs";
```
То что будет импортированно в этом файле будет собрано в отдельный JS файл, который позже подключится в браузер отдельным
линком.
И будет создан специальный JSON файл с описанием того, что есть в этом dll.js файле. И когда вы будете в проекте импортировать, 
например, `mobx-react` то webpack посмотрит в JSON файл и если там найдет описание того, что этот `mobx-react` уже
имеется в dll.js добавит в сборку только функцию получения объекта из dll.js файла. Таким образом, скорость разработки
увеличивается и _**меньше тратится электричество.**_

<a name="install"></a>
#### Установка
Пакет можно установить как локально так и глобально. Это зависит от ваших предпочтений. Установка глобально экономит 
место на диске, но у вас будет одна версия на все проекты, что в общем не плохо. Но и у локальной установки есть
плюсы: она позволят вам использовать конкретную версию для проекта.

Глобально, для использования сразу в нескольких проектах.
```sh
npm install -g rearguard
```
Локально, в проект и сохранением точной версии.
```sh
npm install -D rearguard
```
Лично я ставлю глобально ```:-)``` 


<a name="cli"></a>
#### CLI
Команды:
- rearguard start - запускает dev режим с прослушиванием файлов и пересборкой, но **БЕЗ sourcemap**. Sourcemap это очень
долго и не всегда необходимо.
- rearguard start -d - запуск dev режима со всевозможными отладочными средствами и sourcemap.
- rearguard start -r - запуск prod режима, необходим, чтобы протестировать результующую сборку.
- rearguard build [-d | -r] - аналогично команде start только на выходе будут файлы.
- rearguard dll [-d | -r] - запускает сборку dll для dev или prod режимов, и ,также, имеет возможность включить отладочную
информацию. На выходе будет сгенерирован файл внешних библиотек, который будет подключен в index.html.
```json
{
  "scripts": {
    "start": "rearguard start",
    "start:debug": "rearguard start -d",
    "start:release": "rearguard start -r",
    "build": "rearguard build",
    "build:debug": "rearguard build -d",
    "build:release": "rearguard build -r",
    "dll": "rearguard dll",
    "dll:debug": "rearguard dll -d",
    "dll:release": "rearguard dll -r"
  }
}
```

<a name="structure"></a>
#### Структура проекта:
```
my-app
├── package.json
└── src - context
    ├── decorators - Декораторы и HOC компоненты.
    ├── interfaces - TS интерфейсы.
    ├── pages - Каталог страниц.
    ├── services - Сервисы для работы с внешними ресурсами (CRUD HTTP, REST, GraphQL, IndexedDB, WS)
    ├── smartComponents - Компонеты которы содержат логику работы с данными и не содержат верстки и CSS.
    ├── static - статические файлы (fonts, images)
    ├── stores - Каталог хранилищ приложения, тут описывается бизнес логика работы приложения ("мозги приложения").
    ├── stubComponents - верстка (UI пакеты такие как [Ant](https://ant.design/)).
    ├── utils - Униферсальные классы и функции.
    ├── vars - CSS переменные и JS переменные.
    ├── vendors.ts - Описывает внешние зависимости пакета, могут быть как из node_modules так и из других мест.
    ├── typings.d.ts - Генерируется автоматически, декларируются css модули и модули для статических файлов.
    └── index.tsx - Точка входа в приложение.
```

<a name="modules"></a>
#### Пример работы modules
**outSideProjectFromGitSubmodule** - этот проект разрабатывается отдельно, например, это проект с версткой.

**my-app** - этот проект нуждается в компонентах, которые разрабатываются в проекте `outSideProjectFromGitSubmodule`.

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
```ecmascript 6
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
```ecmascript 6
import { Component3 } from 'outSideProjectFromGitSubmodule/src/export'
```
Или получить `Component4` без использования `export.jsx`  
```ecmascript 6
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
```ecmascript 6
import { Component3 } from 'export'
```
Или получить `Component4` без использования `export.jsx`
```ecmascript 6
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
```ecmascript 6
import Component4  from 'Component4'
```

Вопросы и предложения можно написать в issue или непосредственно мне, контакты: [Dmitriy Borodin](http://borodin.site)
