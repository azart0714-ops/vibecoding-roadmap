# L6: Интеграции и сервисы

## 🎯 Цель уровня

Интегрировать внешние сервисы для расширения функционала приложения. Не изобретай велосипед — используй готовые решения.

**Ключевой принцип**: Интеграции ускоряют разработку в 10x.

**Философия уровня**: Правильный выбор сервисов важнее их реализации.

---

## 🧠 Ключевые концепции

### 1. Платежи (Stripe, Lemon Squeezy)
Обработка платежей, подписок и возвратов через готовые решения.

### 2. Email сервисы (Resend, SendGrid)
Transactional emails с высокой deliverability и шаблонами.

### 3. File Storage (Uploadthing, Cloudflare R2)
Хранение и доставка файлов через CDN с оптимизацией.

### 4. AI API (OpenAI, Anthropic, Vercel AI SDK)
Интеграция LLM для генерации контента и чат-ботов.

### 5. Analytics и мониторинг (Vercel Analytics, Sentry)
Отслеживание метрик, ошибок и производительности.

### 6. Authentication (Clerk, Supabase Auth)
Готовые решения для регистрации, входа и управления пользователями.

### 7. Background Jobs (Inngest, Trigger.dev)
Асинхронная обработка задач без блокировки основного потока.

### 8. CMS (Sanity, Contentful)
Headless CMS для управления контентом без перезагрузки.

### 9. Rate Limiting (Upstash Redis)
Защита API от abuse и контроль использования.

### 10. Webhooks
Получение событий от внешних сервисов в реальном времени.

---

## 📚 Теоретическая база

### Раздел 1: Платежные системы

**Stripe** — самая популярная платежная система:
- Checkout Sessions для быстрой интеграции
- Webhooks для обработки событий
- Subscription management
- Test mode для разработки

**Lemon Squeezy** — альтернатива с упрощенной настройкой:
- Merchant of Record (берут на себя налоги)
- Автоматическая обработка VAT/GST
- Поддержка PayPal из коробки
- Проще для начинающих

**Ключевые объекты**: Customer, Product, Price, PaymentIntent, Subscription, Webhook

