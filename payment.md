# Payments — frontend integration

How the backend models **student payments** (no course enrollment row). Base URL and headers match [`FRONTEND_API.md`](./FRONTEND_API.md): `{base} = /api/v1`, JSON bodies, `Authorization: Bearer <access_token>` where required.

For **generated DTO schemas**, use Swagger at `GET /docs` (`Payments` tag).

---

## Concepts

| Topic | Behavior |
|--------|----------|
| **Who owns a payment** | Each row links to a **student** user (`student` relation). |
| **Statuses** | String values; common set is in `PaymentStatusEnum`: `pending`, `paid`, `failed`, `refunded` (see `src/payments/payment-status.enum.ts`). |
| **Currency** | Stored uppercase (`USD`, …). |
| **Provider reference** | Optional string (e.g. Stripe charge or session id) for reconciliation. |
| **Student “my” APIs** | `POST /payments/my` and `GET /payments/my` use the **JWT subject** as the student; no `studentId` in the body. |

---

## 1. Student app — hub summary (read-only)

**`GET /student/hub`**

- **Auth:** Bearer access token **and** role **student** (`RolesGuard`).
- **Use:** Home / dashboard summary: placement, group, **payments** (trimmed), and next-payment hints.

**Response (excerpt)**

```json
{
  "placementCompleted": true,
  "placement": { "score": 84, "totalQuestions": 50, "correctAnswers": 42, "submittedAt": "2026-04-05T08:30:00.000Z" },
  "group": { "id": "g_001", "name": "Morning Advanced", "description": "...", "link": "https://..." },
  "payments": [
    {
      "id": "054c9db7-36ac-4c98-ae69-66a47aab6929",
      "amount": 120,
      "currency": "USD",
      "paidAt": "2026-03-02T09:00:00.000Z",
      "status": "paid"
    }
  ],
  "nextPaymentDate": "2026-05-02T09:00:00.000Z",
  "nextPaymentAmount": 120,
  "nextPaymentCurrency": "USD"
}
```

`payments[]` here is a **subset** of fields (no nested `student` object). For full rows and pagination, use **`GET /payments/my`** below.

---

## 2. Student — record a payment (`POST /payments/my`)

Call this **after** your payment provider confirms success (e.g. Stripe webhook handled on the server, or client-side confirmation where your product allows it). The backend persists a **`paid`** row for the authenticated user.

**Request**

```http
POST /api/v1/payments/my
Content-Type: application/json
Authorization: Bearer <access_token>
```

```json
{
  "amount": 99.99,
  "currency": "USD",
  "providerReference": "ch_3QwYvY2eZvKYlo2C1x2y3z4A"
}
```

| Field | Required | Notes |
|--------|----------|--------|
| `amount` | Yes | Number. |
| `currency` | Yes | Non-empty string; stored uppercase. |
| `providerReference` | No | Payment intent / charge / session id from the provider. |

**Behavior**

- Server sets **`status`** to **`paid`**.
- **`paidAt`** defaults to **now** if not supplied elsewhere in the service path.

**Response `201`**

Payment object (see [Payment shape](#5-payment-object-shape)).

**Errors**

| Status | Typical cause |
|--------|----------------|
| `401` | Missing or invalid JWT. |
| `422` | Validation failure (DTO). Body may include `errors: { student: 'notExists' }` if the user id is invalid in edge cases. |

---

## 3. Student — list my payments (`GET /payments/my`)

**Request**

```http
GET /api/v1/payments/my?page=1&limit=10
Authorization: Bearer <access_token>
```

| Query | Default | Max |
|-------|---------|-----|
| `page` | `1` | — |
| `limit` | `10` | capped at **50** server-side |

**Response `200`** — infinity-style pagination:

```json
{
  "data": [
    {
      "id": "054c9db7-36ac-4c98-ae69-66a47aab6929",
      "paidAt": "2026-03-02T09:00:00.000Z",
      "providerReference": "ch_...",
      "status": "paid",
      "currency": "USD",
      "amount": 120,
      "student": {
        "id": 42,
        "email": "student@example.com",
        "firstName": "Lina",
        "lastName": "Khaled"
      },
      "createdAt": "2026-03-02T09:00:01.000Z",
      "updatedAt": "2026-03-02T09:00:01.000Z"
    }
  ],
  "hasNextPage": false
}
```

List is ordered by **`createdAt` descending** (newest first) for the current student.

---

## 4. Admin / back-office — full CRUD (`/payments`)

All routes use **`AuthGuard('jwt')`** on the controller. **Wire your admin UI** to only call these from trusted staff contexts; do not expose generic “list all payments” to learners.

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/payments` | Create a payment for a given `student.id`. |
| `GET` | `/payments` | Paginated list (`page`, `limit`, same cap as above). |
| `GET` | `/payments/:id` | One payment by UUID. |
| `PATCH` | `/payments/:id` | Partial update (`UpdatePaymentDto` — same fields as create, all optional). |
| `DELETE` | `/payments/:id` | Delete row. |

### `POST /payments` (admin)

```json
{
  "student": { "id": 42 },
  "amount": 120,
  "currency": "USD",
  "status": "paid",
  "providerReference": "manual-2026-04",
  "paidAt": "2026-04-01T00:00:00.000Z"
}
```

- **`student.id`**: numeric user id of the student (matches `UserDto`).
- **`status`**, **`currency`**, **`amount`**: required on create per `CreatePaymentDto`.
- **`paidAt`**: optional; defaults to **now** if omitted.

**422** if `student` user does not exist: `errors: { student: 'notExists' }`.

---

## 5. Payment object shape

Fields returned by create/update/find (domain `Payment`):

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (uuid) | Primary key. |
| `amount` | number | |
| `currency` | string | Uppercase in DB. |
| `status` | string | e.g. `paid`, `pending`, … |
| `paidAt` | string \| null | ISO date when paid (nullable). |
| `providerReference` | string \| null | |
| `student` | object | Nested user (serialized `User` domain object). |
| `createdAt` | string | |
| `updatedAt` | string | |

Exact nested `student` fields depend on serialization and Swagger; use **`GET /docs`** for the live schema.

---

## 6. Suggested client flows

### A. Checkout then persist (typical)

1. User completes payment in **Stripe** (or another PSP) via your frontend or hosted page.
2. On success, your **backend** or **client** obtains a stable id (`payment_intent`, `charge`, etc.).
3. Client calls **`POST /payments/my`** with `amount`, `currency`, and `providerReference`.
4. Student history uses **`GET /payments/my`**; dashboard summary can use **`GET /student/hub`** for a lighter payload.

### B. Admin enters cash / bank transfer

Admin uses **`POST /payments`** with `student: { id }`, `status: "paid"`, and optional `providerReference` / `paidAt`.

---

## 7. Errors reference

| Status | Meaning |
|--------|---------|
| `401` | Unauthenticated. |
| `403` | Wrong role for **`/student/hub`** (requires **student**). |
| `404` | **`/student/hub`** if the user is not a student record (structured `error` payload in admin style). |
| `422` | Validation (`class-validator`) or business rule (`errors.student: 'notExists'`). |

---

## Related

- [`FRONTEND_API.md`](./FRONTEND_API.md) — auth, base URL, global error shapes.
- `docs/student hub/student-hub.json` — example hub JSON.
- Swagger: `GET /docs` — `Payments`, `Student`.
