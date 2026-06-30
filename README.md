# Portfolio (MEAN Stack)

A full-stack portfolio application built **MongoDB, Express, Angular, Node.js (MEAN Stack)**.
The project includes a public portfolio and an admin dashboard to manage content.

---
## Project Structure

```
portfolio-project/
│
├── portfolio-backend/
└── portfolio-frontend/
```

---

## Backend Setup

```bash
cd portfolio-backend
npm install
```

### Environment Variables

Create a `.env` file:

```bash
copy .env.example .env
```

Then update it:

```
MONGO_URI=your mongoDB URI
PORT=5000
JWT_SECRET=<generate a token and place it here>
JWT_EXPIRES_IN=7d
ADMIN_USERNAME=<pick a username>
ADMIN_PASSWORD=<pick a password>
FRONTEND_URL=http://localhost:4200
```

> Note: The default `.env` values are configured for Ahmed Nabil's Portfolio. Modify them as needed.

---

### Seed Database

```bash
npm run seed
```

---

### ▶Run Backend

```bash
npm run dev      # using nodemon
# or
npm start        # using node
```

Backend will run on:
**http://localhost:5000**

---

## Frontend Setup

```bash
cd portfolio-frontend
npm install
```

---

### ▶Run Frontend

```bash   
ng s -o
```

Frontend will run on:
**http://localhost:4200**

---
