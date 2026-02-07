# 🚀 PolyStoreX

PolyStoreX is an intelligent **polyglot data routing system** that automatically routes incoming data to the most suitable database type based on its structure and usage pattern.

The system is **hackathon-ready, fail-safe, and demo-friendly**, designed to clearly demonstrate how modern applications can use multiple databases efficiently.

---

## 🧠 Problem

Modern applications handle multiple data types:
- Transactions
- JSON documents
- Cache/session data
- Graph relationships  

Manually choosing the correct database for each data type is complex and error-prone.

---

## 💡 Solution

PolyStoreX analyzes incoming data and **automatically routes it** to the correct storage engine.

| Data Type | Routed Database | Reason |
|---------|----------------|--------|
| Transaction | PostgreSQL | ACID compliance |
| Document / JSON | MongoDB | Schema flexibility |
| Cache / Session | Redis | Low latency |
| Graph | Neo4j | Relationship traversal |

All databases are **simulated in-memory** to ensure:
- Zero external dependencies  
- Deterministic behavior  
- No demo failures  

---

## 🏗️ Architecture

```

Dashboard (Frontend)
↓
Express API
↓
Routing Engine
↓
Polyglot Store (In-Memory)
├─ PostgreSQL
├─ MongoDB
├─ Redis
└─ Neo4j

```

---

## 🧰 Tech Stack

### Backend
- Node.js
- Express.js
- In-memory polyglot storage
- Modular routing engine

### Frontend
- HTML, CSS, JavaScript
- Interactive dashboard
- Live data ingestion
- Response visualization

---

## 🔌 API Endpoints

### Health Check
```

GET /

```

### Ingest Data
```

POST /api/ingest

````

**Sample Input**
```json
{
  "type": "transaction",
  "payload": {
    "orderId": "ORD-001",
    "amount": 299.99,
    "currency": "USD"
  }
}
````

**Sample Output**

```json
{
  "success": true,
  "routedToDisplay": "PostgreSQL",
  "reason": "ACID compliance required",
  "responseTimeMs": 3
}
```

### View Storage

```
GET /api/storage
```

### Clear Storage

```
POST /api/clear
```

### Load Demo Data

```
POST /api/demo
```

---

## ⏱️ Response Time

Each ingestion request measures backend response latency and returns it in milliseconds.
The response time is displayed live in the dashboard.

---

## 🖥️ Dashboard Features

* System health metrics
* Requests per second
* Database distribution
* Recent activity log
* Live JSON ingestion
* Colored routing output
* Response time display

---

## 🚀 Running the Project

### Install Dependencies

```bash
cd backend
npm install
```

### Start Backend

```bash
node server.js
```

### Open Dashboard

Open `dashboard.html` in a browser.

---

## 👤 Author

**Balashanmugam S**
GitHub: [https://github.com/Balashanmugam30](https://github.com/Balashanmugam30)

---

## 📌 Note

PolyStoreX is designed for **clarity, reliability, and live demonstrations** rather than production deployment.

```

---

If you want **nothing else**, you’re done ✅  
Just commit and push.
```
