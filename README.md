# Node.js Microservices — User Service & Post Service

This project has **two Node.js microservices**:

- **User Service** — handles signup, login, JWT generation (RS256).
- **Post Service** — handles user posts, verifies JWT with public key, uses PostgreSQL with table partitioning & simple sharding (demo).

---

## JWT Authentication

**Algorithm:** RS256 (RSA, asymmetric)

- **User Service:** uses `private.key` to sign JWTs.
- **Post Service:** uses `public.key` to verify JWTs.

---

## How to Generate Keys

```
# Generate private key
openssl genrsa -out keys/private.key 2048

# Extract public key
openssl rsa -in keys/private.key -pubout -out keys/public.key

# Copy public key to Post Service
cp keys/public.key ../post-service/keys/public.key
```
---

## User Service .env
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=user_here
DB_PASSWORD=db_password_here
DB_NAME=user_service
PRIVATE_KEY_PATH=./keys/private.key
PUBLIC_KEY_PATH=./keys/public.key
JWT_SECRET=dummysecretuser123
```
## Post Service .env
```
PORT=5001
DB_HOST=localhost
DB_PORT=5432
DB_USER=user_here
DB_PASSWORD=db_password_here
DB_NAME=post_service
DB2_NAME=post2_service
USER_JWT_SECRET=dummysecretpost456
PUBLIC_KEY_PATH=./keys/public.key
USER_SERVICE_BASE_URL=http://localhost:5000
```
---
## PostgreSQL Setup
```
Service                 Database Name(s)
User Service            user_service
Post Service	        post_service, post2_service
```
## Databases
```
CREATE DATABASE user_service;
CREATE DATABASE post_service;
CREATE DATABASE post2_service;
```
---
## Run both service
```
# Install dependencies for User Service
cd user-service
npm install

# Start User Service
npm run dev

# Install dependencies for Post Service
cd ../post-service
npm install

# Start User Service
npm run dev
```
---
## Default URLs
- **User Service**: http://localhost:5000
- **Post Service**: http://localhost:5001

---

## Postman Collection
In the both microservices I have added the postman collection in the postman folder, so you can just import both collections in you postman to use the APIs.

