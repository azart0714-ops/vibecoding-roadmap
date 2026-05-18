# L7: Deployment и Production

## 🎯 Цель уровня

Деплоить приложения в production и поддерживать их работоспособность. Превратить код в живой продукт.

**Ключевой принцип**: Production-ready с первого дня.

**Философия уровня**: Если не в production — не существует.

---

## 🧠 Ключевые концепции

### 1. Vercel Deployment
Автоматический деплой из Git с preview для каждого PR.

### 2. CI/CD Pipelines
Автоматическое тестирование и деплой при каждом коммите.

### 3. Мониторинг и логирование
Отслеживание ошибок и производительности в реальном времени.

### 4. Performance Optimization
Core Web Vitals и скорость загрузки для лучшего UX.

### 5. SEO и метатеги
Оптимизация для поисковых систем и социальных сетей.

### 6. Security в Production
Защита API, данных и пользователей.

### 7. Database в Production
Connection pooling, backups и миграции.

### 8. Rollback Strategy
Быстрый откат при проблемах.

---

## 📚 Теоретическая база

### Раздел 1: Vercel Deployment

**Vercel** — это не просто хостинг, а специализированная облачная платформа и "золотой стандарт" для развертывания приложений Next.js. Созданная авторами фреймворка (компанией Vercel), платформа обеспечивает максимально глубокую нативную интеграцию со всеми архитектурными фичами Next.js.

#### 1.1. Почему Vercel — Золотой стандарт для Next.js

1. **Zero-Configuration Deployment**:
   Вам не нужно писать Dockerfile, настраивать Nginx, Webpack/Turbopack или конфигурировать CI/CD пайплайны. Vercel автоматически распознает проект Next.js, оптимизирует сборку, распределяет статические файлы по CDN, а API-роуты упаковывает в Serverless/Edge функции автоматически.
2. **Мгновенные Preview Deployments (Ветвление фронтенда)**:
   При отправке любого коммита в любую ветку Git (GitHub, GitLab, Bitbucket), Vercel за пару секунд разворачивает уникальную preview-версию вашего приложения с постоянным URL-адресом. Это идеальный компаньон для ИИ-разработки: ИИ пишет фичу в ветке → Vercel дает готовую ссылку для визуального тестирования.
3. **Edge Network & Edge Middleware**:
   Глобальная распределенная сеть доставки контента (CDN) от Vercel разворачивает ваше приложение "на границе" (Edge) сети, в шаговой доступности от пользователя. Использование `Edge Middleware` позволяет выполнять роутинг, A/B-тестирование, гео-персонализацию и проверку авторизации за миллисекунды прямо перед отдачей страницы.
4. **Serverless & Edge Functions**:
   Все API-роуты (`/app/api/...`) компилируются в масштабируемые бессерверные функции AWS Lambda (Serverless) или Edge Runtime (V8 Engine). Они не требуют администрирования, запускаются по запросу и масштабируются от 0 до десятков тысяч одновременных запросов мгновенно.
5. **Real-time Analytics & Speed Insights**:
   Встроенный трекинг реального пользовательского опыта (Real User Monitoring - RUM) собирает данные о Core Web Vitals (LCP, FID, CLS, INP) прямо в реальном времени. ИИ-агенты могут использовать эти метрики для точечной оптимизации производительности и UX.
6. **Smart Image Optimization**:
   Компонент Next.js `<Image>` на Vercel автоматически конвертирует, сжимает и кэширует изображения в современных форматах (AVIF, WebP) под разные разрешения экранов "на лету" без нагрузки на ваш бэкенд.

#### 1.2. Сравнение платформ деплоя

