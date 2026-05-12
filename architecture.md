# Архитектура

Короткий обзор того, как устроен код. Проект следует [Feature-Sliced Design](https://feature-sliced.design/) — код разбит по назначению (слоям), и каждому слою разрешено импортировать только из слоёв ниже.

## Слои

```
src/
├── app/        сквозная инициализация: провайдеры, роутер, глобальные сторы
├── pages/      экраны на уровне роутов
├── widgets/    составные UI-блоки из фич и сущностей
├── features/   действия пользователя (одна фича = один глагол над доменом)
├── entities/   доменные модели и их базовый UI (board, task, user)
└── shared/     общие утилиты вне фреймворка: api, ui-кит, lib, config
```

Направление импортов строго сверху вниз: `app → pages → widgets → features → entities → shared`. Фича может использовать сущности и shared; сущность не может лезть внутрь фичи.

### app

- `providers/` — `QueryClientProvider`, провайдер темы, инициализация авторизации.
- `router/` — настройка `BrowserRouter`, таблица роутов, лейауты, гарды (`ProtectedRoute`, `GuestRoute`).
- `store/` — глобальные Zustand-сторы: `authStore`, `themeStore`, `boardStore` (UI-фильтр для списка досок).

### pages

По одной папке на роут: `boards`, `board`, `login`, `register`, `profile`. Страницы собирают виджеты и фичи; на них висит URL и верхнеуровневая загрузка данных.

### widgets

Переиспользуемые составные блоки: `app-header`, `board-list`, `board-column`. Они склеивают фичи и сущности в готовый кусок, который страница просто вставляет к себе.

### features

Одна фича — одно действие пользователя: `auth-login`, `board-create`, `board-rename`, `task-create`, `task-edit`, `task-delete`, `theme-toggle` и т.д. Внутри фичи живёт её форма, мутация и кусок UI, который её запускает.

### entities

`board`, `task`, `user`. Каждая сущность экспортирует свой тип, seed-данные, query-ключи и небольшой базовый UI (карточки, аватарки).

### shared

- `api/` — обёртки над `fetch` ([endpoints.ts](src/shared/api/endpoints.ts)), `QueryClient`, query-ключи, прокладка для auth-токена и MSW-моки.
- `ui/` — примитивы дизайн-системы: `button`, `input`, `modal`, `menu`, `card`, `badge`, `icon`, `form-error`.
- `lib/` — мелкие хелперы (генерация id, форматирование дат и пр.).
- `config/` — константы вроде ключа для хранения темы.

## Роутинг

`react-router-dom` v7 + `BrowserRouter`. Пути роутов лежат в одном месте — [src/app/router/routes.ts](src/app/router/routes.ts), и берутся оттуда, чтобы строковые литералы не были раскиданы по коду. Гарды оборачивают ветки дерева: protected-роуты редиректят на `/login`, guest-роуты уводят залогиненных юзеров с `/login` и `/register`.

Поскольку роутинг клиентский, прод-хосту нужен SPA-фолбэк (`/* → /index.html`) — это уже прописано в `netlify.toml`.

## Стейт

Два дополняющих друг друга стора:

- **Серверный стейт** — TanStack Query. Всё, что приходит из `/api/*` (доски, таски, текущий юзер) — это query или mutation. Ключи кэша лежат в [src/shared/api/keys.ts](src/shared/api/keys.ts).
- **Клиентский стейт** — Zustand. Три стора: `authStore` (токен + юзер, персистится), `themeStore` (light/dark/system, персистится), `boardStore` (временный UI-фильтр, не персистится).

Такое разделение не даёт серверному кэшу и UI-стейту наступать друг другу на ноги.

## API и мок-бэкенд

Приложение ходит по относительным `/api/*` через простые `fetch`-обёртки в [src/shared/api/endpoints.ts](src/shared/api/endpoints.ts). И в dev, и в продакшен-сборке эти запросы перехватывает MSW и отдаёт их из локальной мок-БД:

- [src/shared/api/mocks/handlers.ts](src/shared/api/mocks/handlers.ts) — хендлеры запросов.
- [src/shared/api/mocks/db.ts](src/shared/api/mocks/db.ts) — БД в памяти, зеркалится в `localStorage` под ключом `mock-db-v2`.
- [public/mockServiceWorker.js](public/mockServiceWorker.js) — скрипт воркера, Vite копирует его в `dist/`.

На границе — обычный `fetch`. Если потом понадобится настоящий бэкенд, достаточно убрать регистрацию воркера в [src/main.tsx](src/main.tsx) — больше ничего трогать не придётся.

## Авторизация

Bearer-токен и текущий юзер хранятся в `authStore` и персистятся через `persist` из Zustand. Геттер токена прокидывается в api-модуль на старте в [src/main.tsx](src/main.tsx), чтобы хелперы эндпоинтов не импортировали стор напрямую — так `shared/api` не зависит от `app/store`.

## Стили и темы

Tailwind CSS v4. Dark-режим через класс. Маленький инлайн-скрипт в [index.html](index.html) читает сохранённую тему из `localStorage` до того, как смонтируется React — первая отрисовка сразу в нужной теме, без мигания.

## Формы

Везде React Hook Form + Zod-резолверы. Схемы лежат рядом с фичей, которая их использует; общий рендер ошибок — через `shared/ui/form-error`.

## Drag-and-drop

`@dnd-kit` для перетаскивания тасок между колонками и сортировки внутри колонки. Виджет колонки владеет `SortableContext`, таски — сортируемые элементы.
