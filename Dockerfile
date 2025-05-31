# Этап сборки
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем файлы зависимостей сначала для кэширования
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN if [ -f yarn.lock ]; then \
      yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then \
      npm install --legacy-peer-deps; \
    elif [ -f pnpm-lock.yaml ]; then \
      yarn global add pnpm && pnpm i --frozen-lockfile --strict-peer-dependencies=false; \
    else \
      echo "Lockfile not found." && exit 1; \
    fi

# Копируем остальные файлы и собираем приложение
COPY . .
RUN npm run build

# Этап запуска (используем lightweight HTTP-сервер)
FROM node:18-alpine

WORKDIR /app

# Устанавливаем serve для раздачи статики
RUN npm install -g serve

# Копируем собранное приложение из builder
COPY --from=builder /app/dist /app/dist

# Указываем порт и запускаем сервер
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
