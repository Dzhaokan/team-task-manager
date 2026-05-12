# team-task-manager

Небольшой kanban-таск-менеджер для личных и домашних дел, разнесённых по нескольким доскам. SPA на фронте, бэкенд замокан.

## Стек

- React 18 + TypeScript
- Vite
- React Router v7
- TanStack Query (серверное состояние) + Zustand (клиентское состояние)
- React Hook Form + Zod
- Tailwind CSS v4
- @dnd-kit для drag-and-drop
- MSW для мокового бэкенда (данные хранятся в `localStorage`)

Структура проекта построена по [Feature-Sliced Design](https://feature-sliced.design/). Послойный разбор — в [architecture.md](architecture.md).

## Запуск

```bash
npm install
npm run dev
```

При первой загрузке MSW регистрирует service worker и засеивает моковую БД в `localStorage`.

## Тестовые аккаунты

В сидах два пользователя, пароль у обоих одинаковый:

- `anna@home.local` / `password123`
- `mike@home.local` / `password123`

Можно зарегистрировать и новый аккаунт — он точно так же ляжет в `localStorage`.

## Скрипты

| Скрипт | Что делает |
| --- | --- |
| `npm run dev` | Vite dev server c HMR |
| `npm run build` | Тайпчек и продовый бандл в `dist/` |
| `npm run preview` | Локально поднимает собранный бандл |
| `npm run lint` | ESLint по проекту |
| `npm run format` | Prettier write |

## Моковый бэкенд

Реального сервера нет. Все вызовы `/api/*` перехватывает MSW и обрабатывает поверх небольшой in-memory БД, которая зеркалится в `localStorage`. Воркер работает и в dev, и в проде — задеплоенное приложение полностью функционально и изолированно по браузерам.

Если очистить данные сайта, моковая БД пересоздаётся при следующей загрузке.

## Деплой

В репозитории лежит [`netlify.toml`](netlify.toml) с командой сборки, publish dir (`dist`), версией Node и SPA fallback редиректом. Достаточно подключить репо к Netlify — конфиг подхватится сам.