| Платформа | Free Tier | Цена | Регионы | Особенности | Рекомендация |
|-----------|-----------|------|---------|-------------|--------------|
| **Vercel** | ✅ 100GB bandwidth | $20/мес Pro | Global Edge | Zero-config Next.js, Preview deployments, Analytics | ⭐ Лучший для Next.js |
| **Netlify** | ✅ 100GB bandwidth | $19/мес Pro | Global CDN | Forms, Identity, Split testing | Хорош для статики |
| **Railway** | ❌ $5 trial | $5/мес Hobby | 4 региона | PostgreSQL, Redis, MCP интеграция | ⭐ Лучший для backend |
| **Render** | ✅ 750 часов | $7/мес | 3 региона | PostgreSQL, Redis, Cron jobs | Альтернатива Railway |
| **Fly.io** | ✅ 3 VMs | $0.02/час | 30+ регионов | Близко к пользователям, Docker | Для глобальных приложений |
| **Heroku** | ❌ Нет free | $5/мес | 2 региона | Старая платформа, дорого | Не рекомендуется |

**Выбор платформы по сценарию**:

1. **Next.js приложение**: Vercel (zero-config, лучшая интеграция)
2. **Backend API + БД**: Railway (простота, MCP, $5/мес)
3. **Статический сайт**: Vercel или Netlify (оба отличны)
4. **Глобальное приложение**: Fly.io (30+ регионов)
5. **Monorepo**: Vercel (Turborepo support)

**Комбинированная стратегия** (рекомендуется):
- **Frontend**: Vercel (Next.js)
- **Backend & Database**: Neon (Serverless Postgres) или Supabase / Railway
- **Преимущества**: Лучшее из обоих миров, разделение concerns, максимальная автономность разработки при помощи ИИ.

