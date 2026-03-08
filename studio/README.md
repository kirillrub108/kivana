# Design Studio

Сайт дизайн-студии на 11ty (Eleventy) + vanilla CSS + vanilla JS.

## Структура проекта

```
studio/
├── src/
│   ├── _includes/
│   │   ├── layouts/          # Шаблоны страниц (base, page, case)
│   │   └── partials/         # Переиспользуемые блоки (header, footer, cta)
│   ├── _data/
│   │   ├── site.json         # Настройки сайта (название, контакты, команда)
│   │   └── cases.json        # Данные кейсов портфолио
│   ├── assets/
│   │   ├── css/              # Стили: токены, reset, типографика, компоненты
│   │   ├── js/               # Скрипты: навигация, анимации, фильтры
│   │   └── fonts/            # Шрифты (загружаются с Google Fonts)
│   ├── work/                 # Портфолио и шаблон кейсов
│   ├── index.njk             # Главная
│   ├── services.njk          # Услуги
│   ├── about.njk             # О нас
│   └── contact.njk           # Контакты
├── .eleventy.js              # Конфигурация 11ty
└── package.json
```

## Запуск локально

```bash
cd studio
npm install
npm run dev
```

Сайт откроется на `http://localhost:8080`.

## Добавление нового кейса

Откройте `src/_data/cases.json` и добавьте объект в массив:

```json
{
  "slug": "url-slug",
  "title": "Название проекта",
  "client": "Имя клиента",
  "category": "Брендинг | Веб | UI/UX",
  "year": "2025",
  "color": "#hex-цвет для плейсхолдера",
  "brief": "Краткое описание для карточки",
  "challenge": "Описание задачи",
  "solution": "Описание решения",
  "tags": ["Тег 1", "Тег 2"],
  "metrics": [
    { "label": "Метрика", "value": "Значение" }
  ]
}
```

Страница `/work/url-slug/` создастся автоматически при сборке.

## Деплой на Cloudflare Pages

- Build command: `npm run build`
- Output directory: `_site`
- Node version: 18+

## Настройки сайта

Файл `src/_data/site.json`:

- `name` — название студии (отображается в хедере и футере)
- `tagline` — слоган
- `telegram` — ссылка на Telegram
- `email` — email для связи
- `telegramHandle` — отображаемый handle
- `team` — массив участников команды (name, role, bio)