📖 **Ресурсы**: 
- [Stripe Documentation](https://stripe.com/docs)
- [Lemon Squeezy Docs](https://docs.lemonsqueezy.com/)

---

### Раздел 2: Email сервисы

**Resend** — современный email сервис:
- Простое API
- React Email для шаблонов
- Высокая deliverability
- 3,000 emails бесплатно

**React Email** — компонентный подход к email:
- JSX/TSX шаблоны
- Preview в браузере
- Адаптивные layouts
- Переиспользуемые компоненты

**Альтернативы**: SendGrid, Mailgun, AWS SES

📖 **Ресурсы**:
- [Resend Documentation](https://resend.com/docs)
- [React Email](https://react.email/)

---

### Раздел 3: File Storage

**Uploadthing** — Next.js friendly storage:
- Простая интеграция
- Автоматический CDN
- Валидация на сервере
- Progress tracking

**Cloudflare R2** — S3-совместимое хранилище:
- Дешевле S3
- Бесплатный egress
- Глобальный CDN
- S3 API совместимость

**Vercel Blob** — serverless storage от Vercel:
- Нулевая конфигурация
- Автоматическая оптимизация
- Интеграция с Next.js

📖 **Ресурсы**:
- [Uploadthing Docs](https://docs.uploadthing.com/)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)

---

### Раздел 4: AI API

**OpenAI** — GPT модели:
- GPT-4 Turbo для сложных задач
- GPT-3.5 для быстрых ответов
- Streaming responses
- Function calling

**Anthropic Claude** — альтернатива GPT:
- Больший context window (200k)
- Дешевле GPT-4
- Лучше для длинных документов
- Более безопасные ответы

**Vercel AI SDK** — универсальный SDK:
- Поддержка всех провайдеров
- Streaming из коробки
- React hooks для UI
- Edge runtime совместимость

**Groq** — сверхбыстрый inference:
- Бесплатно в beta
- Llama 3 модели
- Мгновенные ответы
- Ограниченный context

📖 **Ресурсы**:
- [OpenAI API](https://platform.openai.com/docs)
- [Anthropic API](https://docs.anthropic.com/)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Groq](https://groq.com/)

---

### Раздел 5: Analytics и мониторинг

**Vercel Analytics** — web analytics:
- Автоматический сбор метрик
- Real User Monitoring
- Web Vitals tracking
- Privacy-friendly

**PostHog** — product analytics:
- Open-source
- Feature flags
- Session replay
- A/B testing

**Sentry** — error tracking:
- Автоматический захват ошибок
- Source maps support
- Performance monitoring
- Alerts и notifications

**LogSnag** — event tracking:
- Простое API
- Real-time notifications
- Timeline view
- Integrations

📖 **Ресурсы**:
- [Vercel Analytics](https://vercel.com/docs/analytics)
- [PostHog](https://posthog.com/docs)
- [Sentry](https://docs.sentry.io/)
- [LogSnag](https://docs.logsnag.com/)

---

### Раздел 6: Authentication

**Clerk** — полное auth решение:
- UI компоненты из коробки
- Social logins
- Multi-factor authentication
- User management dashboard

**Supabase Auth** — open-source альтернатива:
- Email/password auth
- OAuth providers
- Row Level Security
- Бесплатный tier

**NextAuth.js** — самостоятельное решение:
- Полный контроль
- Множество провайдеров
- JWT или database sessions
- Бесплатно

📖 **Ресурсы**:
- [Clerk](https://clerk.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [NextAuth.js](https://next-auth.js.org/)

---

### Раздел 7: Background Jobs

**Inngest** — serverless background jobs:
- Declarative functions
- Automatic retries
- Step functions
- 250k steps бесплатно

**Trigger.dev** — альтернатива Inngest:
- Visual workflow builder
- Long-running jobs
- Scheduled tasks
- Webhooks integration

**Upstash QStash** — простая очередь:
- HTTP-based
- Delay и schedule
- Retry logic
- Pay per use

📖 **Ресурсы**:
- [Inngest](https://www.inngest.com/docs)
- [Trigger.dev](https://trigger.dev/docs)
- [Upstash QStash](https://upstash.com/docs/qstash)

---

### Раздел 8: CMS и контент

**Sanity** — headless CMS:
- Real-time collaboration
- Structured content
- GROQ query language
- Customizable studio

**Contentful** — enterprise CMS:
- GraphQL API
- Content modeling
- Localization
- Webhooks

**Payload CMS** — self-hosted альтернатива:
- TypeScript-first
- Admin UI из коробки
- Access control
- Бесплатный

📖 **Ресурсы**:
- [Sanity](https://www.sanity.io/docs)
- [Contentful](https://www.contentful.com/developers/docs/)
- [Payload CMS](https://payloadcms.com/docs)

---

### Раздел 9: Rate Limiting и кэширование

**Upstash Redis** — serverless Redis:
- Pay per request
- Global replication
- REST API
- Rate limiting SDK

**Vercel KV** — key-value storage:
- Powered by Upstash
- Edge compatible
- Нулевая конфигурация
- Интеграция с Next.js

**Паттерны rate limiting**:
- Sliding window
- Token bucket
- Fixed window
- Per-user limits

📖 **Ресурсы**:
- [Upstash Redis](https://upstash.com/docs/redis)
- [Vercel KV](https://vercel.com/docs/storage/vercel-kv)

---

### Раздел 10: Webhooks и события

**Ключевые концепции**:
- Signature verification (безопасность)
- Idempotency (повторная обработка)
- Retry logic (надежность)
- Event types (типизация)

**Best practices**:
- Всегда проверяй signature
- Обрабатывай асинхронно
- Логируй все события
- Используй idempotency keys

**Инструменты для тестирования**:
- Stripe CLI для локальных webhooks
- ngrok для туннелирования
- Webhook.site для отладки

📖 **Ресурсы**:
- [Webhooks Guide](https://hookdeck.com/webhooks/guides/complete-guide-webhooks)

---

## 📊 Сравнительные таблицы

### Платежные системы

| Сервис | Комиссия | Merchant of Record | Налоги | Сложность |
|--------|----------|-------------------|--------|-----------|
| **Stripe** | 2.9% + $0.30 | ❌ | Вручную | ⭐⭐⭐ |
| **Lemon Squeezy** | 5% + $0.50 | ✅ | Автоматически | ⭐ |
| **Paddle** | 5% + $0.50 | ✅ | Автоматически | ⭐⭐ |

### Email сервисы

| Сервис | Бесплатный лимит | Цена | Deliverability |
|--------|------------------|------|----------------|
| **Resend** | 3,000/мес | $20/мес (50k) | ⭐⭐⭐⭐⭐ |
| **SendGrid** | 100/день | $15/мес (40k) | ⭐⭐⭐⭐ |
| **AWS SES** | 62,000/мес | $0.10/1k | ⭐⭐⭐ |

### File Storage

| Сервис | Бесплатный лимит | Цена | CDN |
|--------|------------------|------|-----|
| **Uploadthing** | 2GB | $10/мес (100GB) | ✅ |
| **Cloudflare R2** | 10GB | $0.015/GB | ✅ |
| **Vercel Blob** | 500MB | $0.15/GB | ✅ |

### AI API

| Сервис | Модель | Цена (1M tokens) | Context |
|--------|--------|------------------|---------|
| **OpenAI** | GPT-4 Turbo | $10 in / $30 out | 128k |
| **Anthropic** | Claude 3.5 Sonnet | $3 in / $15 out | 200k |
| **Groq** | Llama 3 70B | Бесплатно (beta) | 8k |

---

## 🎯 Рекомендуемые стеки

### Минимальный MVP ($0-20/мес)
- **Платежи**: Lemon Squeezy
- **Email**: Resend (3k бесплатно)
- **Auth**: NextAuth.js
- **Analytics**: Vercel Analytics
- **Monitoring**: Sentry (5k events)

### Растущий продукт ($50-100/мес)
- **AI**: Anthropic Claude
- **Storage**: Uploadthing
- **Background Jobs**: Inngest
- **Rate Limiting**: Upstash Redis
- **CMS**: Sanity (если нужен)

### Enterprise ($500+/мес)
- **Платежи**: Stripe
- **Email**: SendGrid
- **Storage**: Cloudflare R2
- **Monitoring**: Datadog
- **CDN**: Cloudflare Enterprise

---

## ⚠️ Частые ошибки

### 1. Хранение API ключей в коде
**Проблема**: Ключи попадают в Git репозиторий.
**Решение**: Используй .env.local и .gitignore.

### 2. Не валидируют webhooks
**Проблема**: Любой может отправить fake webhook.
**Решение**: Всегда проверяй signature.

### 3. Не обрабатывают rate limits
**Проблема**: API блокирует запросы.
**Решение**: Реализуй rate limiting с Upstash.

### 4. Синхронные операции в API routes
**Проблема**: Долгие операции блокируют ответ.
**Решение**: Используй background jobs.

### 5. Не тестируют интеграции
**Проблема**: Ошибки в production.
**Решение**: Используй test mode всех сервисов.

### 6. Игнорируют ошибки API
**Проблема**: Приложение падает при недоступности сервиса.
**Решение**: Реализуй retry logic и circuit breaker.

### 7. Не мониторят расходы
**Проблема**: Неожиданные счета за AI API.
**Решение**: Настрой alerts и лимиты.

---

## 🔗 Раздел 8: Stripe — Полная интеграция

### 8.1. Checkout Sessions для быстрой оплаты

Stripe Checkout — самый быстрый способ принять оплату:

```typescript
// api/stripe/checkout/route.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { priceId, userId } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',  // или 'payment' для разовых
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
    metadata: { userId },  // Свяжем с пользователем через webhook
  });

  return Response.json({ url: session.url });
}
```

### 8.2. Webhooks — критически важный паттерн

Webhook — единственный надёжный способ узнать о завершении оплаты:

```typescript
// api/stripe/webhook/route.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  // ⚠️ ОБЯЗАТЕЛЬНО: Верификация подписи вебхука!
  const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutComplete(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionCancelled(event.data.object);
      break;
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
  }

  return Response.json({ received: true });
}
```

**⚠️ Правило безопасности**: Никогда не доверяйте client-side callback после оплаты. Только webhook является авторитетным источником.

### 8.3. Subscription Management

```typescript
// Получить подписку пользователя
const subscriptions = await stripe.subscriptions.list({
  customer: customerId,
  status: 'active',
});

// Отменить подписку в конце периода (graceful)
await stripe.subscriptions.update(subscriptionId, {
  cancel_at_period_end: true,
});

// Сменить тариф (upgrade/downgrade)
await stripe.subscriptions.update(subscriptionId, {
  items: [{ id: itemId, price: newPriceId }],
  proration_behavior: 'create_prorations',
});
```

📖 **Ресурсы**:
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)

---

## 📁 Раздел 9: Файловое хранилище — Паттерны

### 9.1. Загрузка через Presigned URL (рекомендуемый паттерн)

```
Клиент → API: "Хочу загрузить файл"
API → R2/S3: Сгенерировать presigned URL (срок: 1 час)
API → Клиент: URL для прямой загрузки
Клиент → R2/S3: PUT запрос напрямую (без нагрузки на сервер!)
Клиент → API: "Загрузка завершена, путь: uploads/uuid.webp"
API → БД: Сохранить путь к файлу
```

**Почему presigned URL?** Файл идёт напрямую в хранилище, не нагружая ваш сервер. Для видео и больших файлов — единственный правильный подход.

### 9.2. Обязательная валидация файлов

```typescript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function validateFile(file: File) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Недопустимый тип файла');
  }
  if (file.size > MAX_SIZE) {
    throw new Error('Файл слишком большой (максимум 5MB)');
  }
  // Проверяем реальный тип по magic bytes, не только Content-Type
  return true;
}
```

📖 **Ресурсы**:
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Sharp Image Processing](https://sharp.pixelplumbing.com/)

---

## 📊 Раздел 10: Мониторинг и аналитика — PostHog, Vercel Analytics (RUM) & Sentry

### 10.1. Product Analytics с PostHog — Решение «Всё-в-одном»
PostHog является мощнейшей open-source альтернативой Mixpanel и Hotjar. **Уникальная ценность**: 1 000 000 событий в месяц абсолютно бесплатно (включая запись сессий).

#### Настройка и автотрекинг
```typescript
// lib/analytics.ts
import posthog from 'posthog-js';

export function initAnalytics() {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.posthog.com',
      capture_pageview: true,      // Автотрекинг переходов по страницам
      autocapture: true,           // Автотрекинг кликов по кнопкам и ссылкам
      disable_session_recording: false, // Включает Session Replay (Запись экранов)
      persistence: 'localStorage',
    });
  }
}

// Типизированные кастомные события для ИИ
export const analytics = {
  signUp: (method: string) =>
    posthog.capture('user_signed_up', { method }),
  purchase: (plan: string, amount: number) =>
    posthog.capture('purchase_completed', { plan, amount }),
  featureUsed: (feature: string) =>
    posthog.capture('feature_used', { feature }),
};
```

#### Feature Flags (Флаги функций) для безопасных ИИ-релизов:
Вы можете переключать функционал на лету в консоли PostHog без необходимости деплоить код:
```typescript
import posthog from 'posthog-js';

if (posthog.isFeatureEnabled('new-billing-flow')) {
  // Показываем новый интерфейс оплаты
  renderNewFlow();
} else {
  renderOldFlow();
}
```

---

### 10.2. Vercel Analytics — Real User Monitoring (RUM) из коробки
Для сайтов, развернутых на Vercel, Vercel Analytics обеспечивает мгновенный мониторинг производительности и трафика с нулевой начальной настройкой.
* **Главное отличие**: Фокус на Core Web Vitals (LCP, FID, CLS) — скорость загрузки у реальных пользователей, критически важная для SEO.
* **Hobby Tier**: 2,500 бесплатных событий в месяц.

#### Подключение к Next.js:
1. Активируйте вкладку **Analytics** в дашборде проекта Vercel.
2. Установите пакет: `npm install @vercel/analytics`
3. Вставьте компонент `<Analytics />` в корневой макет приложения:

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        {children}
        {/* Компонент Vercel Analytics автоматически собирает метрики */}
        <Analytics />
      </body>
    </html>
  );
}
```

---

### 10.3. Sentry — Error Tracking Production
Sentry автоматически улавливает все рантайм ошибки бэкенда и фронтенда, сопоставляя их с исходными картами кода (Source Maps).

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,  // Сбор 10% транзакций для экономии квот
  replaysSessionSampleRate: 0.01,  // Запись 1% сессий
  replaysOnErrorSampleRate: 1.0,   // 100% запись сессий с ошибками
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true, // Защита персональных данных
    }),
  ],
});
```

**Ручная отправка ошибок**:
```typescript
try {
  await processPayment(data);
} catch (error) {
  Sentry.captureException(error, {
    extra: { userId, paymentId, amount },
    tags: { section: 'payments' },
  });
  throw error;
}
```

📖 **Ресурсы**:
- [PostHog Docs: Web SDK](https://posthog.com/docs/libraries/js)
- [Vercel Web Analytics Guide](https://vercel.com/docs/analytics)
- [Sentry Next.js Integration](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

---

## 🎓 Практические задания

### Задание 1: Stripe Checkout (2-3 часа)
**Цель**: Реализовать полноценный платёжный флоу с Stripe.

**Шаги**:
1. Зарегистрируйтесь в Stripe, создайте тестовый продукт и Price ID
2. Реализуйте API endpoint для создания Checkout Session
3. Добавьте кнопку оплаты на фронтенде
4. Настройте Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
5. Реализуйте обработчик webhook `checkout.session.completed`
6. Протестируйте тестовой картой: `4242 4242 4242 4242`

**Критерий завершения**: Оплата проходит, webhook получен, статус пользователя обновлён в БД.

### Задание 2: Email-уведомления (1-2 часа)
**Цель**: Отправить приветственное письмо при регистрации.

**Шаги**:
1. Зарегистрируйтесь в Resend, добавьте тестовый домен
2. Создайте JSX-шаблон `WelcomeEmail` с React Email
3. Добавьте отправку письма в обработчик регистрации
4. Протестируйте доставку через Resend Dashboard
5. Добавьте письмо при успешной оплате

**Критерий завершения**: Письмо пришло в inbox, HTML корректно отрендерен на мобильном.

### Задание 3: Загрузка аватара (2-3 часа)
**Цель**: Реализовать загрузку файлов с валидацией и оптимизацией.

**Шаги**:
1. Настройте Cloudflare R2 или Supabase Storage
2. Реализуйте генерацию presigned URL на сервере
3. Добавьте загрузку с прогресс-баром на клиенте
4. Добавьте валидацию: только изображения, максимум 2MB
5. Конвертируйте в WebP через Sharp перед загрузкой

**Критерий завершения**: Файл загружен, URL сохранён в профиле, аватар отображается.

### Задание 4: Analytics Setup (1 час)
**Цель**: Настроить полноценный мониторинг продукта.

**Шаги**:
1. Подключите PostHog к проекту
2. Настройте трекинг 5 ключевых событий: signup, login, purchase, feature_used, logout
3. Установите Sentry через `npx @sentry/wizard`
4. Создайте тестовую ошибку и убедитесь, что она появилась в Sentry Dashboard
5. Настройте алерт на новые ошибки в Telegram

**Критерий завершения**: События видны в PostHog, ошибки приходят в Sentry.

---

## ⚠️ Частые ошибки

### 1. Не верифицируют подписи Webhook
**Проблема**: Любой может отправить фейковый webhook и получить premium доступ.  
**Решение**: Всегда используйте `stripe.webhooks.constructEvent()` с webhook secret. Без верификации — критическая уязвимость.

### 2. Доверяют client-side callback после оплаты
**Проблема**: Пользователь может закрыть браузер сразу после оплаты — `success_url` не откроется.  
**Решение**: Статус оплаты меняйте только через webhook, никогда через параметр URL.

### 3. Хранят оригинальные имена файлов
**Проблема**: Имена файлов могут содержать SQL-инъекции, path traversal, XSS.  
**Решение**: Генерируйте UUID для каждого файла: `crypto.randomUUID() + '.' + extension`.

### 4. Не настраивают SPF/DKIM/DMARC
**Проблема**: Письма попадают в спам, домен получает плохую репутацию.  
**Решение**: Обязательно добавьте DNS-записи SPF, DKIM и DMARC при настройке Resend.

### 5. Отслеживают слишком много событий в PostHog
**Проблема**: Тысячи ненужных событий, невозможно найти сигнал в шуме.  
**Решение**: Определите 5-10 ключевых метрик продукта и трекайте только их.

### 6. Игнорируют ошибки API интеграций
**Проблема**: Приложение молча падает при недоступности Stripe/Resend.  
**Решение**: Реализуйте retry logic с exponential backoff. Используйте circuit breaker для нестабильных API.

### 7. Используют один API ключ для всех окружений
**Проблема**: Тестовые данные попадают в production, или наоборот.  
**Решение**: Разные ключи для development, staging и production. Stripe автоматически разделяет test/live mode.

---

## 💡 Pro Tips

### 1. Stripe Radar для защиты от мошенничества
Включите Stripe Radar (бесплатно) для автоматического блокирования подозрительных платежей. Настройте кастомные правила: блокировать карты из определённых стран, лимиты по частоте.

### 2. Idempotency Keys для надёжности
При создании Stripe объектов всегда передавайте idempotency key: `stripe.paymentIntents.create({...}, {idempotencyKey: orderId})`. Защита от дублирования при повторных запросах из-за сетевых ошибок.

### 3. PostHog Feature Flags вместо деплоев
Оберните рискованный новый функционал в Feature Flag. Можете мгновенно отключить его без деплоя, если что-то пошло не так.

### 4. Sentry Performance Monitoring
Используйте `Sentry.startTransaction()` для измерения времени выполнения критичных операций (генерация PDF, обработка изображений). Найдёте узкие места до жалоб пользователей.

### 5. React Email Preview
Запустите `npx react-email dev` для локального превью email-шаблонов в браузере. Не нужно отправлять реальные письма при разработке.

### 6. Используйте Stripe Customer Portal
Stripe предоставляет готовый Customer Portal для управления подписками: смена тарифа, отмена, история платежей. Создайте ссылку: `stripe.billingPortal.sessions.create({customer: customerId})`. 2 строки кода вместо месяца разработки.

### 7. Мониторьте Webhook Delivery
В Stripe Dashboard → Webhooks → ваш endpoint можно видеть историю всех вебхуков, повторно отправить упавшие. Используйте это при дебаггинге.

### 8. Сжимайте изображения до загрузки
Используйте `browser-image-compression` npm пакет для сжатия на клиенте перед отправкой. Экономит пропускную способность и деньги на хранилище.

---

**Последнее обновление**: 17.05.2026  
**Статус**: ✅ Полностью завершён  
**Предыдущий уровень**: [L5: Backend и БД](L5_backend_databases.md)  
**Следующий уровень**: [L7: Deployment и Production](L7_deployment_production.md)


### 2. Тестируй в test mode
Все сервисы предоставляют test keys — используй их для разработки.

### 3. Мониторь расходы на AI
Легко потратить много на GPT-4 — используй streaming и кэширование.

### 4. Разные ключи для окружений
Dev, staging, production должны иметь разные API keys.

### 5. Обрабатывай ошибки gracefully
Внешние сервисы могут быть недоступны — предусмотри fallback.

### 6. Используй typed clients
Zod schemas для валидации ответов API.

### 7. Логируй все интеграции
Sentry + LogSnag для отслеживания событий и ошибок.

### 8. Реализуй idempotency
Webhooks могут приходить дважды — используй idempotency keys.

---

## ✅ Чек-лист освоения L6

### Платежи
- [ ] Интегрировал Stripe или Lemon Squeezy
- [ ] Настроил webhooks с signature verification
- [ ] Протестировал в test mode
- [ ] Обрабатываю успешные и неуспешные платежи
- [ ] Реализовал subscription management

### Email
- [ ] Настроил Resend или SendGrid
- [ ] Создал email шаблоны с React Email
- [ ] Верифицировал домен для отправки
- [ ] Отправляю transactional emails
- [ ] Обрабатываю bounce и complaints

### File Storage
- [ ] Настроил Uploadthing или R2
- [ ] Ограничил размер и типы файлов
- [ ] Реализовал upload с progress
- [ ] Оптимизирую изображения
- [ ] Настроил CDN для доставки

### AI
- [ ] Интегрировал OpenAI или Anthropic
- [ ] Использую streaming для ответов
- [ ] Реализовал rate limiting
- [ ] Обрабатываю ошибки API
- [ ] Контролирую расходы через alerts

### Analytics
- [ ] Настроил Vercel Analytics или PostHog
- [ ] Отслеживаю ключевые события
- [ ] Настроил error tracking (Sentry)
- [ ] Мониторю производительность
- [ ] Настроил alerts для критичных метрик

### Authentication
- [ ] Интегрировал Clerk или Supabase Auth
- [ ] Настроил social logins
- [ ] Реализовал password reset
- [ ] Защитил API routes
- [ ] Настроил role-based access

### Background Jobs
- [ ] Настроил Inngest или Trigger.dev
- [ ] Реализовал retry logic
- [ ] Обрабатываю long-running tasks
- [ ] Настроил scheduled jobs
- [ ] Мониторю выполнение задач

### Security
- [ ] Все API keys в environment variables
- [ ] Webhook signature verification
- [ ] Rate limiting на критичных endpoints
- [ ] Input validation с Zod
- [ ] CORS настроен правильно

---

## 🛠 Раздел 11: Готовые интеграции и чеклисты (YooKassa, Brevo, DeepL, OpenAI Embeddings)

Когда вы работаете соло, скорость интеграции решает всё. Ниже приведены пошаговые чеклисты и лаконичные примеры для подключения ключевых сервисов.

### 11.1. Интеграция YooKassa (ЮKassa) для РФ-рынка
Для локальных платежей в рублях YooKassa — стандарт. Чеклист интеграции:
1. **Регистрация мерчанта**: Получение `Shop ID` и `Secret Key` (токен вида `test_...` или `live_...`).
2. **Инициализация**: Установка SDK или выполнение прямых HTTP запросов с Basic Auth.
3. **Генерация Payment**: Создание транзакции с заголовком `Idempotence-Key` (защита от двойных списаний).
4. **Обработка Webhooks**: Прием `POST` событий от YooKassa, обязательное сопоставление IP-адресов отправителя и проверка статуса `payment.succeeded`.

#### Пример создания платежа на Node.js:
```typescript
import { Yookassa } from 'yookassa-ts'; // или прямой fetch API

const shopId = process.env.YOOKASSA_SHOP_ID!;
const secretKey = process.env.YOOKASSA_SECRET_KEY!;

export async function createYookassaPayment(amount: number, orderId: string, userEmail: string) {
  const response = await fetch('https://api.yookassa.ru/v3/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotence-Key': orderId,
      'Authorization': 'Basic ' + Buffer.from(`${shopId}:${secretKey}`).toString('base64'),
    },
    body: JSON.stringify({
      amount: {
        value: amount.toFixed(2),
        currency: 'RUB',
      },
      payment_method_data: {
        type: 'bank_card',
      },
      confirmation: {
        type: 'redirect',
        return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?status=check`,
      },
      description: `Оплата заказа #${orderId}`,
      metadata: { orderId, userEmail },
      capture: true, // Мгновенное подтверждение платежа без двухстадийного списания
    }),
  });

  const payment = await response.json();
  return payment.confirmation.confirmation_url;
}
```

---

### 11.2. Brevo (Transactional Email) — 300 писем в день абсолютно бесплатно
Если вам не хватает лимитов Resend или нужен нулевой бюджет на старте, Brevo (бывший Sendinblue) дает стабильный бесплатный тариф: 300 писем/день без привязки карты.
1. **Настройка домена**: Добавление TXT-записей SPF, DKIM и DMARC в вашу DNS-панель (критично для защиты от папки "Спам").
2. **Получение API Key**: Создание ключа в Brevo SMTP & API панели.
3. **Отправка через fetch / SDK**:

```typescript
export async function sendTransactionalEmail(to: string, subject: string, htmlContent: string) {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY!,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'My Startup', email: 'hello@mystartup.com' },
      to: [{ email: to }],
      subject: subject,
      htmlContent: htmlContent,
    }),
  });

  return response.ok;
}
```

---

### 11.3. Локализация с DeepL API
Для создания многоязычных MVP DeepL предоставляет самое качественное машинное автоперевод-API.
- **Бесплатный лимит**: 500 000 символов в месяц бесплатно.
- **Паттерн применения**: Перевод на этапе сборки/интеграции (статический экспорт) либо кэшируемый перевод налету в Redis.

```typescript
export async function translateText(text: string, targetLang: 'EN' | 'RU' | 'DE'): Promise<string> {
  const response = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: [text],
      target_lang: targetLang,
    }),
  });

  const data = await response.json();
  return data.translations[0].text;
}
```

---

### 11.4. OpenAI Vector Embeddings (Векторные эмбеддинги и семантический поиск)
Используются для создания умного поиска по сайту, рекомендательных систем или AI-ассистентов (RAG).
- **Суть**: Превращение любого текста (статьи, товара, вопроса) в массив из 1536 чисел (вектор), отражающих смысл текста.
- **Интеграция**: Сначала получаем вектор через OpenAI API, затем сохраняем его в PostgreSQL с расширением `pgvector` и ищем похожие записи с помощью косинусного расстояния (`<=>`).

#### Пример получения эмбеддинга на Node.js:
```typescript
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small', // Экономичная и мощная модель
    input: text,
  });

  return response.data[0].embedding;
}
```

#### SQL-запрос для поиска похожих документов (в Prisma или raw SQL):
```sql
-- Поиск top-5 похожих статей на основе косинусного сходства векторов
SELECT id, title, content, 1 - (embedding <=> '[0.0023, -0.0123, ...]') AS similarity
FROM "Document"
WHERE 1 - (embedding <=> '[0.0023, -0.0123, ...]') > 0.7
ORDER BY similarity DESC
LIMIT 5;
```

---

## 🔐 Раздел 12: Премиум-аутентификация с Clerk

Clerk — это золотой стандарт аутентификации для современных SaaS. Он снимает с разработчика и ИИ всю головную боль по безопасной работе с паролями, сессиями, сессионными cookies, MFA и OAuth-провайдерами.
**Free Tier**: До 10,000 MAU бесплатно (включая социальные входы).

### 12.1. Инициализация в Next.js:
1. Зарегистрируйтесь в Clerk и получите ключи API.
2. Установите SDK: `npm install @clerk/nextjs`
3. Оберните приложение в `<ClerkProvider />`:

```typescript
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="ru">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### 12.2. Защита роутов с помощью Middleware:
Создайте файл `middleware.ts` в корне проекта. Clerk автоматически перенаправляет неавторизованных пользователей на страницу входа при попытке зайти на защищенный роут:

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Указываем публичные роуты, которые доступны без входа (например, лендинг и прайсинг)
const isPublicRoute = createRouteMatcher(['/', '/pricing', '/api/webhooks(.*)']);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect(); // Защищает все остальные роуты
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

### 12.3. Готовые компоненты и сессии в UI:
Clerk предоставляет готовые элементы интерфейса, которые можно легко использовать в заголовке сайта или личном кабинете:

```typescript
// components/Header.tsx
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-slate-900 text-white">
      <h1>My SaaS</h1>
      <div>
        {/* Отображается, если пользователь НЕ вошел */}
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-blue-600 px-4 py-2 rounded">Войти</button>
          </SignInButton>
        </SignedOut>
        
        {/* Отображается, если пользователь ВОШЕЛ */}
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </header>
  );
}
```

*AI DX Эффект*: Снижает риск дыр в безопасности авторизации до нуля. ИИ больше не нужно писать логику хэширования паролей или разбираться со сложными настройками JWT — Clerk управляет всем автоматически через Middleware и JWT API.

---

## 📖 Ресурсы для изучения

### Официальная документация
- [Clerk Next.js Quickstart](https://clerk.com/docs/quickstarts/nextjs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [OpenAI Cookbook](https://cookbook.openai.com/)
- [Vercel AI SDK Examples](https://sdk.vercel.ai/examples)
- [Inngest Patterns](https://www.inngest.com/docs/patterns)

### Видео и курсы
- [Stripe Payments Masterclass](https://www.youtube.com/watch?v=1r-F3FIONl8)
- [Building AI Apps with Vercel AI SDK](https://www.youtube.com/watch?v=Yg3Cc9RcJE8)

### Статьи и гайды
- [The Complete Guide to Webhooks](https://hookdeck.com/webhooks/guides/complete-guide-webhooks)
- [Email Deliverability Best Practices](https://resend.com/docs/knowledge-base/deliverability)

### Шаблоны и стартеры
- [Next.js SaaS Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Taxonomy (shadcn)](https://github.com/shadcn/taxonomy)
- [Shipfast](https://shipfa.st/)

---

**Последнее обновление**: 17.05.2026  
**Статус**: ✅ Оптимизирован (концепции без кода)  
**Предыдущий уровень**: [L5: Backend и БД](L5_backend_databases.md)  
**Следующий уровень**: [L7: Deployment и Production](L7_deployment_production.md)