📖 **Ресурсы**:
- [Vercel Next.js Guide](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Preview Deployments](https://vercel.com/docs/deployments/preview-deployments)
- [Vercel Edge Network](https://vercel.com/docs/edge-network)
- [Vercel Image Optimization](https://vercel.com/docs/image-optimization)

---

### Раздел 2: CI/CD Pipelines

**GitHub Actions** — автоматизация workflow:
- Тестирование на каждый push
- Линтинг и type checking
- Build verification
- Автоматический деплой
- Scheduled tasks

**Типичный CI/CD flow**:
1. Push в feature branch
2. Запуск тестов и линтинга
3. Preview deployment создается
4. Code review
5. Merge в main
6. Production deployment

**Альтернативы**: GitLab CI, CircleCI, Jenkins

📖 **Ресурсы**:
- [GitHub Actions](https://docs.github.com/en/actions)
- [Vercel GitHub Integration](https://vercel.com/docs/deployments/git/vercel-for-github)

---

### Раздел 3: Мониторинг и логирование

**Sentry** — error tracking:
- Автоматический захват ошибок
- Source maps для читаемых stack traces
- Performance monitoring
- Release tracking
- Alerts в Slack/Email

**Vercel Analytics** — web analytics:
- Real User Monitoring (RUM)
- Web Vitals tracking
- Audience insights
- Privacy-friendly (без cookies)

**Vercel Speed Insights** — performance monitoring:
- Core Web Vitals в реальном времени
- Per-page metrics
- Historical data
- Alerts при деградации

**LogSnag** — event tracking:
- Timeline событий
- Real-time notifications
- Custom events
- Integrations

📖 **Ресурсы**:
- [Sentry](https://docs.sentry.io/)
- [Vercel Analytics](https://vercel.com/docs/analytics)
- [Vercel Speed Insights](https://vercel.com/docs/speed-insights)

---

### Раздел 4: Performance Optimization

**Core Web Vitals** — ключевые метрики:
- **LCP** (Largest Contentful Paint) — скорость загрузки контента (< 2.5s)
- **FID** (First Input Delay) — отзывчивость (< 100ms)
- **CLS** (Cumulative Layout Shift) — визуальная стабильность (< 0.1)
- **INP** (Interaction to Next Paint) — новая метрика отзывчивости

**Image Optimization**:
- Next.js Image component с автоматической оптимизацией
- WebP/AVIF форматы
- Lazy loading
- Responsive images
- Blur placeholders

**Font Optimization**:
- next/font для автоматической оптимизации
- Font subsetting
- Preloading критичных шрифтов
- Variable fonts

**Code Splitting**:
- Automatic code splitting в Next.js
- Dynamic imports для тяжелых компонентов
- Route-based splitting
- Component-level splitting

**Caching Strategy**:
- Static Generation где возможно
- ISR (Incremental Static Regeneration)
- CDN caching
- Browser caching headers

📖 **Ресурсы**:
- [Web.dev Core Web Vitals](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

### Раздел 5: SEO Optimization

**Metadata API** (Next.js 14+):
- Static metadata для страниц
- Dynamic metadata из данных
- Open Graph для социальных сетей
- Twitter Cards
- Structured data (JSON-LD)

**Sitemap**:
- Автоматическая генерация
- Dynamic routes включены
- Priority и changeFrequency
- Submission в Google Search Console

**Robots.txt**:
- Правила для поисковых ботов
- Disallow для приватных страниц
- Sitemap reference

**Performance = SEO**:
- Core Web Vitals влияют на ранжирование
- Mobile-first indexing
- HTTPS обязателен
- Structured data для rich snippets

📖 **Ресурсы**:
- [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)

---

### Раздел 6: Security в Production

**Environment Variables**:
- Разные ключи для dev/staging/production
- NEXT_PUBLIC_ только для публичных данных
- Никогда не коммить .env файлы
- Rotation ключей периодически

**Security Headers**:
- X-Frame-Options (защита от clickjacking)
- X-Content-Type-Options (MIME type sniffing)
- Referrer-Policy
- Content-Security-Policy
- Strict-Transport-Security (HSTS)

**Rate Limiting**:
- Защита API от abuse
- Per-user limits
- Per-IP limits
- Sliding window algorithm

**Input Validation**:
- Zod schemas для валидации
- Sanitization пользовательского ввода
- SQL injection prevention (Prisma)
- XSS prevention

**CORS Configuration**:
- Whitelist разрешенных origins
- Credentials handling
- Preflight requests

📖 **Ресурсы**:
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Security Headers](https://securityheaders.com/)
- [Upstash Rate Limiting](https://upstash.com/docs/redis/features/ratelimiting)

---

### Раздел 7: Database в Production

**Connection Pooling**:
- Ограничение количества соединений
- Reuse существующих connections
- Prisma connection pooling
- Serverless-friendly подход

**Database Backups**:
- Автоматические ежедневные бэкапы
- Point-in-time recovery
- Тестирование восстановления
- Offsite storage

**Миграции в Production**:
- Тестирование на staging
- Rollback plan
- Zero-downtime migrations
- Prisma migrate deploy

**Database Monitoring**:
- Query performance
- Connection pool usage
- Slow query log
- Disk space monitoring

📖 **Ресурсы**:
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Neon Branching](https://neon.tech/docs/introduction/branching)

---

### Раздел 8: Monitoring и Alerts

**Uptime Monitoring**:
- Проверка доступности каждые 1-5 минут
- Multi-location checks
- SSL certificate monitoring
- Response time tracking

**Сервисы**:
- **UptimeRobot** — бесплатный, 50 мониторов
- **Better Uptime** — продвинутый, красивые status pages
- **Pingdom** — enterprise решение
- **Vercel Monitoring** — встроенный

**Performance Monitoring**:
- Real User Monitoring (RUM)
- Synthetic monitoring
- API response times
- Database query times

**Error Alerts**:
- Instant notifications в Slack/Email/SMS
- Error grouping и deduplication
- Severity levels
- Assignment и resolution tracking

📖 **Ресурсы**:
- [UptimeRobot](https://uptimerobot.com/)
- [Better Uptime](https://betteruptime.com/)
- [Sentry Alerts](https://docs.sentry.io/product/alerts/)

---

### Раздел 9: Rollback Strategy

**Vercel Rollback**:
- Instant rollback к любому предыдущему деплою
- Через Dashboard или CLI
- Atomic deployments (все или ничего)
- Preview перед rollback

**Git Revert**:
- Откат коммита через git revert
- Сохранение истории
- Автоматический re-deploy

**Database Rollback**:
- Сложнее чем code rollback
- Требует планирования миграций
- Backward-compatible changes
- Data migrations отдельно от schema

**Rollback Checklist**:
1. Identify проблему
2. Notify команду
3. Rollback code
4. Verify fix
5. Investigate root cause
6. Plan proper fix

📖 **Ресурсы**:
- [Vercel Rollbacks](https://vercel.com/docs/deployments/rollbacks)

---

### Раздел 10: Production Checklist

**Pre-launch Checklist**:

**Безопасность**:
- [ ] Environment variables настроены для production
- [ ] .env файлы в .gitignore
- [ ] Security headers настроены
- [ ] Rate limiting включен на API routes
- [ ] CORS правильно настроен
- [ ] Input validation на всех endpoints

**Performance**:
- [ ] Images оптимизированы (WebP/AVIF)
- [ ] Fonts оптимизированы (next/font)
- [ ] Code splitting настроен
- [ ] Core Web Vitals в зеленой зоне
- [ ] Lighthouse score > 90
- [ ] Mobile performance проверен

**SEO**:
- [ ] Metadata настроены на всех страницах
- [ ] Sitemap.xml создан и submitted
- [ ] Robots.txt настроен
- [ ] Open Graph images добавлены
- [ ] Structured data добавлены
- [ ] Google Search Console настроен

**Мониторинг**:
- [ ] Sentry настроен и тестирован
- [ ] Vercel Analytics установлен
- [ ] Uptime monitoring настроен
- [ ] Error alerts настроены
- [ ] Performance alerts настроены
- [ ] Status page создан (если нужен)

**Database**:
- [ ] Connection pooling настроен
- [ ] Automatic backups включены
- [ ] Миграции протестированы на staging
- [ ] Indexes оптимизированы
- [ ] Query performance проверен

**Deployment**:
- [ ] CI/CD pipeline настроен
- [ ] Preview deployments работают
- [ ] Production domain настроен
- [ ] SSL certificate активен
- [ ] Rollback plan документирован

---

## ⚠️ Частые ошибки

### 1. Деплой без тестирования
**Проблема**: Баги попадают в production.
**Решение**: Всегда тестируй на preview deployment.

### 2. Отсутствие мониторинга
**Проблема**: Узнаешь о проблемах от пользователей.
**Решение**: Настрой Sentry и uptime monitoring с первого дня.

### 3. Игнорирование Core Web Vitals
**Проблема**: Плохой UX и низкий SEO.
**Решение**: Мониторь метрики и оптимизируй.

### 4. Нет rollback плана
**Проблема**: Паника при проблемах в production.
**Решение**: Знай как откатиться за 1 минуту.

### 5. Environment variables в коде
**Проблема**: Секреты в Git репозитории.
**Решение**: Используй .env.local и Vercel Dashboard.

### 6. Отсутствие database backups
**Проблема**: Потеря данных при сбое.
**Решение**: Автоматические бэкапы и тестирование восстановления.

### 7. Не настроены security headers
**Проблема**: Уязвимости для атак.
**Решение**: Настрой headers в next.config.js.

### 8. Прямой деплой в production
**Проблема**: Нет возможности проверить изменения.
**Решение**: Используй staging environment.

---

## 💡 Pro Tips

### 1. Используй Preview Deployments
Каждый PR получает свой URL — тестируй перед merge.

### 2. Мониторь Core Web Vitals постоянно
Они влияют на SEO и конверсию — следи за трендами.

### 3. Настрой alerts сразу
Узнавай о проблемах до пользователей — instant notifications.

### 4. Тестируй на staging
Никогда не деплой напрямую в production — staging = production copy.

### 5. Делай rollback план
Знай как откатиться за 1 минуту — документируй процесс.

### 6. Автоматизируй всё
CI/CD должен делать всю рутину — ты только merge PR.

### 7. Используй feature flags
Деплой код без активации фичи — включай постепенно.

### 8. Мониторь расходы
Vercel, Sentry, databases — следи за billing alerts.

---

## ✅ Чек-лист освоения L7

### Deployment
- [ ] Задеплоил приложение на Vercel
- [ ] Настроил кастомный домен с SSL
- [ ] Настроил environment variables для всех окружений
- [ ] Понимаю как работают preview deployments
- [ ] Умею делать rollback

### CI/CD
- [ ] Настроил GitHub Actions для тестов
- [ ] Автоматические тесты запускаются на каждый PR
- [ ] Линтинг и type checking в pipeline
- [ ] Автоматический деплой в production при merge
- [ ] Понимаю как работает весь flow

### Мониторинг
- [ ] Настроил Sentry для error tracking
- [ ] Настроил Vercel Analytics
- [ ] Настроил uptime monitoring
- [ ] Получаю alerts при ошибках
- [ ] Мониторю Core Web Vitals

### Performance
- [ ] Core Web Vitals в зеленой зоне (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- [ ] Images оптимизированы через next/image
- [ ] Fonts оптимизированы через next/font
- [ ] Code splitting настроен для тяжелых компонентов
- [ ] Lighthouse score > 90

### SEO
- [ ] Metadata настроены на всех страницах
- [ ] Sitemap.xml создан и работает
- [ ] Open Graph images добавлены
- [ ] Robots.txt настроен
- [ ] Google Search Console подключен

### Security
- [ ] Security headers настроены
- [ ] Rate limiting включен на API
- [ ] Environment variables защищены
- [ ] Input validation на всех endpoints
- [ ] CORS правильно настроен

### Database
- [ ] Connection pooling настроен
- [ ] Автоматические backups включены
- [ ] Миграции тестируются на staging
- [ ] Query performance оптимизирован
- [ ] Monitoring database metrics

---

## 🔄 Раздел 8: GitHub Actions — Полный CI/CD

### 8.1. Базовый пайплайн для Next.js

Создайте `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test-and-build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci  # Строже npm install — использует package-lock.json

      - name: Type check
        run: npx tsc --noEmit

      - name: Lint
        run: npm run lint

      - name: Run tests
        run: npm run test
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL_TEST }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}

      - name: Build
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### 8.2. Deploy только после успешных тестов

```yaml
  deploy-production:
    needs: test-and-build  # Ждём успешного теста!
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'  # Только ветка main

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 8.3. Автоматический аудит безопасности

```yaml
  security-audit:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: npm audit
        run: npm audit --audit-level=high  # Провалить при high/critical уязвимостях

      - name: Check for secrets in code
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: main
```

📖 **Ресурсы**:
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Vercel GitHub Action](https://github.com/amondnet/vercel-action)

---

## 🔒 Раздел 9: Production Security — Детальная настройка

### 9.1. Security Headers в next.config.js

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'  // Защита от clickjacking
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'  // Защита от MIME-sniffing
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src * blob: data:; connect-src *"
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

**Проверка**: Скопируйте URL на [securityheaders.com](https://securityheaders.com). Цель — оценка A или A+.

### 9.2. Rate Limiting с Upstash Redis

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 10 запросов в 10 секунд
export const authRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  prefix: 'ratelimit:auth',
});

// Middleware для API routes
export async function withRateLimit(
  req: Request,
  identifier: string,
  limiter = authRatelimit
) {
  const { success, limit, reset, remaining } = await limiter.limit(identifier);

  if (!success) {
    return new Response('Too Many Requests', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
      },
    });
  }
  return null;  // Запрос разрешён
}
```

### 9.3. Автоматические обновления через Dependabot

Создайте `.github/dependabot.yml`:
```yaml
version: 2
updates:
  - package-ecosystem: npm
    directory: '/'
    schedule:
      interval: weekly
    reviewers:
      - your-github-username
    labels:
      - dependencies
    open-pull-requests-limit: 10
```

Dependabot автоматически создаёт PR с обновлениями зависимостей каждую неделю.

📖 **Ресурсы**:
- [SecurityHeaders.com](https://securityheaders.com/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Upstash Rate Limit](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)

---

## 🧪 Раздел 10: Принципы тестирования и Пирамида

Автоматическое тестирование при разработке с ИИ играет критическую роль: тесты служат второй, более строгой спецификацией проекта и страхуют от регрессионных багов, которые ИИ-агенты могут случайно внести при оптимизациях.

### 10.1. Почему тесты критичны: 1 час = 10 часов сэкономленного дебага
* **Без тестов**: Каждое изменение в коде требует 10–30 минут ручной проверки. Вам нужно запустить сервер, пройтись по страницам, заполнить формы, кликнуть на кнопки. При этом велик риск упустить скрытый баг в соседнем модуле, о котором вы узнаете только от разгневанных пользователей в production.
* **С тестами**: Написание теста занимает 15–30 минут. Но автопроверка запускается за 10 секунд и мгновенно гарантирует, что все критические сценарии работают корректно. Любой баг, внесенный ИИ, обнаруживается на этапе коммита.

### 10.2. Пирамида тестирования
Для оптимального расхода ресурсов и максимальной надежности используйте классическое распределение тестов:

```
           ▲ E2E Tests (5-10%)
          ▲▲▲ Integration (15-20%)
         ▲▲▲▲▲ Unit Tests (70-80%)
```

1. **Unit (Модульные) тесты (70–80%)**: Тестируют изолированные чистые функции, утилиты, хелперы, хуки или небольшие компоненты. Выполняются мгновенно (5–10 мс).
2. **Integration (Интеграционные) тесты (15–20%)**: Проверяют корректность совместной работы нескольких модулей, например, форму авторизации вместе с валидацией и сетевым запросом к API.
3. **E2E (Сквозные) тесты (5–10%)**: Имитируют действия реального пользователя в реальном браузере (кликнуть, ввести текст, дождаться ответа). Самые надежные, но медленные и дорогие в поддержке.

### 10.3. Современный каталог инструментов
* **Vitest**: Современный, ультрабыстрый фреймворк для модульного тестирования, отлично совместимый с Vite и Next.js.
* **MSW (Mock Service Worker)**: Перехватывает сетевые запросы приложения на уровне браузера/сервера и возвращает моковые данные. Позволяет тестировать фронтенд в полной изоляции без реального бэкенда.
* **Playwright**: Лучший современный инструмент для E2E тестирования с поддержкой авто-ожидания элементов, записи видео, скриншотов и удобным UI-режимом отладки.
* **Storybook**: Позволяет верстать, тестировать и документировать UI-компоненты в изоляции от бизнес-логики приложения.
* **C8 / Istanbul**: Инструменты для анализа покрытия кода тестами (Code Coverage). Стремитесь к покрытию 80%+ для критических модулей.

### 10.4. Вердикт Railway.app для Staging окружения
При развертывании инфраструктуры для тестирования (Staging) встает вопрос выбора платформы. Railway.app — одно из лучших решений.
* **Вердикт**: **Это лучшие $5 в месяц, которые можно потратить на инфраструктуру.**
* **Плюсы**: Потрясающий визуальный Canvas UI для управления архитектурой, 650+ готовых шаблонов (PostgreSQL, Redis, ClickHouse, Docker), полноценные среды (Environments: prod/dev), автоматические сборки из GitHub.
* **Минусы**: Отсутствие полностью бесплатного тарифа навсегда, обязательное требование наличия иностранной банковской карты для верификации и оплаты услуг.

---

## 🎓 Практические задания

### Задание 1: CI/CD Pipeline (2 часа)
**Цель**: Настроить автоматическое тестирование и деплой.

**Шаги**:
1. Создайте `.github/workflows/ci.yml` с базовыми шагами
2. Добавьте все секреты в GitHub Settings → Secrets
3. Сделайте коммит и убедитесь, что Actions запустился
4. Намеренно сломайте тест — убедитесь, что пайплайн красный
5. Настройте автодеплой на Vercel при merge в main

**Критерий завершения**: PR запускает тесты, только успешный merge деплоится в production.

### Задание 2: Security Headers (30 мин)
**Цель**: Добиться оценки A+ на securityheaders.com.

**Шаги**:
1. Добавьте все security headers в `next.config.js`
2. Задеплойте на Vercel
3. Проверьте на securityheaders.com
4. Настройте CSP без `unsafe-eval` (требует настройки nonce)
5. Добавьте Permissions-Policy для ограничения браузерных API

**Критерий завершения**: Оценка A+ на securityheaders.com.

### Задание 3: Rate Limiting (1 час)
**Цель**: Защитить чувствительные API endpoints от abuse.

**Шаги**:
1. Создайте Upstash Redis на upstash.com
2. Реализуйте rate limiting для `/api/auth/*`
3. Добавьте разные лимиты для разных endpoints
4. Протестируйте: запустите 20 запросов за 5 секунд
5. Убедитесь, что 429 возвращается с правильными заголовками

**Критерий завершения**: Endpoint отказывает при превышении лимита.

### Задание 4: Preview Deployments (1 час)
**Цель**: Настроить preview-среду для каждого PR.

**Шаги**:
1. Убедитесь, что Vercel подключён к GitHub репозиторию
2. Создайте feature ветку и сделайте изменение
3. Откройте PR — убедитесь, что Vercel создал preview URL
4. Настройте preview переменные окружения (отдельная БД!)
5. Поделитесь preview URL с "заказчиком" для ревью

**Критерий завершения**: Каждый PR имеет уникальный preview URL.

---

## ⚠️ Частые ошибки

### 1. Деплоят без тестов
**Проблема**: Баги в production, ручная проверка перед каждым деплоем.  
**Решение**: CI/CD обязателен с первого дня. Даже 3 базовых теста лучше, чем никаких.

### 2. Хранят секреты в коде или комментариях
**Проблема**: Утечка API ключей через публичный репозиторий.  
**Решение**: Все секреты — в GitHub Secrets. Регулярно сканируйте репозиторий через TruffleHog.

### 3. Не устанавливают лимиты расходов в Railway/Vercel
**Проблема**: Зацикленный CI/CD или DDoS может привести к счёту в $1000.  
**Решение**: Всегда устанавливайте бюджетный лимит и оповещения.

### 4. Деплоят напрямую в production без staging
**Проблема**: Непроверенный код идёт к реальным пользователям.  
**Решение**: Staging = обязательный шаг. Vercel Preview Deployments решают это из коробки.

### 5. Не настраивают Security Headers
**Проблема**: Сайт уязвим к XSS, clickjacking, MIME-sniffing атакам.  
**Решение**: Добавьте security headers в `next.config.js`. 30 минут работы — закрывает класс уязвимостей.

### 6. Не используют connection pooling для БД
**Проблема**: В Serverless функциях каждый запрос открывает новое подключение к БД → исчерпание лимитов.  
**Решение**: Используйте Prisma Accelerate или Supabase Supavisor для connection pooling.

### 7. Забывают про database migrations в CI
**Проблема**: Миграции запускаются вручную или не запускаются вовсе.  
**Решение**: Добавьте `prisma migrate deploy` в CI/CD пайплайн перед деплоем приложения.

---

## 💡 Pro Tips

### 1. Кешируйте node_modules в GitHub Actions
Добавьте `cache: 'npm'` в `setup-node@v4` — это сократит время CI с 3 минут до 40 секунд.

### 2. Matrix Testing для нескольких версий Node
```yaml
strategy:
  matrix:
    node-version: [18, 20, 22]
```
Убедитесь, что код работает на всех поддерживаемых версиях.

### 3. Concurrency Groups для отмены устаревших запусков
```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```
При push нескольких коммитов подряд отменяет предыдущие запуски — экономит минуты GitHub Actions.

### 4. Branch Protection Rules
Заблокируйте ветку `main` в Settings → Branches: требуйте прохождения CI и Code Review перед merge. ИИ не сможет смержить код без вашего одобрения.

### 5. Environment Secrets vs Repository Secrets
Создайте отдельные Environment Secrets для staging и production. Секреты production недоступны для staging пайплайнов.

### 6. Vercel Speed Insights
Включите Vercel Speed Insights (бесплатно) в Dashboard. Получайте реальные данные Core Web Vitals от реальных пользователей — не только от Lighthouse.

### 7. pg_dump для backup перед migration
Перед каждым `prisma migrate deploy` в production делайте `pg_dump`. Если миграция сломает данные — сможете откатиться за минуты.

---

## 📋 Раздел 12: Чек-лист: Перед деплоем (L7_12)

Этот чек-лист страхует production от критических сбоев при публикации новых релизов. Каждая доработка перед отправкой на production-сервер должна пройти следующие 4 фазы проверки:

**1. Автоматические E2E-тесты**:
- [ ] Запущены E2E-тесты локально или в CI для всех поддерживаемых браузеров (Chromium, Firefox, WebKit).
- [ ] Успешно пройдены все критические сценарии (авторизация, оплата, регистрация, основной пользовательский путь).
- [ ] Сгенерирован и проверен отчет о покрытии E2E-тестами.

**2. Бэкапы и миграции базы данных**:
- [ ] Создана полная резервная копия (backup) рабочей базы данных перед прокаткой миграций.
- [ ] Протестирован и верифицирован скрипт миграции на копии production-базы (Staging).
- [ ] Убедились, что миграции обратно-совместимы (не роняют текущую работающую версию приложения).

**3. Четкий план отката (Rollback Plan)**:
- [ ] Проверен механизм моментального отката кода (кнопка Instant Rollback в Vercel Dashboard или команда `vercel rollback`).
- [ ] Подготовлен и проверен план отката схемы и данных БД к предыдущему стабильному состоянию.
- [ ] Определены ответственные лица и каналы связи на случай аварийного отката.

**4. Пост-деплой мониторинг**:
- [ ] Настроен и проверен Uptime мониторинг (Uptime Robot, Better Uptime) для мгновенного оповещения о падении сервиса.
- [ ] Подключен Sentry/LogSnag для отслеживания ошибок и исключений в реальном времени.
- [ ] Назначен дежурный для отслеживания системных логов и метрик Core Web Vitals в первые 2 часа после публикации.

---

**Последнее обновление**: 17.05.2026  
**Статус**: ✅ Завершен (доработка L7_12)  
**Предыдущий уровень**: [L6: Интеграции и сервисы](L6_integrations_services.md)  
**Следующий уровень**: [L8: Масштабирование и оптимизация](L8_scaling_optimization.md)

- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [GitHub Actions](https://docs.github.com/en/actions)

### Мониторинг
- [Sentry Documentation](https://docs.sentry.io/)
- [Vercel Analytics](https://vercel.com/docs/analytics)
- [Better Uptime](https://betteruptime.com/docs)

### Performance
- [Web.dev Core Web Vitals](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)

### SEO
- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)

### Security
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Security Headers](https://securityheaders.com/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy)


