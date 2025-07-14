# Ecommerce

This project is the backend for an ecommerce store application. The project uses an open-source ecommerce platform, Medusa, and enhances the base functionality for a sample company, Earth Cotton.

## Overview

The `ecommerce` backend uses:

- [Medusa](https://medusajs.com/)
- [Node.js](https://nodejs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org)
- [AWS S3](https://aws.amazon.com/s3/) (optional)

### Medusa Overview

Below is a summary from Medusa:

Medusa is a set of commerce modules and tools that allow you to build rich, reliable, and performant commerce applications without reinventing core commerce logic. The modules can be customized and used to build advanced ecommerce stores, marketplaces, or any product that needs foundational commerce primitives. All modules are open-source and freely available on npm.

Learn more about [Medusa’s architecture](https://docs.medusajs.com/learn/introduction/architecture) and [commerce modules](https://docs.medusajs.com/learn/fundamentals/modules/commerce-modules) in the Docs.

## How to Run

### Prerequisites

- PostgreSQL is installed.
- Node.js v20+ is installed.
- (Optional) A cloud hostname is configured and publicly available to the server for product images. Make a note of the base URL of your hosting service. For example, below is a hostname for AWS S3 (which is a dummy value): `commerce-project-a0a96fd3-afdd-49c0-b6fd-ccd23bc15def.s3.us-west-1.amazonaws.com`.

### Clone the repository

- Use `git clone` to clone this repo.

### Set up the environment variables

- Navigate into your project directory and set up the `.env` file. Update the `.env` values accordingly:

```shell
cd ecommerce/
mv .env.template .env
```

### Install dependencies

- Use npm to install all dependencies.

```shell
npm install
```

### Seed the data

- Create the database tables and automatically sync the database name in the `.env` file.

```
npx medusa db:setup --db [DATABASE_NAME]
```

- Run the script to seed the data and populate the database with company, product, and logistics details.

```
npm run seed
```

- Create an admin user to manage the ecommerce platform.

```
npx medusa user --email [ADMIN_EMAIL] --password [ADMIN_PASSWORD]
```

- Below is an example with the full set of commands

```
npx medusa db:setup --db medusa-ecommerce
npm run seed
npx medusa user --email admin@medusajs.com --password admin123
```

### Run the app

- Start the backend server

```shell
npm run dev
```

The ecommerce app is now running at http://localhost:9000!
