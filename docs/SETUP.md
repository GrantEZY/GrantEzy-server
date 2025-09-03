# 📦 Getting Started with GrantEzy Server

Welcome to the **GrantEzy** backend setup guide. This document walks you through environment setup, development conventions, and automated scripts.

---

## 📦 Prerequisites

- **Node.js** version ~22.x ([Install Node.js](https://nodejs.org/en/download))
- **Docker** (if you don't have a local DB setup) ([Install Docker](https://docs.docker.com/engine/install/))

---

## 📦 Initial Setup

### Make sure you have **all prerequisites** installed.

First, fork the repo and clone your fork:

```bash
git clone https://github.com/<your-username>/GrantEzy-server.git
cd GrantEzy-server
```

---

## Install pnpm (Optional)

Install pnpm as your package manager:

```bash
npm i -g pnpm 
```

Then, install the required packages for development:

```bash
pnpm install
```

---

## Run the Setup Script

Run the `setup.sh` script in the `scripts` folder for the initial setup:

```bash
chmod +x ./scripts/setup.sh
./scripts/setup.sh
```

---

## Database Setup for Local Development

After setting up Docker, start the Postgres and Redis servers with Docker Compose:

```bash
docker compose up
```

- Postgres runs on port **5432**
- Redis runs on port **6379**

---

## 📦 Start the Server

Update the `.env` file using the template from `.env.example`.

Start the server instance:

```bash
pnpm run dev
```

---

## 📦 Commit Guidelines

Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) convention.

To commit using the convention, run:

```bash
./scripts/commit.sh
```

This helps you follow the commit format easily, without typing long commit messages manually.

---
