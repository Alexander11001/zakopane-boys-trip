# 🏔️➡️🍺 Операция «Закопане»

Шуточный одностраничник для мужского выезда в Закопане: горы, хайк, пиво, скуфы без детей.

## Локальный запуск

```bash
# Python
python -m http.server 8080

# или Node
npx serve .
```

Откройте http://localhost:8080

## Деплой на Cloudflare Pages

1. Залейте репозиторий на GitHub (см. ниже).
2. Откройте [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Выберите репозиторий `zakopane-boys-trip`.
4. Настройки сборки:
   - **Framework preset:** None
   - **Build command:** (пусто)
   - **Build output directory:** `/` (корень)
5. **Save and Deploy** — сайт будет на `https://<имя-проекта>.pages.dev`.

### Альтернатива: Wrangler CLI

```bash
npm i -g wrangler
wrangler pages project create zakopane-boys-trip
wrangler pages deploy . --project-name=zakopane-boys-trip
```

## Структура

- `index.html` — разметка
- `css/style.css` — стили и анимации
- `js/main.js` — карусель, таймлайн, «метр пива»

## Лицензия

Для друзей. Пейте ответственно 🍺
