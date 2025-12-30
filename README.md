# 🛒 Store - REST API with NestJS

A complete REST API developed with NestJS to manage an online store, including user, product, and order management with JWT authentication and Redis cache.

## 🛠️ Technologies Used

- **NestJS** (v11.0.1) - Node.js framework for building scalable applications
- **TypeORM** (v0.3.27) - ORM for TypeScript and JavaScript
- **PostgreSQL** - Relational database
- **Redis** - Cache system
- **JWT** - Authentication and authorization
- **Docker** - Database and cache containerization
- **bcrypt** - Password encryption
- **class-validator** and **class-transformer** - Data validation
- **Jest** - Testing framework (unit and E2E)

## 🚀 Features

### User Management
- ✅ Complete user CRUD
- ✅ Unique email validation
- ✅ Password hashing with bcrypt
- ✅ User data caching

### Product Management
- ✅ Complete product CRUD
- ✅ Support for multiple product images
- ✅ Product technical specifications
- ✅ Product categorization
- ✅ Product listing cache

### Order Management
- ✅ Order creation with multiple products
- ✅ Automatic total value calculation
- ✅ Automatic stock control
- ✅ Order status system (PENDING, COMPLETED, CANCELED)
- ✅ Order history per user
- ✅ JWT-protected routes

### Security and Performance
- ✅ JWT authentication
- ✅ Authentication guards
- ✅ Redis cache for better performance
- ✅ Data validation on all requests
- ✅ Password hashing
- ✅ Global exception handling

## 📋 Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

## 🔧 Installation and Setup

1. **Clone the repository:**
```bash
git clone https://github.com/mariyzx/nest-loja.git
cd nest-loja
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**

Create a `.env` file in the project root with the following variables:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=loja

# Redis Cache
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_jwt_secret_key

# Bcrypt
PASSWORD_SALT=your_password_salt

# Application
PORT=3000
```

4. **Start services with Docker:**
```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379

5. **Run database migrations:**
```bash
npm run typeorm migration:run
```

6. **Start the application:**
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

The API includes interactive documentation powered by **Swagger/OpenAPI**.

- **Swagger UI**: Access the interactive API documentation at `http://localhost:3000/api`
- Test all endpoints directly from your browser
- View request/response schemas and examples
- Explore all available routes and their parameters

## 🧪 Testing

The project has complete coverage of unit and E2E tests.

### Running tests

```bash
# Unit tests
npm run test

# Unit tests in watch mode
npm run test:watch

# E2E (end-to-end) tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Test Structure

```
test/
├── users/
│   ├── user.controller.spec.ts    # User controller tests
│   ├── user.service.spec.ts       # User service tests
│   └── users.e2e-spec.ts          # User E2E tests
├── products/
│   ├── product.controller.spec.ts # Product controller tests
│   ├── product.service.spec.ts    # Product service tests
│   └── products.e2e-spec.ts       # Product E2E tests
├── orders/
│   ├── order.controller.spec.ts   # Order controller tests
│   ├── order.service.spec.ts      # Order service tests
│   └── orders.e2e-spec.ts         # Order E2E tests
└── app.e2e-spec.ts                # Application E2E tests
```

**Test Statistics:**
- ✅ 29 unit tests
- ✅ 14 E2E tests
- ✅ 43 total tests

### Test coverage
```bash
npm run test:cov
```

## 🗄️ Database

The project uses **PostgreSQL** as the relational database and **Redis** for caching.

### Docker Services

The `docker-compose.yaml` configures the following services:

- **PostgreSQL** (port 5432) - Main database
- **PGAdmin** (port 8081) - Web interface for PostgreSQL management
  - Access: `http://localhost:8081`
  - Email: configured via environment variable
  - Password: configured via environment variable
- **Redis** (port 6379) - Cache system

### Migrations

TypeORM migrations manage the database schema:

```bash
# Run migrations
npm run typeorm migration:run

# Revert last migration
npm run typeorm migration:revert

# Generate new migration
npm run typeorm migration:generate -- -n MigrationName

# Create empty migration
npm run typeorm migration:create -- -n MigrationName
```

### Entities

- **UserEntity** - System users
- **ProductEntity** - Store products
- **ProductImageEntity** - Product images
- **ProductSpecificationEntity** - Technical specifications
- **OrderEntity** - Orders
- **ProductOrderEntity** - Many-to-many relationship between orders and products

