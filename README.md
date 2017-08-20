# Rearguard

[![Greenkeeper badge](https://badges.greenkeeper.io/Techintouch/rearguard.svg)](https://greenkeeper.io/)
![david](https://david-dm.org/Techintouch/rearguard.svg)
[![NSP Status](https://nodesecurity.io/orgs/knowledge-director/projects/cf203f22-265b-40e3-8a54-1b34506b7726/badge)](https://nodesecurity.io/orgs/knowledge-director/projects/cf203f22-265b-40e3-8a54-1b34506b7726)
[![Build Status](https://travis-ci.org/Techintouch/rearguard.svg?branch=master)](https://travis-ci.org/Techintouch/rearguard)
[![Code Climate](https://codeclimate.com/github/codeclimate/codeclimate/badges/gpa.svg)](https://codeclimate.com/github/Techintouch/rearguard)
[![Test Coverage](https://codeclimate.com/github/codeclimate/codeclimate/badges/coverage.svg)](https://codeclimate.com/github/Techintouch/rearguard/coverage)
[![Issue Count](https://codeclimate.com/github/codeclimate/codeclimate/badges/issue_count.svg)](https://codeclimate.com/github/Techintouch/rearguard)

Это пакет объединяющий существующие инструменты для сборки SPA и isomorphic приложений основанных на react или infernojs
библиотеках.

##### Мотивация
Иметь одну 100% отлаженную, версионированную конфигурацию сборки для всех front-end проектов основанных на библиотеках 
react и infernojs. 

##### Преимущества 
1. Нет необходимсоти обновлять в кажом проекте много зависимостей, достаточно обновить версию rearguard и 
переустановить пакеты
2. Возможно установить rearguard глобально и не ставить одинаковые зависимости для разработки в каждый проект, тем 
самым не увеличивая кол-во мелких файлов на диске.
3. Минимально необходима конфигурация для всех проектов, абстрагирует от сложных настроек и подводных камней 
сборочных инструментов.
4. Автоматическое генерирование конфигурационного файла, который полностью заполнен и rearguard при каждом
запуске проверяет его на правильность и если файл не верный то буду использованы настройки по умолчанию и в консоли 
будет указано в какой секции ошибка и какие настройки используются в данный момент. Этот файл подлежит версионированию.
Так же генерируется файл который не подлежит версионированию в нем настраивается сокет(host, port).
5. Простота использования, просто _**react-app --mobx**_ и буде запущен webpack-dev-server и настройки сборки буду
расширенны специфичным функционалом(декораторы, async/await в action) для работы с библиотекой mobx.

##### Установка
- Глобально: _npm i -g rearguard_
- Локально: _npm i rearguard_
