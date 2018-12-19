# Библиотека ориентированный дизайн

## Основные понятия

**Проект** - директория которая содержит **исходный код, конфигурационные файлы, дистрибуцию**. Проект может быть разных типов: dynamic load library (DLL), browser_library, node_library, target_project, и их комбинации DLL + browser_library + node_library, таким образом можно реализовать изоморфный функционал с уникальными зависимостями, которые подключаются как DLL.

- **DLL** - реализует только файл с информацией для составления dll_bundle при помощи DLLPlugin.
- **browser_library** - реализует функционал который используется только в браузере, может иметь собственный dll_bundle с уникальными для этой библиотеки зависимостями, которые нет смысла делать общими. Данный тип проекта имеет подтип load_on_demand. В этом проекте могут реализовываться: UI компоненты, бизнес логика, утилиты и прочее.
- **load_on_demand** - browser_library которая отмечена таким параметром не будет автоматически подключаться в index.html, вместо этого будет формироваться src/deferred_module_list.ts в этом файле будет информация о том какие модули доступны для загрузки по требованию и публичные пути до этих модулей.
- **node_library** - реализует функционал который используется только на сервере.
- **target_project** - реализует финальный продукт. Ничего не экспортирует, только импортирует, может иметь собственный DLL. Результатом сборки такого проекта будет директрис dist со всеми необходимыми файлами, в том числе и подключенных DLL и browser_library.

## Точки входа

- **DLL** - по умолчанию точка входа (dll_entry) src/vendors.ts.
- **browser_library** - по умолчанию точка экспорта src/lib_exports.ts. Точка входа для разработки в браузере (lib_entry) src/index.tsx.
- **node_library** - по умолчанию точка экспорта src/lib_exports.ts.
- **target_project** - по умолчанию точка (entry) src/index.tsx.
  Любую точку входа можно изменить в настройках которые находятся в **package.json в поле rearguard**.

## Примеры реализации

- [**DLL**](https://gitlab.com/mitya-borodin/base-code/tree/master/packages/vendors) - пакет содержит зависимости для разработки браузерных пакетов.
- [**browser_library**](https://gitlab.com/mitya-borodin/base-code/tree/master/packages/front) - проект содержит классы и компоненты для клиентской разработки.
- **browser_library + node_library ( [**utils**](https://gitlab.com/mitya-borodin/base-code/tree/master/packages/utils), [**isomorphic**](https://gitlab.com/mitya-borodin/base-code/tree/master/packages/isomorphic) )** - эти два проекта используются как на клиентской стороне так и на серверной.
- [**node_library**](https://gitlab.com/mitya-borodin/base-code/blob/master/packages/back/package.json) - проект содержит классы и интерфейсы для серверной разработки.
- [**browser_library ( load_on_demand )**](https://gitlab.com/mitya-borodin/base-code/tree/master/packages/deferred_module_test) - это пример проекта с отложенной загрузкой.
- [**target_project**](https://gitlab.com/home-tracker/front-end) - пример проекта который реализует непосредственно продукт.

## Общее описание

Сборка проекта всегда изолированна от всех остальных частей приложения, имеется в виду, что webpack всегда собирает код только из src. Все остальные части приложения подключаются непосредственно в index.html. Так же и с browser_library, она может зависеть от других browser_library, но webpack собирает только тот код который находится в src, а код зависимых browser_library подключается в index.html.
В результате мы получаем систему разработки ПО, в которой отдельные части системы могут быть: реализованы независимыми командами, подключены в index.html без участия **webpack**, загружены по требованию во времени исполнения.

### Реализация независимыми командами

Возможность разделить систему на отдельные предметные области, определить связи между ними. После чего разделить основное техническое задание на под задания и раздать отдельным командам, в результате получить инкапсулированные реализации, которые применяются в target_project. Позволяет горизонтально масштабировать команду.

### Подключение в index.html без участия webpack

Мы получаем данные из assets.json каждого browser_library и manifest.json каждого DLL из закисимостей описанных в sync_project_deps: string[]. После чего можно составить index.html и список externals. Процесс получения данных тут не описывается.
Подключение зависимостей таких как DLL, browser_library происходит непосредственно в index.html ( через html-webpack-plugin ). Для удовлетворения ссылок в index.html копируются файлы зависимостей в contentBase (dll_bundle, lib_bundle) для webpack-dev-server.
В процессе разработки target_project совместно с browser_library(ies), последняя линкуется (npm link) в глобальный node_modules.
При изменении файлов **зависимого модуля**, внутри в директорий описанных в **package.json (files)**, копируются эти директории в соответсвующие директории в локальном node_modules, после чего dll_bundle и lib_bundle копируются в target_project где используются как contentBase (dll_bundle, lib_bundle) для webpack-dev-server.
Позволяет реализовывать бесконечные по объему приложения с постоянной скоростью сборки. Так как приложение будет состоять из набора библиотек, по этому дизайн и называется библиотека ориентированный.

### Загрузка по требованию

Так как у нас имеется **browser_library with load_on_demand** мы можем выполнить загрузку такого модуля во времени выполнения, данные для составления файла **deferred_module_list.ts**, те же самые, что и для index.html. При установленном флаге **load_on_demand** модуль не добавляется в index.html, а добавляется в **deferred_module_list.ts**.
Позволяет реализовывать бесконечные по объему приложения с постоянной скоростью сборки. Кроме того, с постоянной скоростью загрузки страницы в первый раз, так как при «путешествии» по приложению необходимые участки будут догружаться.