import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Pizza Web App API')
    .setDescription(
      `
REST API for the Pizza Web App (pizzeria ordering system).

## Base URL
All endpoints are prefixed with \`/api\`.

## Authentication
- Use **Bearer JWT** in the \`Authorization\` header: \`Bearer <accessToken>\`
- Obtain tokens via \`POST /api/auth/login\` or \`POST /api/auth/register\`
- Refresh expired access tokens via \`POST /api/auth/refresh\`

## Roles
| Role | Description |
|------|-------------|
| \`CLIENT\` | Browse menu, manage custom pizzas, place orders |
| \`EMPLOYEE\` | Kitchen panel, order management, inventory |
| \`ADMIN\` | Full access + analytics + employee account creation |

## Response Format
**Success:**
\`\`\`json
{ "success": true, "data": { ... } }
\`\`\`

**Error:**
\`\`\`json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description",
  "error": "BadRequestException",
  "timestamp": "2026-06-05T12:00:00.000Z",
  "path": "/api/orders"
}
\`\`\`

## Pagination
List endpoints return:
\`\`\`json
{
  "success": true,
  "data": {
    "data": [ ... ],
    "meta": { "total": 100, "page": 1, "limit": 20, "totalPages": 5 }
  }
}
\`\`\`

## Orders & Payment
**Payment is NOT required.** Orders are placed and finalized without any payment processing.
The \`totalPrice\` field is informational only (for display and analytics).

## WebSocket (Real-time)
- **Namespace:** \`/orders\`
- **URL:** \`ws://localhost:3001/orders\` (or your server host)
- **Auth (optional):** pass JWT as \`auth.token\` or \`Authorization: Bearer <token>\` header on connect
- Employees/Admins auto-join the \`kitchen\` room

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| \`order:join\` | Client → Server | \`{ orderId: number }\` | Join room \`order:{id}\` for status updates |
| \`order:created\` | Server → Client | Order object | New order placed (kitchen + broadcast) |
| \`order:statusChanged\` | Server → Client | \`{ orderId, status, order }\` | Order status updated |

## Order Status Flow
\`NEW\` → \`IN_PREPARATION\` → \`READY\` → \`PICKED_UP\` → \`COMPLETED\`

Stock is deducted from inventory when status changes to \`COMPLETED\`.
      `.trim(),
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT access token',
      },
      'access-token',
    )
    .addTag('Auth', 'Registration, login, token refresh')
    .addTag('Users', 'User profile and employee management')
    .addTag('Categories', 'Product and ingredient categories')
    .addTag('Products', 'Menu products (pizzas, drinks, extras)')
    .addTag('Ingredients', 'Pizza ingredients for creator and inventory')
    .addTag('Custom Pizzas', 'Saved custom pizza compositions')
    .addTag('Orders', 'Order placement and tracking (no payment required)')
    .addTag('Inventory', 'Stock management and alerts')
    .addTag('Analytics', 'Reports and business suggestions (Admin only)')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (_controllerKey, methodKey) => methodKey,
  });

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Pizza Web App API Docs',
  });
}
