# Библиотека ориентированный дизайн

## Основные понятия

**Проект** - директория которая содержит **исходный код, конфигурационные файлы, дистрибуцию**. Проект может быть разных типов: `dynamic load library (DLL), browser_library, node_library, application`, и их комбинации `DLL` + `browser_library` + `node_library`, таким образом можно реализовать изоморфный функционал с уникальными зависимостями, которые подключаются в `index.html` без участия **webpack**.

- **DLL** - делает сборку зависимостей указанных в `dll_entry`, в результате выдет JS файл + `manifest.json` который описывает внутренюю структуру JS файла. Все это получается благодараря работе [DLLPlugin](https://webpack.js.org/plugins/dll-plugin/#dllplugin), `manifest.json` используется в [DllReferenceplugin](https://webpack.js.org/plugins/dll-plugin/#dllreferenceplugin), и сообветствующим импортам выставляет ссылки на JS файл который был получен при помощи [DLLPlugin](https://webpack.js.org/plugins/dll-plugin/#dllplugin). За более подрыбным описанием можно обратиться к [докементации](https://webpack.js.org/plugins/dll-plugin).
- **browser_library** - реализует функционал который используется только в браузере, может иметь собственный **dll_bundle** с уникальными для этой библиотеки зависимостями, которые нет смысла делать общими. Данный тип **проекта** имеет подтип `load_on_demand`. В этом проекте могут реализовываться: UI компоненты, бизнес логика, утилиты и прочее.
- **load_on_demand** - это `browser_library` которая отмечена параметром `load_on_demand` не будет автоматически подключаться в `index.html`, вместо этого будет формироваться `src/deferred_module_list.ts` в этом файле будет информация о том какие модули доступны для загрузки по требованию и публичные пути до этих модулей. `**Пути указаны от корня, так что легко запросить данные файлы с разных доменов.**`
- **node_library** - реализует функционал который используется только на сервере.
- **application** - реализует финальный продукт. Ничего не экспортирует, только импортирует, может иметь собственный `DLL`. Результатом сборки `application` будет директрия `dist` со всеми необходимыми файлами, в том числе и подключенных `DLL` и `browser_library`.

## Точки входа

- **DLL** - по умолчанию точка входа (`dll_entry`) `src/vendors.ts`.
- **browser_library** - по умолчанию точка экспорта `src/lib_exports.ts`. Точка входа для разработки в браузере (`lib_entry`) `src/index.tsx`.
- **node_library** - по умолчанию точка экспорта `src/lib_exports.ts`.
- **application** - по умолчанию точка (`entry`) `src/index.tsx`.
  Любую точку входа можно изменить в настройках которые находятся в **package.json в поле rearguard**.

## Примеры реализации

- [**DLL**](https://gitlab.com/mitya-borodin/base-code/tree/master/packages/vendors) - пакет содержит зависимости для разработки браузерных пакетов.
- [**browser_library**](https://gitlab.com/mitya-borodin/base-code/tree/master/packages/front) - проект содержит классы и компоненты для клиентской разработки.
- **browser_library + node_library ( [**utils**](https://gitlab.com/mitya-borodin/base-code/tree/master/packages/utils), [**isomorphic**](https://gitlab.com/mitya-borodin/base-code/tree/master/packages/isomorphic) )** - эти два **проекта** используются как на клиентской стороне так и на серверной.
- [**node_library**](https://gitlab.com/mitya-borodin/base-code/blob/master/packages/back/package.json) - проект содержит классы и интерфейсы для серверной разработки.
- [**browser_library ( load_on_demand )**](https://gitlab.com/mitya-borodin/base-code/tree/master/packages/deferred_module_test) - это пример **проекта** с отложенной загрузкой.
- [**application**](https://gitlab.com/home-tracker/front-end) - пример **проекта**, который реализует непосредственно продукт.

## Общее описание

Сборка `DLL`, `Library`, `Application` всегда изолированна от всех остальных частей программного обеспечения. Имеется в виду, что webpack всегда собирает код только из `src` конкретного (`DLL`, `Library`, `Application`). Все остальные части (`Library` либо `Application`) подключаются непосредственно в `index.html`. Webpack всегда собирает небольшой кусок. Частный случай когда все ПО находится в одном `проекте`, как правило по мере роста **проекта** от него отделаются части в самостоятельный `Library`.

Например: `browser_library` может зависеть от других `browser_library`, но webpack собирает только тот код который находится в текущем **проект**, не затрагивая код зависимостей, считая что они [exernals](https://webpack.js.org/configuration/externals/#root). Код зависимостей `browser_library` подключается в `index.html`, при помощи [rearguard](https://www.npmjs.com/package/rearguard).

В результате мы получаем систему разработки ПО, в которой отдельные части могут быть: реализованы независимыми командами, подключены в `index.html` без участия **webpack**, а так же загружены **по требованию** во времени исполнения.

## Реализация независимыми командами

Возможность разделить систему на отдельные предметные области, и определить связи между ними.

После чего разделить техническое задание на под задания и раздать отдельным командам, в результате получить инкапсулированные реализации в виде `**Library**`, которые применяются в `application`. **Позволяет горизонтально масштабировать команду.**

## Подключение в index.html без участия webpack

В результате сборки (`DLL`, `Library`) webpack генерирует файл `assets.json` в котором указаны пути для JS файлов `dll_bundle`,`browser_library`.

При сборке `DLL` на выходе получается так же файл `manifest.json` который необходим для работы [DllReferenceplugin](https://webpack.js.org/plugins/dll-plugin/#dllreferenceplugin).

После чего [rearguard](https://www.npmjs.com/package/rearguard) изучает зависимости вказанные в `sync_project_deps: string[]`, просматриваются зависимости в приоритете GLOBAL (которые npm link), LOCAL (которые npm i), исходя из этих данных составлется список [exernals](https://webpack.js.org/configuration/externals/#root) зависимостей.

После чего составляется `index.html` и объект для **webpack** который описывает [exernals](https://webpack.js.org/configuration/externals/#root) модули.

Для того, чтобы **webpack-dev-server** мог разрешить ссылки указанные в `index.html`, JS файлы копируюся в директрии `dll_bundle`, `lib_bundle`, которые указаны в [**contentBase**](https://webpack.js.org/configuration/dev-server/#devservercontentbase).

В процессе разработки `application` совместно с `browser_library(ies)`, последняя линкуется (`npm link`) в глобальный node_modules.

[Rearguard](https://www.npmjs.com/package/rearguard) прослушивает изменение зависимостей. И при изменении какой либо зависимости происходит пересборка всех файлов зависимостей. Берется список `sync_project_deps: string[]` и по порядку обрабатывается каждая зависимость. По факту берутся директрии указанные в **package.json (files)**, содержимое копируется в соотвествующие директории [**contentBase**](https://webpack.js.org/configuration/dev-server/#devservercontentbase). Позволяет удобно разрабатывать `application` либо `Library`, совместно с зависимостями.

Данный способ объединять части **проекта** на уровне копирования фалов, что во много раз быстрее чем привлечение webpack к обработке всего **проекта**. И это не единственное преимущество такого подхода.

## Загрузка по требованию

Загрузить по требованию можно только `browser_library`, если в настройках **проекта** указан флаг `load_on_demand: true`.

Если указан `load_on_demand: true` то данная `Library`, не добавляется в index.html, но копируется в соответсвующие директории [**contentBase**](https://webpack.js.org/configuration/dev-server/#devservercontentbase), а так же создается **`НЕ`** версионируемый файл **`deferred_module_list.ts`**.

В **`deferred_module_list.ts`** находится описание в формате `{[key: dep_name]: URL}`. Причем **dep_name** генерируется из имени зависимости и всегда имеет одинаковое значение, до тех пор пока не переименуют пакет, но в этой ситуации легко переименовать в коде все вхождения.

Используя **URL** из **`deferred_module_list.ts`** можно во времени выполнения скачать необходимый кусок кода, тем самым реализуется аналогичный функционал как и [**webpack (code spliting)**](https://webpack.js.org/guides/code-splitting/#root), только без учасия webpack, что **очень быстро**.