## 💾 Cache

The system uses Redis for caching with the following strategies:

- **User cache**: Individual cache per user ID with configurable TTL
- **Product cache**: Complete product listing cache
- **CacheInterceptor**: Global interceptor for selected GET routes

## 🔒 Security

### JWT Authentication
- Token generated on login with 72-hour expiration
- Protection of sensitive routes with `AuthGuard`
- Token payload contains: `sub` (user ID) and `name`

### Password Hashing
- Passwords encrypted with bcrypt
- Configurable salt rounds via environment variable
- Custom `PasswordHashPipe` for automatic hashing

### Data Validation
- Automatic DTO validation with `class-validator`
- Data transformation with `class-transformer`
- Whitelist enabled (removes undeclared properties)
- Rejection of non-allowed properties

## 🚀 Available Scripts

```bash
# Development
npm run start:dev          # Start in development mode with watch
npm run start:debug        # Start in debug mode

# Production
npm run build              # Compile the project
npm run start:prod         # Start in production mode

# Code Quality
npm run format             # Format code with Prettier
npm run lint               # Run ESLint

# Testing
npm run test               # Unit tests
npm run test:watch         # Tests in watch mode
npm run test:cov           # Test coverage
npm run test:e2e           # E2E tests

# Database
npm run typeorm            # TypeORM CLI
```

## 📝 TO-DO List

### 🔨 Features to Implement
- [ ] **Pagination** - Add pagination to product and order listing
- [ ] **Search and Filters** - Implement search by name, category, and price range
- [ ] **Product Reviews** - Allow users to review and rate products
- [ ] **Shopping Cart** - Implement shopping cart before creating orders
- [ ] **Email Notifications** - Send email confirmations for orders and password reset
- [ ] **File Upload** - Upload product images to cloud storage (AWS S3, Cloudinary)
- [ ] **Wishlists** - Allow users to save favorite products
- [ ] **Inventory Management** - Low stock alerts and automatic reordering
- [ ] **Discount Coupons** - Create and apply discount codes to orders

### 🔐 Security Enhancements
- [ ] **Refresh Tokens** - Implement refresh token strategy
- [ ] **Rate Limiting** - Add request rate limiting to prevent abuse
- [ ] **Two-Factor Authentication (2FA)** - Add 2FA for user accounts
- [ ] **Input Sanitization** - Prevent XSS and SQL injection attacks
- [ ] **API Versioning** - Implement API versioning (v1, v2)

### 📊 Monitoring and Logging
- [ ] **Winston Logger** - Implement structured logging with Winston
- [ ] **Health Checks** - Add health check endpoints
- [ ] **Performance Monitoring** - Integrate APM (Application Performance Monitoring)
- [ ] **Error Tracking** - Integrate Sentry or similar for error tracking
- [ ] **Metrics Dashboard** - Create dashboard for API metrics

### 🧪 Testing Improvements
- [ ] **Increase Test Coverage** - Aim for 80%+ code coverage
- [ ] **Integration Tests** - Add more comprehensive integration tests

### 📚 Documentation
- [x] **Swagger/OpenAPI** - Generate interactive API documentation
- [ ] **Postman Collection** - Create and maintain Postman collection

### 🚀 DevOps and Deployment
- [ ] **CI/CD Pipeline** - Set up GitHub Actions or GitLab CI
- [ ] **Docker Compose for Production** - Optimize Docker setup for production
- [ ] **Environment Management** - Separate dev, staging, and production configs

### 📖 Learning Topics
- [ ] **GraphQL** - Study and potentially migrate some endpoints to GraphQL
- [ ] **Microservices** - Learn microservices architecture with NestJS
- [ ] **Message Queues** - Study RabbitMQ or Kafka for async processing
- [ ] **WebSockets** - Implement real-time features with Socket.io
- [ ] **CQRS Pattern** - Study Command Query Responsibility Segregation
- [ ] **Event Sourcing** - Learn event-driven architecture patterns
- [ ] **DDD (Domain-Driven Design)** - Apply DDD principles to the codebase

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/MyFeature`)
3. Commit your changes (`git commit -m 'Add MyFeature'`)
4. Push to the branch (`git push origin feature/MyFeature`)
5. Open a Pull Request

## 👩‍💻 Author

**Mariana Werneck** - [@mariyzx](https://github.com/mariyzx)

---

⭐ If this project helped you, consider giving it a star!
