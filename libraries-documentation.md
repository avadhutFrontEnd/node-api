# Node.js Libraries Documentation

This document provides detailed information about all the libraries and modules used in `server.js`.

---

## 🔷 Foundation: Understanding HTTP Request and Response Structure

Before diving into specific libraries, it's essential to understand the fundamental structure of HTTP requests and responses. This knowledge is the foundation for understanding how Express, multer, and other middleware work.

---

## HTTP Request Structure

An HTTP request consists of several parts that work together to send data from client to server.

### 1. Request Line (Start Line)

**Format:**
```
METHOD /path?query=value HTTP/1.1
```

**Example:**
```
GET /api/users?id=123 HTTP/1.1
POST /api/upload HTTP/1.1
PUT /api/users/123 HTTP/1.1
DELETE /api/users/123 HTTP/1.1
```

**Components:**
- **Method:** GET, POST, PUT, DELETE, PATCH, etc.
- **Path:** URL path (e.g., `/api/users`)
- **Query String:** Optional parameters after `?` (e.g., `?id=123&name=John`)
- **HTTP Version:** Usually `HTTP/1.1` or `HTTP/2`

### 2. Request Headers

Headers provide metadata about the request. They are key-value pairs.

#### Standard Headers

**Content-Type** - Specifies the format of the request body:
```
Content-Type: application/json
Content-Type: application/x-www-form-urlencoded
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary
Content-Type: text/plain
Content-Type: application/xml
```

**Content-Length** - Size of request body in bytes:
```
Content-Length: 1234
```

**Authorization** - Authentication credentials:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
```

**Host** - Server domain and port:
```
Host: localhost:3000
Host: api.example.com
```

**User-Agent** - Client application information:
```
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
```

**Accept** - What response formats the client accepts:
```
Accept: application/json
Accept: text/html, application/json
Accept: */*
```

**Accept-Language** - Preferred languages:
```
Accept-Language: en-US, en;q=0.9
```

**Cookie** - Stored cookies:
```
Cookie: sessionId=abc123; theme=dark
```

**Referer** - Previous page URL:
```
Referer: https://example.com/page
```

**Origin** - Request origin (for CORS):
```
Origin: http://localhost:3000
```

#### Custom Headers

You can create custom headers (usually prefixed with `X-`):
```
X-API-Key: your-api-key-here
X-Request-ID: unique-request-id
X-Custom-Header: custom-value
X-Client-Version: 1.0.0
```

### 3. Request Body

The body contains the actual data being sent. **Not all requests have a body** (GET requests typically don't).

#### Body Formats

**JSON (`application/json`):**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "age": 30
}
```

**URL-Encoded (`application/x-www-form-urlencoded`):**
```
username=john_doe&email=john%40example.com&age=30
```

**Form Data (`multipart/form-data`):**
```
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="username"

john_doe
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="photo.jpg"
Content-Type: image/jpeg

[binary file data]
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

**Plain Text (`text/plain`):**
```
This is plain text content
```

**XML (`application/xml`):**
```xml
<user>
  <username>john_doe</username>
  <email>john@example.com</email>
</user>
```

### Complete Request Example

**GET Request (No Body):**
```http
GET /api/users?id=123 HTTP/1.1
Host: localhost:3000
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
User-Agent: Mozilla/5.0
```

**POST Request (With JSON Body):**
```http
POST /api/users HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Content-Length: 45
Authorization: Bearer token123
Accept: application/json

{
  "username": "john_doe",
  "email": "john@example.com"
}
```

**POST Request (With File Upload):**
```http
POST /api/upload HTTP/1.1
Host: localhost:3000
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Length: 12345
Authorization: Bearer token123

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="username"

john_doe
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="photo.jpg"
Content-Type: image/jpeg

[binary file data]
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

---

## HTTP Response Structure

An HTTP response contains the server's reply to the client's request.

### 1. Status Line

**Format:**
```
HTTP/1.1 STATUS_CODE STATUS_MESSAGE
```

**Common Status Codes:**
- **200 OK** - Request successful
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid request
- **401 Unauthorized** - Authentication required
- **403 Forbidden** - Access denied
- **404 Not Found** - Resource not found
- **429 Too Many Requests** - Rate limit exceeded
- **500 Internal Server Error** - Server error

**Example:**
```
HTTP/1.1 200 OK
HTTP/1.1 201 Created
HTTP/1.1 400 Bad Request
HTTP/1.1 404 Not Found
HTTP/1.1 500 Internal Server Error
```

### 2. Response Headers

Similar to request headers, but sent by the server.

#### Standard Response Headers

**Content-Type** - Format of response body:
```
Content-Type: application/json
Content-Type: text/html
Content-Type: image/jpeg
Content-Type: application/pdf
```

**Content-Length** - Size of response body:
```
Content-Length: 1234
```

**Set-Cookie** - Set cookies in browser:
```
Set-Cookie: sessionId=abc123; Path=/; HttpOnly
Set-Cookie: theme=dark; Path=/; Max-Age=3600
```

**Location** - Redirect URL:
```
Location: https://example.com/new-page
```

**Cache-Control** - Caching instructions:
```
Cache-Control: no-cache
Cache-Control: max-age=3600
Cache-Control: public, max-age=31536000
```

**Access-Control-Allow-Origin** - CORS header:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Origin: http://localhost:3000
```

**Access-Control-Allow-Methods** - Allowed HTTP methods (CORS):
```
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
```

**Access-Control-Allow-Headers** - Allowed headers (CORS):
```
Access-Control-Allow-Headers: Content-Type, Authorization
```

**RateLimit-Limit** - Rate limiting info:
```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1704067200
```

**WWW-Authenticate** - Authentication challenge:
```
WWW-Authenticate: Bearer realm="api"
```

#### Custom Response Headers

```
X-Request-ID: unique-request-id
X-Response-Time: 123ms
X-Custom-Header: custom-value
```

### 3. Response Body

The actual data returned to the client.

#### Common Response Formats

**JSON Response:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

**HTML Response:**
```html
<!DOCTYPE html>
<html>
<head>
  <title>Page Title</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

**Plain Text Response:**
```
Success: User created
```

**Error Response (JSON):**
```json
{
  "success": false,
  "error": "Invalid request",
  "message": "Username is required"
}
```

### Complete Response Example

**Success Response (JSON):**
```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 89
Access-Control-Allow-Origin: *
X-Request-ID: abc-123-def

{
  "success": true,
  "data": {
    "id": 123,
    "username": "john_doe"
  }
}
```

**Error Response:**
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
Content-Length: 67

{
  "success": false,
  "error": "Validation failed",
  "message": "Email is required"
}
```

**File Response:**
```http
HTTP/1.1 200 OK
Content-Type: image/jpeg
Content-Length: 123456
Cache-Control: public, max-age=31536000

[binary image data]
```

---

## Understanding Content-Type

Content-Type is crucial for determining how to parse request/response data.

### Request Content-Types

| Content-Type | Use Case | Example |
|-------------|----------|---------|
| `application/json` | JSON data | `{"name": "John"}` |
| `application/x-www-form-urlencoded` | HTML forms | `name=John&age=30` |
| `multipart/form-data` | File uploads | Form with files |
| `text/plain` | Plain text | `Hello World` |
| `application/xml` | XML data | `<user><name>John</name></user>` |

### Response Content-Types

| Content-Type | Use Case | Example |
|-------------|----------|---------|
| `application/json` | API responses | `{"data": {...}}` |
| `text/html` | Web pages | `<html>...</html>` |
| `image/jpeg` | Images | Binary image data |
| `application/pdf` | PDF files | Binary PDF data |
| `text/css` | Stylesheets | CSS code |
| `application/javascript` | JavaScript | JS code |

---

## Understanding Authorization

Authorization headers authenticate requests.

### Bearer Token (JWT)
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Usage:**
```javascript
// Frontend
fetch('/api/data', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
});

// Backend (Express)
const token = req.headers.authorization?.split(' ')[1];
```

### Basic Authentication
```
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
```

**Format:** Base64 encoded `username:password`
```javascript
// Create Basic Auth header
const credentials = Buffer.from('username:password').toString('base64');
// Result: dXNlcm5hbWU6cGFzc3dvcmQ=
```

### API Key
```
Authorization: ApiKey your-api-key-here
X-API-Key: your-api-key-here
```

---

## Request Object in Express (`req`)

When Express receives a request, it creates a `req` object containing:

### Request Properties

**Headers:**
```javascript
req.headers              // All headers
req.headers.authorization
req.headers['content-type']
req.get('authorization')  // Get specific header
```

**Body:**
```javascript
req.body                 // Parsed body (after middleware)
req.body.username        // Access body fields
```

**Query Parameters:**
```javascript
req.query                // Query string parameters
req.query.id             // ?id=123
req.query.page           // ?page=1&limit=10
```

**Route Parameters:**
```javascript
req.params               // Route parameters
req.params.id            // /users/:id
```

**Files:**
```javascript
req.file                 // Single file (multer)
req.files                // Multiple files (multer)
```

**Method and URL:**
```javascript
req.method               // GET, POST, PUT, DELETE
req.url                  // /api/users?id=123
req.path                 // /api/users
req.originalUrl          // Full original URL
```

**IP and Host:**
```javascript
req.ip                   // Client IP address
req.hostname             // Hostname
req.protocol             // http or https
```

---

## Response Object in Express (`res`)

The `res` object is used to send responses:

### Response Methods

**Send JSON:**
```javascript
res.json({ success: true, data: {...} });
```

**Send Status + JSON:**
```javascript
res.status(201).json({ success: true });
```

**Send Text:**
```javascript
res.send('Hello World');
```

**Set Headers:**
```javascript
res.set('X-Custom-Header', 'value');
res.setHeader('Content-Type', 'application/json');
```

**Set Status:**
```javascript
res.status(404);
res.status(200).json({ data: {...} });
```

**Redirect:**
```javascript
res.redirect('/new-page');
res.redirect(301, '/permanent-redirect');
```

**Send File:**
```javascript
res.sendFile('/path/to/file.pdf');
```

---

## Quick Reference: Request vs Response

| Component | Request | Response |
|-----------|---------|----------|
| **Start Line** | `METHOD /path HTTP/1.1` | `HTTP/1.1 STATUS_CODE STATUS_MESSAGE` |
| **Headers** | Request metadata | Response metadata |
| **Body** | Data sent to server | Data sent to client |
| **Content-Type** | Format of request body | Format of response body |
| **Authorization** | Client credentials | Usually not present |
| **Set-Cookie** | Cookie header (sent) | Set-Cookie header (received) |
| **Status Code** | Not applicable | 200, 404, 500, etc. |

---

## How Libraries Use This Structure

### Express
- **Parses headers** to determine content type
- **Extracts body** based on Content-Type
- **Provides `req` and `res`** objects with all this data

### Multer
- **Reads `Content-Type: multipart/form-data`** header
- **Parses multipart body** with boundaries
- **Extracts files and form fields**

### CORS
- **Reads `Origin` header** from request
- **Adds CORS headers** to response (`Access-Control-Allow-Origin`)

### express.json()
- **Checks `Content-Type: application/json`** header
- **Parses JSON body** into `req.body`

### express.urlencoded()
- **Checks `Content-Type: application/x-www-form-urlencoded`** header
- **Parses URL-encoded body** into `req.body`

---

## 1. Express

**Package:** `express`  
**Type:** External NPM Package  
**Purpose:** Web application framework for Node.js

### Description
Express is a minimal and flexible Node.js web application framework that provides a robust set of features for building web and mobile applications. It simplifies the process of writing server-side code by providing utilities for HTTP requests, responses, routing, and middleware.

### Key Features
- **Routing:** Define routes for different HTTP methods (GET, POST, PUT, DELETE, etc.)
- **Middleware:** Chain of functions that execute during request/response cycle
- **Template Engines:** Support for various template engines (EJS, Pug, Handlebars)
- **Static Files:** Serve static files (HTML, CSS, JavaScript, images)
- **Request/Response Objects:** Enhanced objects with additional methods and properties

### Common Usage
```javascript
const app = express();
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});
app.listen(3000);
```

### Installation
```bash
npm install express
```

---

## 1.1. App.use() - Understanding Express Middleware

### What is `app.use()`?

**Purpose:** Register middleware functions that execute for every HTTP request (or specific routes)

`app.use()` is one of the most fundamental methods in Express. It's used to mount middleware functions that process requests before they reach your route handlers.

### Key Concepts

**Middleware:** Functions that have access to:
- `req` (request object)
- `res` (response object)
- `next` (function to pass control to next middleware)

**Execution Flow:**
```
Request → Middleware 1 → Middleware 2 → Middleware 3 → Route Handler → Response
```

### Syntax

```javascript
// Basic syntax
app.use(middlewareFunction);

// With path (only applies to specific routes)
app.use('/path', middlewareFunction);

// Multiple middleware
app.use(middleware1, middleware2, middleware3);
```

### Real-World Scenarios

#### Scenario 1: Global Middleware (All Routes)

**Applies to ALL requests:**
```javascript
// This middleware runs for EVERY request
app.use(express.json());           // Parse JSON for all routes
app.use(cors());                   // Enable CORS for all routes
app.use(express.urlencoded({ extended: true })); // Parse forms for all routes
```

**Example:**
```javascript
app.use(express.json());  // Runs for ALL routes

app.get('/users', (req, res) => {
  // express.json() already ran, req.body is available
  res.json({ users: [] });
});

app.post('/login', (req, res) => {
  // express.json() already ran, req.body is available
  console.log(req.body);  // Parsed JSON object
});
```

#### Scenario 2: Path-Specific Middleware

**Applies only to routes starting with the path:**
```javascript
// Only applies to routes starting with '/api'
app.use('/api', someMiddleware);

// These routes will use the middleware:
// GET /api/users     ✅ Uses middleware
// POST /api/login    ✅ Uses middleware
// GET /api/data      ✅ Uses middleware

// These routes will NOT use the middleware:
// GET /users         ❌ No middleware
// GET /home          ❌ No middleware
```

**Example:**
```javascript
// Rate limiter only for API routes
app.use('/api', rateLimiter);

app.get('/api/users', (req, res) => {
  // Rate limiter applies here
  res.json({ users: [] });
});

app.get('/home', (req, res) => {
  // Rate limiter does NOT apply here
  res.send('Home page');
});
```

#### Scenario 3: Multiple Middleware Functions

**Chain multiple middleware:**
```javascript
// Multiple middleware functions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Or combine them
app.use(
  express.json(),
  express.urlencoded({ extended: true }),
  cors()
);
```

**Execution order matters:**
```javascript
// Middleware executes in order
app.use(middleware1);  // Runs first
app.use(middleware2);  // Runs second
app.use(middleware3);  // Runs third

// Then routes
app.get('/users', handler);  // All middleware ran before this
```

#### Scenario 4: Your Current Code

**From your server.js:**
```javascript
// Middleware - applies to ALL routes
app.use(cors());                              // Enable CORS globally
app.use(express.json());                      // Parse JSON globally
app.use(express.urlencoded({ extended: true })); // Parse forms globally
app.use("/uploads", express.static("uploads")); // Serve static files at /uploads

// Path-specific middleware
app.use("/api/", generalLimiter);  // Rate limit only for /api routes
```

**What this means:**
- ✅ **CORS, JSON, URL-encoded** apply to ALL routes
- ✅ **Static files** served at `/uploads` path
- ✅ **Rate limiting** applies only to routes starting with `/api`

### Understanding Path Matching

**Path matching rules:**
```javascript
app.use('/api', middleware);

// ✅ Matches (starts with /api):
// /api
// /api/users
// /api/users/123
// /api/login

// ❌ Doesn't match:
// /apiusers
// /user/api
// /home
```

**Root path:**
```javascript
app.use('/', middleware);  // Matches ALL routes (same as app.use(middleware))
app.use(middleware);       // Also matches ALL routes
```

### Middleware Execution Order

**Critical:** Middleware executes in the order it's defined!

```javascript
// Order matters!
app.use(middleware1);  // 1st - Runs first
app.use(middleware2);  // 2nd - Runs second
app.use(middleware3);  // 3rd - Runs third

app.get('/users', handler);  // Route handler runs last
```

**Example showing order:**
```javascript
app.use((req, res, next) => {
  console.log('Middleware 1');
  next();  // Pass to next middleware
});

app.use((req, res, next) => {
  console.log('Middleware 2');
  next();
});

app.get('/test', (req, res) => {
  console.log('Route handler');
  res.send('Done');
});

// Request to /test outputs:
// Middleware 1
// Middleware 2
// Route handler
```

### Common Middleware Patterns

#### Pattern 1: Global Configuration
```javascript
// Apply to all routes
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
```

#### Pattern 2: Route-Specific
```javascript
// Apply only to specific routes
app.use('/api', rateLimiter);
app.use('/admin', adminAuth);
app.use('/uploads', express.static('uploads'));
```

#### Pattern 3: Conditional Middleware
```javascript
// Apply conditionally
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));  // Logging only in development
}
```

#### Pattern 4: Error Handling
```javascript
// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});
```

### Complete Example: Understanding Your Server

**Your server.js structure:**
```javascript
// 1. Global middleware (runs for ALL requests)
app.use(cors());                              // Enable CORS
app.use(express.json());                      // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use("/uploads", express.static("uploads")); // Serve static files

// 2. Route-specific middleware
app.use("/api/", generalLimiter);  // Rate limit only /api routes

// 3. Route handlers (would go here)
app.get('/api/users', (req, res) => {
  // All global middleware ran
  // Rate limiter ran (because path starts with /api)
  res.json({ users: [] });
});

app.get('/home', (req, res) => {
  // All global middleware ran
  // Rate limiter did NOT run (path doesn't start with /api)
  res.send('Home page');
});
```

### Request Flow Example

**When a request comes to `/api/users`:**

```
1. Request arrives: GET /api/users
   ↓
2. cors() middleware runs
   ↓
3. express.json() middleware runs
   ↓
4. express.urlencoded() middleware runs
   ↓
5. express.static() checks - doesn't match /uploads, continues
   ↓
6. generalLimiter middleware runs (matches /api)
   ↓
7. Route handler executes: app.get('/api/users', ...)
   ↓
8. Response sent
```

**When a request comes to `/uploads/image.jpg`:**

```
1. Request arrives: GET /uploads/image.jpg
   ↓
2. cors() middleware runs
   ↓
3. express.json() middleware runs
   ↓
4. express.urlencoded() middleware runs
   ↓
5. express.static() matches /uploads - serves image.jpg
   ↓
6. Response sent (stops here, doesn't reach route handlers)
```

### Key Points to Remember

1. **`app.use()` registers middleware** that runs before route handlers
2. **Order matters** - middleware executes in the order defined
3. **Path matching** - `/api` matches all routes starting with `/api`
4. **Global vs Specific** - Without path, applies to all; with path, applies to matching routes
5. **Middleware can modify** `req` and `res` objects
6. **Call `next()`** to pass control to next middleware/route
7. **Static files** can stop the request chain (if file is found)

### Common Mistakes

❌ **Wrong - Middleware after routes:**
```javascript
app.get('/users', handler);
app.use(express.json());  // ❌ Too late! Routes already defined
```

✅ **Correct - Middleware before routes:**
```javascript
app.use(express.json());  // ✅ Define middleware first
app.get('/users', handler);
```

❌ **Wrong - Wrong path format:**
```javascript
app.use('./api', middleware);  // ❌ Should be '/api'
```

✅ **Correct - Proper path format:**
```javascript
app.use('/api', middleware);  // ✅ Correct
```

---

## 2. MySQL2 (Promise-based)

**Package:** `mysql2/promise`  
**Type:** External NPM Package  
**Purpose:** MySQL database client with Promise support

### Description
MySQL2 is a fast MySQL client for Node.js with support for promises and async/await. The `/promise` import provides a Promise-based API instead of callback-based, making it easier to work with modern async JavaScript.

---

## 2.0. Connection Methods: Pool vs Single Connection

MySQL2 provides two main ways to connect to the database. Understanding the difference is crucial for choosing the right approach.

### Method 1: Connection Pool (`createPool`) - What You're Using

**What it is:**
- A pool of reusable database connections
- Connections are created once and reused for multiple queries
- Automatically manages connection lifecycle

**How it works:**
```
Application Start
    ↓
Create Pool (10 connections ready)
    ↓
Query 1 → Uses Connection 1 → Returns to Pool
Query 2 → Uses Connection 2 → Returns to Pool
Query 3 → Reuses Connection 1 → Returns to Pool
    ↓
All connections stay alive and ready
```

**Your Current Code:**
```javascript
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,  // 10 connections in pool
});

// Use pool directly
await pool.query('SELECT * FROM users');
```

### Method 2: Single Connection (`createConnection`)

**What it is:**
- One database connection
- Created when needed, closed when done
- Must manually manage connection lifecycle

**How it works:**
```
Query 1 → Create Connection → Execute → Close Connection
Query 2 → Create Connection → Execute → Close Connection
Query 3 → Create Connection → Execute → Close Connection
```

**Example:**
```javascript
// Create a single connection
const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Use connection
await connection.query('SELECT * FROM users');

// Must manually close
await connection.end();
```

---

## Comparison: Pool vs Single Connection

### Performance Comparison

| Aspect | Connection Pool | Single Connection |
|--------|----------------|-------------------|
| **Connection Creation** | Once at startup | Every query |
| **Query Speed** | ⚡ Fast (reuses connections) | 🐢 Slower (creates new each time) |
| **Resource Usage** | Higher (keeps connections alive) | Lower (closes after use) |
| **Concurrent Queries** | ✅ Handles multiple simultaneously | ❌ One at a time |
| **Best For** | Production, high traffic | Development, simple scripts |

### Detailed Comparison

#### 1. Connection Management

**Pool:**
```javascript
// Create once at startup
const pool = mysql.createPool({...});

// Use anywhere - connections managed automatically
await pool.query('SELECT * FROM users');
await pool.query('SELECT * FROM products');
// No need to close - pool manages it
```

**Single Connection:**
```javascript
// Must create for each operation
const connection = await mysql.createConnection({...});
await connection.query('SELECT * FROM users');
await connection.end();  // Must close manually

// Next query needs new connection
const connection2 = await mysql.createConnection({...});
await connection2.query('SELECT * FROM products');
await connection2.end();
```

#### 2. Concurrent Requests

**Pool (Handles Multiple Simultaneously):**
```javascript
// All these can run at the same time
Promise.all([
  pool.query('SELECT * FROM users'),
  pool.query('SELECT * FROM products'),
  pool.query('SELECT * FROM orders'),
]);
// ✅ Uses different connections from pool
```

**Single Connection (One at a Time):**
```javascript
// Must wait for each to complete
const conn1 = await mysql.createConnection({...});
await conn1.query('SELECT * FROM users');
await conn1.end();

const conn2 = await mysql.createConnection({...});
await conn2.query('SELECT * FROM products');
await conn2.end();
// ❌ Sequential, slower
```

#### 3. Resource Usage

**Pool:**
- Keeps connections alive (uses memory)
- Better for frequent queries
- Higher initial resource usage

**Single Connection:**
- Creates/destroys connections (CPU overhead)
- Better for occasional queries
- Lower memory usage

#### 4. Error Handling

**Pool:**
```javascript
// Pool automatically handles connection errors
// If one connection fails, others still work
try {
  await pool.query('SELECT * FROM users');
} catch (error) {
  // Pool continues to work with other connections
}
```

**Single Connection:**
```javascript
// If connection fails, must recreate
try {
  const connection = await mysql.createConnection({...});
  await connection.query('SELECT * FROM users');
  await connection.end();
} catch (error) {
  // Connection is dead, must create new one
  const newConnection = await mysql.createConnection({...});
}
```

---

## When to Use Each Method

### Use Connection Pool (`createPool`) When:

✅ **Production applications** - Your current use case  
✅ **High traffic** - Many concurrent requests  
✅ **Frequent queries** - Multiple queries per second  
✅ **Web servers** - Express.js, API servers  
✅ **Long-running applications** - Services that stay alive  
✅ **Multiple users** - Applications with concurrent users  

**Example - Your Server:**
```javascript
// ✅ Perfect use case - Express server with multiple routes
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});

app.get('/api/users', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM users');
  res.json(rows);
});

app.get('/api/products', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM products');
  res.json(rows);
});
// Both can run simultaneously using different pool connections
```

### Use Single Connection (`createConnection`) When:

✅ **Simple scripts** - One-time operations  
✅ **CLI tools** - Command-line utilities  
✅ **Development/testing** - Quick database checks  
✅ **Infrequent queries** - Occasional database access  
✅ **Single-user applications** - Desktop apps  
✅ **Migration scripts** - Database setup scripts  

**Example - Simple Script:**
```javascript
// ✅ Good for one-time script
const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydb',
});

await connection.query('INSERT INTO logs (message) VALUES (?)', ['Script started']);
await connection.end();
// Script ends, connection closed
```

---

## Code Examples: Pool vs Single Connection

### Example 1: Handling Multiple Requests

**With Pool (Your Current Approach):**
```javascript
const pool = mysql.createPool({...});

// Route 1 - Can run simultaneously
app.get('/users', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM users');
  res.json(rows);
});

// Route 2 - Can run simultaneously with Route 1
app.get('/products', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM products');
  res.json(rows);
});

// ✅ Both routes can handle requests at the same time
// ✅ Uses different connections from pool
```

**With Single Connection (Not Recommended for Servers):**
```javascript
// ❌ Problem: Can only handle one request at a time
let connection;

app.get('/users', async (req, res) => {
  connection = await mysql.createConnection({...});
  const [rows] = await connection.query('SELECT * FROM users');
  await connection.end();
  res.json(rows);
});

app.get('/products', async (req, res) => {
  // Must wait if /users is still running
  connection = await mysql.createConnection({...});
  const [rows] = await connection.query('SELECT * FROM products');
  await connection.end();
  res.json(rows);
});
```

### Example 2: Performance Test

**Pool (Fast):**
```javascript
const pool = mysql.createPool({...});

// Time: ~100ms for 10 queries (parallel)
const start = Date.now();
await Promise.all([
  pool.query('SELECT * FROM users'),
  pool.query('SELECT * FROM products'),
  pool.query('SELECT * FROM orders'),
  // ... 7 more queries
]);
console.log(`Time: ${Date.now() - start}ms`); // ~100ms
```

**Single Connection (Slow):**
```javascript
// Time: ~1000ms for 10 queries (sequential)
const start = Date.now();
for (let i = 0; i < 10; i++) {
  const conn = await mysql.createConnection({...});
  await conn.query('SELECT * FROM users');
  await conn.end();
}
console.log(`Time: ${Date.now() - start}ms`); // ~1000ms
```

---

## Pool Configuration Explained

### Why `connectionLimit: 10`?

```javascript
const pool = mysql.createPool({
  connectionLimit: 10,  // Maximum 10 connections
});
```

**What this means:**
- Pool creates up to 10 connections
- If all 10 are busy, new requests wait in queue
- When a connection finishes, it's reused

**Scenarios:**

**Scenario 1: Low Traffic (1-5 concurrent requests)**
```
Request 1 → Connection 1
Request 2 → Connection 2
Request 3 → Connection 3
// Connections 4-10 unused (ready for future requests)
```

**Scenario 2: High Traffic (15 concurrent requests)**
```
Request 1-10 → Connections 1-10 (active)
Request 11-15 → Waiting in queue
// When Connection 1 finishes, Request 11 uses it
```

### Pool Options You Should Know

```javascript
const pool = mysql.createPool({
  connectionLimit: 10,        // Max connections in pool
  queueLimit: 0,             // Max queued requests (0 = unlimited)
  waitForConnections: true,   // Wait if pool is full
  acquireTimeout: 10000,      // Timeout to get connection
  reconnect: true,           // Auto-reconnect on failure
});
```

---

## Common Mistakes

### ❌ Mistake 1: Creating Pool for Each Request

```javascript
// ❌ WRONG - Creates new pool every time
app.get('/users', async (req, res) => {
  const pool = mysql.createPool({...});
  const [rows] = await pool.query('SELECT * FROM users');
  res.json(rows);
});
```

**Problem:** Creates new pool for each request (defeats the purpose)

**✅ Correct:**
```javascript
// ✅ RIGHT - Create pool once at startup
const pool = mysql.createPool({...});

app.get('/users', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM users');
  res.json(rows);
});
```

### ❌ Mistake 2: Using Single Connection in Production

```javascript
// ❌ WRONG - For production server
let connection;

app.get('/users', async (req, res) => {
  connection = await mysql.createConnection({...});
  const [rows] = await connection.query('SELECT * FROM users');
  await connection.end();
  res.json(rows);
});
```

**Problem:** Can't handle concurrent requests efficiently

**✅ Correct:**
```javascript
// ✅ RIGHT - Use pool for production
const pool = mysql.createPool({...});

app.get('/users', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM users');
  res.json(rows);
});
```

### ❌ Mistake 3: Not Closing Single Connections

```javascript
// ❌ WRONG - Connection stays open
const connection = await mysql.createConnection({...});
await connection.query('SELECT * FROM users');
// Forgot to close - connection stays alive!
```

**✅ Correct:**
```javascript
// ✅ RIGHT - Always close single connections
const connection = await mysql.createConnection({...});
try {
  await connection.query('SELECT * FROM users');
} finally {
  await connection.end();  // Always close
}
```

---

## Summary: Pool vs Single Connection

| Feature | Pool (`createPool`) | Single Connection (`createConnection`) |
|---------|-------------------|----------------------------------------|
| **Best For** | Production, servers | Scripts, development |
| **Performance** | ⚡ Fast (reuses connections) | 🐢 Slower (creates each time) |
| **Concurrent Requests** | ✅ Yes (multiple at once) | ❌ No (one at a time) |
| **Connection Management** | ✅ Automatic | ❌ Manual (must close) |
| **Resource Usage** | Higher (keeps connections) | Lower (closes after use) |
| **Error Recovery** | ✅ Automatic | ❌ Manual |
| **Your Use Case** | ✅ Perfect for Express server | ❌ Not suitable |

**Recommendation:** For your Express server, **continue using `createPool()`** - it's the right choice! 🎯

---

## 2.1. Step 1: Create Connection Pool (`createPool`)

### Basic Setup

**Import:**
```javascript
const mysql = require("mysql2/promise");
```

**Create Pool:**
```javascript
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "myapp_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
```

### Pool Configuration Options (Day-to-Day Use)

**Essential Options:**
```javascript
const pool = mysql.createPool({
  // Connection details
  host: "localhost",              // Database host
  user: "root",                   // Database user
  password: "your_password",      // Database password
  database: "myapp_db",           // Database name
  port: 3306,                     // MySQL port (default: 3306)
  
  // Pool management
  waitForConnections: true,       // Wait for available connection if pool is full
  connectionLimit: 10,           // Maximum connections in pool (default: 10)
  queueLimit: 0,                  // Max queued requests (0 = unlimited)
  
  // Connection settings
  connectTimeout: 10000,          // Connection timeout in ms (default: 10000)
  acquireTimeout: 10000,           // Timeout to get connection from pool
  timeout: 60000,                 // Query timeout in ms (default: 60000)
  
  // Reconnection
  reconnect: true,                // Auto-reconnect on connection loss
});
```

**Using Environment Variables (Recommended):**
```javascript
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "myapp_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
```

**Your `.env` file:**
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=myapp_db
```

---

## 2.2. Step 2: Get Connection from Pool (`getConnection`)

### When to Use `getConnection()`

Use `getConnection()` when you need:
- **Transaction support** (multiple queries that must succeed/fail together)
- **Manual connection management**
- **Testing connection**

### Basic Usage

```javascript
// Get a connection from the pool
const connection = await pool.getConnection();

try {
  // Use the connection
  const [rows] = await connection.query('SELECT * FROM users');
  
  // Always release the connection back to the pool
  connection.release();
} catch (error) {
  // Release connection even on error
  connection.release();
  throw error;
}
```

### Your Code Pattern (Testing Connection)

```javascript
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully");
    connection.release();  // Release connection back to pool
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
}
```

### Connection Methods and Properties

**Methods:**
```javascript
const connection = await pool.getConnection();

// Execute query
const [rows] = await connection.query('SELECT * FROM users');
const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [1]);

// Start transaction
await connection.beginTransaction();

// Commit transaction
await connection.commit();

// Rollback transaction
await connection.rollback();

// Release connection (IMPORTANT!)
connection.release();
```

**Properties:**
```javascript
connection.threadId        // Connection thread ID
connection.state          // Connection state
```

---

## 2.3. Step 3: Execute Queries (`query` or `execute`)

### Two Ways to Query

#### Method 1: `pool.query()` - Direct Query (Your Current Usage)

**Simple queries without parameters:**
```javascript
// Direct query on pool (no need to get connection)
const [rows] = await pool.query('SELECT * FROM users');
```

**With parameters (using placeholders):**
```javascript
// Using ? placeholders (automatic escaping)
const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [1]);
const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND status = ?', ['user@example.com', 'active']);
```

**Your Code Pattern:**
```javascript
// Creating tables
await pool.query(`CREATE TABLE IF NOT EXISTS users(
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);
```

#### Method 2: `pool.execute()` - Prepared Statements (More Secure)

**Prepared statements (recommended for user input):**
```javascript
// More secure - uses prepared statements
const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [1]);
const [rows] = await pool.execute('INSERT INTO users (name, email) VALUES (?, ?)', ['John', 'john@example.com']);
```

**Difference:**
- `query()` - Simple query execution
- `execute()` - Prepared statement (better for security, slightly slower)

### Understanding Query Results

**Query returns array with two elements:**
```javascript
const [rows, fields] = await pool.query('SELECT * FROM users');

// rows - Array of result rows
console.log(rows);
// [
//   { id: 1, name: 'John', email: 'john@example.com' },
//   { id: 2, name: 'Jane', email: 'jane@example.com' }
// ]

// fields - Metadata about columns (usually not needed)
console.log(fields);
```

**Common Patterns:**
```javascript
// Get all rows
const [rows] = await pool.query('SELECT * FROM users');
const users = rows;

// Get single row
const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [1]);
const user = rows[0];  // First row or undefined

// Get count
const [rows] = await pool.query('SELECT COUNT(*) as count FROM users');
const count = rows[0].count;

// Check if exists
const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
const exists = rows.length > 0;
```

---

## 2.4. Day-to-Day Query Patterns

### SELECT Queries

**Get all records:**
```javascript
const [rows] = await pool.query('SELECT * FROM users');
```

**Get with conditions:**
```javascript
const [rows] = await pool.query(
  'SELECT * FROM users WHERE status = ? AND role = ?',
  ['active', 'user']
);
```

**Get single record:**
```javascript
const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
const user = rows[0];  // Single user or undefined
```

**Get with pagination:**
```javascript
const page = 1;
const limit = 10;
const offset = (page - 1) * limit;

const [rows] = await pool.query(
  'SELECT * FROM users LIMIT ? OFFSET ?',
  [limit, offset]
);
```

**Get with JOIN:**
```javascript
const [rows] = await pool.query(`
  SELECT u.*, d.title 
  FROM users u 
  LEFT JOIN documents d ON u.id = d.user_id 
  WHERE u.id = ?
`, [userId]);
```

### INSERT Queries

**Insert single record:**
```javascript
const [result] = await pool.query(
  'INSERT INTO users (name, email) VALUES (?, ?)',
  ['John Doe', 'john@example.com']
);

const newUserId = result.insertId;  // Get the inserted ID
```

**Insert multiple records:**
```javascript
const users = [
  ['John', 'john@example.com'],
  ['Jane', 'jane@example.com']
];

const [result] = await pool.query(
  'INSERT INTO users (name, email) VALUES ?',
  [users]
);
```

### UPDATE Queries

**Update single record:**
```javascript
const [result] = await pool.query(
  'UPDATE users SET name = ?, email = ? WHERE id = ?',
  ['John Updated', 'newemail@example.com', userId]
);

const affectedRows = result.affectedRows;  // Number of rows updated
```

**Update with conditions:**
```javascript
const [result] = await pool.query(
  'UPDATE users SET status = ? WHERE status = ? AND created_at < ?',
  ['inactive', 'active', oldDate]
);
```

### DELETE Queries

**Delete single record:**
```javascript
const [result] = await pool.query(
  'DELETE FROM users WHERE id = ?',
  [userId]
);

const affectedRows = result.affectedRows;  // Number of rows deleted
```

**Delete with conditions:**
```javascript
const [result] = await pool.query(
  'DELETE FROM users WHERE status = ? AND created_at < ?',
  ['inactive', oldDate]
);
```

### Result Object Properties

**After INSERT:**
```javascript
const [result] = await pool.query('INSERT INTO users (name) VALUES (?)', ['John']);
console.log(result.insertId);      // New record ID
console.log(result.affectedRows);   // 1
```

**After UPDATE/DELETE:**
```javascript
const [result] = await pool.query('UPDATE users SET name = ? WHERE id = ?', ['John', 1]);
console.log(result.affectedRows);   // Number of rows affected
console.log(result.changedRows);    // Number of rows actually changed
```

**After SELECT:**
```javascript
const [rows] = await pool.query('SELECT * FROM users');
console.log(rows.length);          // Number of rows returned
console.log(rows[0]);              // First row object
```

---

## 2.5. Error Handling Pattern

### Try-Catch Pattern (Your Style)

```javascript
async function getUserById(userId) {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    return rows[0];
  } catch (error) {
    console.error('Database error:', error.message);
    throw error;  // Re-throw to handle in route
  }
}
```

### Common Error Types

```javascript
try {
  await pool.query('SELECT * FROM users');
} catch (error) {
  if (error.code === 'ER_DUP_ENTRY') {
    // Duplicate entry error
    console.error('Duplicate entry');
  } else if (error.code === 'ER_NO_SUCH_TABLE') {
    // Table doesn't exist
    console.error('Table not found');
  } else if (error.code === 'ECONNREFUSED') {
    // Connection refused
    console.error('Cannot connect to database');
  } else {
    // Other errors
    console.error('Database error:', error.message);
  }
}
```

---

## 2.6. Transactions (Using getConnection)

**When you need multiple queries to succeed or fail together:**

```javascript
async function transferMoney(fromUserId, toUserId, amount) {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Deduct from sender
    await connection.query(
      'UPDATE accounts SET balance = balance - ? WHERE user_id = ?',
      [amount, fromUserId]
    );
    
    // Add to receiver
    await connection.query(
      'UPDATE accounts SET balance = balance + ? WHERE user_id = ?',
      [amount, toUserId]
    );
    
    // If both succeed, commit
    await connection.commit();
    return { success: true };
    
  } catch (error) {
    // If any fails, rollback
    await connection.rollback();
    throw error;
  } finally {
    // Always release connection
    connection.release();
  }
}
```

---

## 2.7. Complete Real-World Example (Your Pattern)

```javascript
const mysql = require("mysql2/promise");
require("dotenv").config();

// Step 1: Create pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "myapp_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Step 2: Test connection (using getConnection)
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully");
    connection.release();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
}

// Step 3: Initialize tables (using pool.query)
async function initDatabase() {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS users(
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    console.log("✅ Database tables initialized");
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
  }
}

// Step 4: Use in routes (using pool.query)
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const [result] = await pool.query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Initialize
testConnection();
initDatabase();
```

---

## 2.8. Quick Reference: Methods You'll Use Daily

| Method | When to Use | Example |
|--------|-------------|---------|
| `createPool()` | Once at app startup | `mysql.createPool({...})` |
| `pool.getConnection()` | For transactions or testing | `await pool.getConnection()` |
| `pool.query()` | Most queries (your current usage) | `await pool.query('SELECT * FROM users')` |
| `pool.execute()` | Queries with user input (more secure) | `await pool.execute('SELECT * FROM users WHERE id = ?', [1])` |
| `connection.release()` | After using getConnection | `connection.release()` |
| `connection.beginTransaction()` | Start transaction | `await connection.beginTransaction()` |
| `connection.commit()` | Commit transaction | `await connection.commit()` |
| `connection.rollback()` | Rollback transaction | `await connection.rollback()` |

### Installation
```bash
npm install mysql2
```

---

## 3. Dotenv

**Package:** `dotenv`  
**Type:** External NPM Package  
**Purpose:** Load environment variables from `.env` file

### Description
Dotenv is a zero-dependency module that loads environment variables from a `.env` file into `process.env`. This is essential for keeping sensitive information (like API keys, database credentials, and configuration) out of your source code.

### Why `.config()` is Called
The `.config()` method is called to:
1. **Read the `.env` file** from the project root directory
2. **Parse the file** to extract key-value pairs (format: `KEY=value`)
3. **Add variables to `process.env`** so they're accessible throughout the application
4. **Execute immediately** when the application starts, before other code uses environment variables

### How It Works
1. Creates a `.env` file in your project root:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=secret123
   API_KEY=abc123xyz
   ```
2. Call `dotenv.config()` at the start of your application
3. Access variables via `process.env.PORT`, `process.env.DB_HOST`, etc.

### Benefits
- **Security:** Keeps secrets out of version control
- **Configuration Management:** Different environments (dev, staging, prod) can have different `.env` files
- **Easy Deployment:** Change configuration without modifying code
- **Best Practice:** Industry standard for managing environment variables

### Common Usage
```javascript
require('dotenv').config();
const port = process.env.PORT || 3000;
const dbHost = process.env.DB_HOST;
```

### Installation
```bash
npm install dotenv
```

### Important Notes
- Add `.env` to your `.gitignore` file to prevent committing secrets
- Never commit `.env` files to version control
- Use `.env.example` as a template (without actual values) for other developers

---

## 4. CORS

**Package:** `cors`  
**Type:** External NPM Package  
**Purpose:** Enable Cross-Origin Resource Sharing

### Description
CORS (Cross-Origin Resource Sharing) is a mechanism that allows web pages to make requests to a different domain than the one serving the web page. The `cors` package provides Express middleware to enable CORS with various options.

### Why It's Needed
Browsers enforce the Same-Origin Policy, which blocks requests from one origin (domain/port/protocol) to another. CORS headers tell the browser that it's safe to allow cross-origin requests.

### Common Scenarios
- Frontend on `http://localhost:3000` making requests to API on `http://localhost:5000`
- Frontend deployed on `https://myapp.com` calling API on `https://api.myapp.com`
- Development environment where frontend and backend run on different ports

### Common Usage
```javascript
// Enable CORS for all routes
app.use(cors());

// Configure CORS with options
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
```

### Installation
```bash
npm install cors
```

---

## 5. Multer

**Package:** `multer`  
**Type:** External NPM Package  
**Purpose:** Handle multipart/form-data for file uploads

### Description
Multer is a middleware for handling `multipart/form-data`, which is primarily used for uploading files. It adds a `body` object and a `file` or `files` object to the request object. Unlike `express.json()` and `express.urlencoded()`, multer is specifically designed to handle file uploads.

---

## 5.1. Understanding File Upload Request Structure

### What is `multipart/form-data`?

When you upload a file, the browser sends data in a special format called `multipart/form-data`. This is different from:
- **JSON** (`application/json`) - Used by `express.json()`
- **URL-encoded** (`application/x-www-form-urlencoded`) - Used by `express.urlencoded()`

### Request Headers Structure

**When a file is uploaded, the request headers look like this:**

```http
POST /upload HTTP/1.1
Host: localhost:3000
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Length: 12345
```

**Key Headers:**
- **`Content-Type: multipart/form-data`** - Tells server this is a file upload
- **`boundary`** - A unique string that separates different parts of the data
- **`Content-Length`** - Total size of the request body

### Request Body Structure

**The body contains multiple "parts" separated by the boundary:**

```
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="username"

john_doe
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="email"

john@example.com
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="photo.jpg"
Content-Type: image/jpeg

[binary file data here...]
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

**What this means:**
- Each field (text or file) is a separate "part"
- Each part has headers describing it
- Files contain binary data
- Boundary markers separate each part

### Why Multer is Needed

**Without Multer:**
```javascript
app.post('/upload', (req, res) => {
  console.log(req.body);  // ❌ undefined or empty
  console.log(req.file);  // ❌ undefined
  // Can't access uploaded file!
});
```

**With Multer:**
```javascript
const upload = multer({ dest: 'uploads/' });
app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.body);  // ✅ { username: 'john_doe', email: 'john@example.com' }
  console.log(req.file);  // ✅ File object with all file information
});
```

---

## 5.2. Understanding Callback Parameters: `(req, file, cb)`

### What are these parameters?

In multer configuration, you'll see callbacks like:
```javascript
filename: (req, file, cb) => {
  cb(null, 'custom-name.jpg');
}
```

### Parameter Breakdown

#### 1. `req` - Request Object
- **Type:** Express request object
- **Contains:** All request data (headers, body, params, query, etc.)
- **Use case:** Access other form fields, user info, request metadata

**Example:**
```javascript
filename: (req, file, cb) => {
  // Access other form fields
  const userId = req.body.userId;
  const category = req.body.category;
  
  // Create filename based on request data
  const filename = `${userId}-${category}-${Date.now()}.jpg`;
  cb(null, filename);
}
```

#### 2. `file` - File Object
- **Type:** Object containing file information
- **Properties:**
  - `fieldname` - Name of the form field (e.g., "file", "avatar")
  - `originalname` - Original filename from client
  - `encoding` - File encoding (usually "7bit")
  - `mimetype` - MIME type (e.g., "image/jpeg", "application/pdf")
  - `size` - File size in bytes
  - `buffer` - File data (if using memory storage)
  - `destination` - Directory where file is saved (disk storage)
  - `filename` - Saved filename (disk storage)
  - `path` - Full path to saved file (disk storage)

**Example:**
```javascript
filename: (req, file, cb) => {
  console.log('Field name:', file.fieldname);        // "file"
  console.log('Original name:', file.originalname); // "photo.jpg"
  console.log('MIME type:', file.mimetype);         // "image/jpeg"
  console.log('File size:', file.size);             // 123456 bytes
  
  // Create unique filename
  const ext = file.originalname.split('.').pop();
  const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`;
  cb(null, uniqueName);
}
```

#### 3. `cb` - Callback Function
- **Type:** Function
- **Purpose:** Tell multer what to do next
- **Signature:** `cb(error, value)`

**Usage:**
```javascript
// Success - pass null as first argument, value as second
cb(null, 'filename.jpg');  // ✅ Success - use this filename

// Error - pass error as first argument
cb(new Error('Invalid file type'));  // ❌ Error - reject file
```

**Complete Example:**
```javascript
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine destination based on file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, './uploads/images');
    } else if (file.mimetype === 'application/pdf') {
      cb(null, './uploads/documents');
    } else {
      cb(new Error('Unsupported file type'));
    }
  },
  filename: (req, file, cb) => {
    // Access request data
    const userId = req.body.userId || 'anonymous';
    
    // Access file data
    const ext = file.originalname.split('.').pop();
    const timestamp = Date.now();
    
    // Create custom filename
    const filename = `${userId}-${timestamp}.${ext}`;
    cb(null, filename);  // Success - use this filename
  }
});
```

---

## 5.3. Multer Methods

Multer provides different methods to handle various upload scenarios:

### 1. `upload.single(fieldname)` - Single File

**Use case:** Upload one file from a specific field

**Frontend:**
```html
<form enctype="multipart/form-data" method="POST" action="/upload">
  <input type="file" name="avatar">
  <button type="submit">Upload</button>
</form>
```

**Backend:**
```javascript
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('avatar'), (req, res) => {
  console.log(req.file);  // Single file object
  // {
  //   fieldname: 'avatar',
  //   originalname: 'photo.jpg',
  //   mimetype: 'image/jpeg',
  //   size: 123456,
  //   destination: 'uploads/',
  //   filename: 'abc123',
  //   path: 'uploads/abc123'
  // }
  res.json({ file: req.file });
});
```

### 2. `upload.array(fieldname, maxCount)` - Multiple Files from Same Field

**Use case:** Upload multiple files from the same field (e.g., multiple photos)

**Frontend:**
```html
<form enctype="multipart/form-data" method="POST" action="/upload">
  <input type="file" name="photos" multiple>
  <button type="submit">Upload</button>
</form>
```

**Backend:**
```javascript
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.array('photos', 5), (req, res) => {
  console.log(req.files);  // Array of file objects
  // [
  //   { fieldname: 'photos', originalname: 'photo1.jpg', ... },
  //   { fieldname: 'photos', originalname: 'photo2.jpg', ... },
  //   { fieldname: 'photos', originalname: 'photo3.jpg', ... }
  // ]
  res.json({ files: req.files, count: req.files.length });
});
```

**Parameters:**
- `fieldname` - Name of the form field
- `maxCount` (optional) - Maximum number of files (default: unlimited)

### 3. `upload.fields(fieldsArray)` - Multiple Files from Different Fields

**Use case:** Upload files from different fields (e.g., avatar + document)

**Frontend:**
```html
<form enctype="multipart/form-data" method="POST" action="/upload">
  <input type="file" name="avatar">
  <input type="file" name="document">
  <button type="submit">Upload</button>
</form>
```

**Backend:**
```javascript
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'document', maxCount: 1 }
]), (req, res) => {
  console.log(req.files);  // Object with field names as keys
  // {
  //   avatar: [{ fieldname: 'avatar', originalname: 'photo.jpg', ... }],
  //   document: [{ fieldname: 'document', originalname: 'doc.pdf', ... }]
  // }
  res.json({ files: req.files });
});
```

### 4. `upload.any()` - Any Field, Any Number

**Use case:** Accept files from any field (use with caution - less secure)

**Backend:**
```javascript
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.any(), (req, res) => {
  console.log(req.files);  // Array of all uploaded files
  res.json({ files: req.files });
});
```

### 5. `upload.none()` - No Files, Only Text Fields

**Use case:** Accept only text fields, reject any files

**Backend:**
```javascript
const upload = multer();

app.post('/form', upload.none(), (req, res) => {
  console.log(req.body);  // Text fields only
  // Files will be rejected
  res.json({ data: req.body });
});
```

---

## 5.4. Multer Configuration Options

### Basic Configuration

```javascript
const multer = require('multer');

const upload = multer({
  dest: 'uploads/'  // Simple: just specify destination directory
});
```

### Advanced Configuration with Storage

#### Disk Storage (`multer.diskStorage`)

**Saves files to disk with custom naming:**

```javascript
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine where to save the file
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    // Determine filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const upload = multer({ storage: storage });
```

**Complete Example:**
```javascript
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create different folders based on file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, './uploads/images');
    } else {
      cb(null, './uploads/documents');
    }
  },
  filename: (req, file, cb) => {
    // Preserve original extension
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const uniqueName = `${name}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });
```

#### Memory Storage (`multer.memoryStorage`)

**Keeps files in memory (as Buffer):**

```javascript
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  // File is in memory, not saved to disk
  console.log(req.file.buffer);  // Buffer containing file data
  console.log(req.file.size);      // File size in bytes
  
  // You can process the buffer (e.g., upload to cloud storage)
  // req.file.buffer contains the file data
});
```

**Use cases:**
- Upload to cloud storage (AWS S3, Cloudinary)
- Process files without saving to disk
- Temporary file handling

### File Filtering

**Filter files by type, size, etc.:**

```javascript
const fileFilter = (req, file, cb) => {
  // Allow only images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);  // Accept file
  } else {
    cb(new Error('Only image files are allowed!'), false);  // Reject file
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024  // 5MB max
  }
});
```

**Common File Type Checks:**
```javascript
const fileFilter = (req, file, cb) => {
  // Images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  }
  // PDFs only
  else if (file.mimetype === 'application/pdf') {
    cb(null, true);
  }
  // Specific extensions
  else if (['.jpg', '.jpeg', '.png'].includes(path.extname(file.originalname))) {
    cb(null, true);
  }
  // Reject everything else
  else {
    cb(new Error('Invalid file type'), false);
  }
};
```

### Limits Configuration

**Control file size and other limits:**

```javascript
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,      // 5MB max file size
    files: 5,                        // Max 5 files
    fields: 10,                      // Max 10 text fields
    fieldNameSize: 100,              // Max field name length
    fieldSize: 1024 * 1024,         // Max field value size (1MB)
    headerPairs: 2000                // Max header pairs
  }
});
```

### Complete Configuration Example

```javascript
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    cb(null, true);  // Accept
  } else {
    cb(new Error('Only image files are allowed!'), false);  // Reject
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024  // 5MB
  }
});

// Use in route
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  res.json({
    success: true,
    file: {
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: req.file.path
    }
  });
});
```

---

## 5.5. Request Object Structure After Multer

### After `upload.single()`

**`req.file` structure:**
```javascript
{
  fieldname: 'file',              // Form field name
  originalname: 'photo.jpg',      // Original filename
  encoding: '7bit',               // File encoding
  mimetype: 'image/jpeg',         // MIME type
  size: 123456,                   // File size in bytes
  destination: './uploads',       // Save directory (disk storage)
  filename: 'abc123',              // Saved filename (disk storage)
  path: './uploads/abc123',        // Full path (disk storage)
  buffer: Buffer                  // File data (memory storage only)
}
```

### After `upload.array()` or `upload.fields()`

**`req.files` structure:**
```javascript
// For upload.array()
[
  { fieldname: 'photos', originalname: 'photo1.jpg', ... },
  { fieldname: 'photos', originalname: 'photo2.jpg', ... }
]

// For upload.fields()
{
  avatar: [{ fieldname: 'avatar', originalname: 'photo.jpg', ... }],
  document: [{ fieldname: 'document', originalname: 'doc.pdf', ... }]
}
```

### `req.body` - Text Fields

**Text form fields are available in `req.body`:**
```javascript
// Form has: <input name="username" value="john">
// After multer:
console.log(req.body.username);  // "john"
```

---

## 5.6. How File Storage Works: Disk vs Database

### Understanding Your Code: Avatar Upload Flow

In your route (`/api/users`), you're saving only the **path** to the database, not the file itself. Here's how the complete flow works:

### Step-by-Step Flow

#### Step 1: Request Arrives with File

**Client sends:**
```javascript
const formData = new FormData();
formData.append('name', 'John Doe');
formData.append('email', 'john@example.com');
formData.append('avatar', fileInput.files[0]); // File object

fetch('/api/users', {
  method: 'POST',
  body: formData
});
```

**Request structure:**
```
POST /api/users HTTP/1.1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="name"

John Doe
------WebKitFormBoundary
Content-Disposition: form-data; name="email"

john@example.com
------WebKitFormBoundary
Content-Disposition: form-data; name="avatar"; filename="photo.jpg"
Content-Type: image/jpeg

[binary file data]
------WebKitFormBoundary--
```

#### Step 2: Multer Middleware Processes File (BEFORE Route Handler)

**Your multer configuration:**
```javascript
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);  // "./uploads" directory
  },  
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    // Result: "avatar-1704067200000-123456789.jpg"
  },
});

const upload = multer({ storage: storage });
```

**What happens:**
1. Multer intercepts the request **before** your route handler runs
2. Extracts the file from `multipart/form-data`
3. Saves file to disk: `./uploads/avatar-1704067200000-123456789.jpg`
4. Creates `req.file` object with file information
5. Then passes control to your route handler

**File is now on disk:**
```
project/
  └── uploads/
      └── avatar-1704067200000-123456789.jpg  ✅ File saved here
```

#### Step 3: Route Handler Receives File Info

**Your route handler:**
```javascript
app.post("/api/users", upload.single("avatar"), async (req, res) => {
  // At this point, file is ALREADY saved to disk
  // req.file contains information about the saved file
});
```

**`req.file` object structure:**
```javascript
{
  fieldname: 'avatar',                    // Form field name
  originalname: 'photo.jpg',              // Original filename
  encoding: '7bit',
  mimetype: 'image/jpeg',
  size: 123456,                          // File size in bytes
  destination: './uploads',               // Where file was saved
  filename: 'avatar-1704067200000-123456789.jpg',  // Generated filename
  path: './uploads/avatar-1704067200000-123456789.jpg',  // Full path
  buffer: undefined                       // Not used with diskStorage
}
```

#### Step 4: Construct Path for Database

**Your code:**
```javascript
const avatar = req.file ? `/uploads/${req.file.filename}` : null;
```

**What this does:**
- If file was uploaded: Creates path `/uploads/avatar-1704067200000-123456789.jpg`
- If no file: Sets to `null`

**Why `/uploads/` and not `./uploads/`?**
- `/uploads/` is a **URL path** (for accessing via HTTP)
- `./uploads/` is a **file system path** (for saving to disk)
- You need URL path because `express.static()` serves files at `/uploads` route

#### Step 5: Save Path to Database (NOT the File)

**Your database insert:**
```javascript
const [result] = await pool.query(
  "INSERT INTO users (name, email, avatar) VALUES (?, ?, ?)",
  [name, email, avatar]  // avatar = "/uploads/avatar-1704067200000-123456789.jpg"
);
```

**Database stores:**
```sql
| id | name      | email              | avatar                                    |
|----|-----------|--------------------|-------------------------------------------|
| 1  | John Doe  | john@example.com   | /uploads/avatar-1704067200000-123456789.jpg |
```

**Important:** Database stores **only the path**, not the actual file!

#### Step 6: File is Accessible via Static Middleware

**Your static file serving:**
```javascript
app.use("/uploads", express.static("uploads"));
```

**What this does:**
- Maps URL path `/uploads` to file system directory `./uploads`
- When client requests `/uploads/avatar-1704067200000-123456789.jpg`
- Express serves file from `./uploads/avatar-1704067200000-123456789.jpg`

### Complete Flow Diagram

```
1. Client Uploads File
   ↓
2. Request arrives at Express
   ↓
3. Multer Middleware (upload.single("avatar"))
   ├─ Extracts file from multipart/form-data
   ├─ Saves file to: ./uploads/avatar-1704067200000-123456789.jpg
   └─ Creates req.file object
   ↓
4. Route Handler Executes
   ├─ Reads req.file.filename
   ├─ Constructs path: /uploads/avatar-1704067200000-123456789.jpg
   └─ Saves path to database
   ↓
5. Response Sent
   └─ Returns: { avatar: "/uploads/avatar-1704067200000-123456789.jpg" }
   ↓
6. Client Accesses File
   └─ GET /uploads/avatar-1704067200000-123456789.jpg
   └─ express.static() serves file from disk
```

### Why Store Path, Not File?

**❌ Storing File in Database:**
```javascript
// BAD - Don't do this
const fileBuffer = fs.readFileSync(req.file.path);
await pool.query("INSERT INTO users (avatar) VALUES (?)", [fileBuffer]);
// Problems:
// - Database becomes huge
// - Slow queries
// - Hard to serve files
// - Wastes database resources
```

**✅ Storing Path in Database (Your Approach):**
```javascript
// GOOD - Your current approach
const avatar = `/uploads/${req.file.filename}`;
await pool.query("INSERT INTO users (avatar) VALUES (?)", [avatar]);
// Benefits:
// - Database stays small
// - Fast queries
// - Easy to serve via express.static()
// - Efficient resource usage
```

### File Storage Locations

**On Disk (Physical Storage):**
```
./uploads/avatar-1704067200000-123456789.jpg
```
- Actual file bytes stored here
- Managed by multer
- Accessible via file system

**In Database (Path Reference):**
```sql
avatar: "/uploads/avatar-1704067200000-123456789.jpg"
```
- Only the path string stored
- Used to construct URLs
- References the file on disk

**Via HTTP (URL Access):**
```
http://localhost:3000/uploads/avatar-1704067200000-123456789.jpg
```
- URL constructed from database path
- Served by `express.static()`
- Client can access directly

### Your Complete Code Breakdown

```javascript
// 1. Multer saves file to disk BEFORE route handler runs
app.post("/api/users", upload.single("avatar"), async (req, res) => {
  
  // 2. File is already saved, req.file contains info
  // req.file.path = "./uploads/avatar-1704067200000-123456789.jpg"
  // req.file.filename = "avatar-1704067200000-123456789.jpg"
  
  // 3. Construct URL path (not file system path)
  const avatar = req.file 
    ? `/uploads/${req.file.filename}`  // URL path for HTTP access
    : null;
  
  // 4. Save only the path to database
  const [result] = await pool.query(
    "INSERT INTO users (name, email, avatar) VALUES (?, ?, ?)",
    [name, email, avatar]  // avatar = "/uploads/avatar-1704067200000-123456789.jpg"
  );
  
  // 5. Return path in response
  res.json({
    avatar: "/uploads/avatar-1704067200000-123456789.jpg"
  });
  
  // 6. Client can access file at:
  // http://localhost:3000/uploads/avatar-1704067200000-123456789.jpg
  // This is served by: app.use("/uploads", express.static("uploads"))
});
```

### Accessing the Stored File

**From Frontend:**
```html
<!-- Use the path from database -->
<img src="http://localhost:3000/uploads/avatar-1704067200000-123456789.jpg" alt="Avatar">
```

**From Backend (if needed):**
```javascript
// Read file from disk using the path
const filePath = path.join(__dirname, 'uploads', req.file.filename);
const fileBuffer = fs.readFileSync(filePath);
```

### Key Takeaways

1. **Multer saves file to disk** - Happens automatically in middleware
2. **Database stores only path** - Not the actual file bytes
3. **Path is URL path** - `/uploads/filename.jpg` (not `./uploads/filename.jpg`)
4. **express.static() serves files** - Makes files accessible via HTTP
5. **File stays on disk** - Database just references it

### Common Questions

**Q: Where is the actual file stored?**  
A: On disk in `./uploads/` directory (managed by multer)

**Q: What's in the database?**  
A: Only the path string: `/uploads/avatar-1704067200000-123456789.jpg`

**Q: How does the client access the file?**  
A: Via URL: `http://localhost:3000/uploads/avatar-1704067200000-123456789.jpg` (served by express.static)

**Q: Why not store file in database?**  
A: Databases are for structured data. Files should be on disk/file storage. Storing files in database makes it slow and bloated.

---

## 5.7. File Upload Security: Critical Best Practices

### ⚠️ Security Risks in File Uploads

File uploads are one of the **most common attack vectors**. Without proper security, attackers can:
- Upload malicious files (viruses, scripts)
- Execute code on your server
- Access sensitive files (path traversal)
- Overwhelm your server (DoS attacks)
- Store illegal content

### Current Security Issues in Your Code

**Your current implementation has some security, but is missing critical protections:**

```javascript
// ❌ CURRENT CODE - Has some security but missing important checks
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"));
  }
};

filename: (req, file, cb) => {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  // ❌ Uses originalname extension - can be spoofed!
}
```

**Security Gaps:**
1. ❌ **Filename not sanitized** - Path traversal risk
2. ❌ **Extension from originalname** - Can be spoofed
3. ❌ **No content validation** - Only checks extension/mimetype
4. ❌ **No file content scanning** - Could be malicious
5. ❌ **No access control** - Anyone can upload

---

## 5.7.1. Security Best Practices

### 1. Filename Sanitization (CRITICAL)

**Problem:** Malicious filenames can contain path traversal sequences

**Attack Example:**
```javascript
// Attacker uploads file with name: "../../../etc/passwd"
// Without sanitization, file could be saved outside uploads directory!
```

**✅ Secure Solution:**
```javascript
const path = require('path');
const crypto = require('crypto');

filename: (req, file, cb) => {
  // Generate completely random filename (no user input)
  const randomName = crypto.randomBytes(16).toString('hex');
  
  // Get extension from original file (but validate it)
  const ext = path.extname(file.originalname).toLowerCase();
  
  // Only allow safe extensions
  const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.pdf'];
  const finalExt = allowedExts.includes(ext) ? ext : '.bin';
  
  // Use random name + validated extension
  cb(null, `${randomName}${finalExt}`);
}
```

**Better: Generate extension from mimetype:**
```javascript
filename: (req, file, cb) => {
  const randomName = crypto.randomBytes(16).toString('hex');
  
  // Map mimetype to extension (more secure)
  const mimeToExt = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'application/pdf': '.pdf'
  };
  
  const ext = mimeToExt[file.mimetype] || '.bin';
  cb(null, `${randomName}${ext}`);
}
```

### 2. File Content Validation (Magic Number Checking)

**Problem:** File extensions and mimetypes can be spoofed. A `.jpg` file could actually be a `.php` script!

**Attack Example:**
```javascript
// Attacker renames malicious.php to malicious.jpg
// Your code sees .jpg extension and allows it
// But file content is still PHP script!
```

**✅ Secure Solution - Check File Magic Numbers:**

```javascript
const fs = require('fs');

// Magic numbers (file signatures) for different file types
const fileSignatures = {
  'image/jpeg': [0xFF, 0xD8, 0xFF],
  'image/png': [0x89, 0x50, 0x4E, 0x47],
  'image/gif': [0x47, 0x49, 0x46, 0x38],
  'application/pdf': [0x25, 0x50, 0x44, 0x46], // %PDF
};

function validateFileContent(filePath, expectedMimeType) {
  const buffer = fs.readFileSync(filePath);
  const signature = fileSignatures[expectedMimeType];
  
  if (!signature) return false;
  
  // Check if file starts with correct magic number
  return signature.every((byte, index) => buffer[index] === byte);
}

// Use in fileFilter
const fileFilter = async (req, file, cb) => {
  // First check extension and mimetype
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (!extname || !mimetype) {
    return cb(new Error('Invalid file type'), false);
  }
  
  // After file is saved, validate content
  // Note: This requires saving to temp location first, then validating
  cb(null, true);
};
```

**Better: Use a library for magic number checking:**
```bash
npm install file-type
```

```javascript
const FileType = require('file-type');

const fileFilter = async (req, file, cb) => {
  // For memory storage, we can check buffer directly
  // For disk storage, need to check after save
  cb(null, true);
};

// After file is saved, validate
app.post('/upload', upload.single('avatar'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file' });
  }
  
  // Check actual file content
  const fileType = await FileType.fromFile(req.file.path);
  
  if (!fileType || !['image/jpeg', 'image/png', 'image/gif'].includes(fileType.mime)) {
    // Delete malicious file
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: 'Invalid file content' });
  }
  
  // File is safe, continue...
});
```

### 3. Enhanced File Type Validation

**✅ Improved fileFilter:**
```javascript
const fileFilter = (req, file, cb) => {
  // Whitelist approach (only allow specific types)
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf'
  ];
  
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf'];
  
  // Get file extension
  const ext = path.extname(file.originalname).toLowerCase();
  
  // Check both extension AND mimetype
  const isValidExtension = allowedExtensions.includes(ext);
  const isValidMimeType = allowedMimeTypes.includes(file.mimetype);
  
  // Both must match
  if (isValidExtension && isValidMimeType) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${allowedExtensions.join(', ')}`), false);
  }
};
```

### 4. File Size Limits (You Have This - Good!)

**✅ Your current implementation:**
```javascript
limits: { fileSize: 5 * 1024 * 1024 }  // 5MB limit
```

**Additional limits to consider:**
```javascript
limits: {
  fileSize: 5 * 1024 * 1024,      // 5MB per file
  files: 5,                        // Max 5 files per request
  fields: 10,                      // Max 10 text fields
  fieldNameSize: 100,              // Max field name length
  fieldSize: 1024 * 1024,          // Max field value size
}
```

### 5. Storage Location Security

**✅ Secure storage configuration:**
```javascript
const path = require('path');

// Use absolute path (prevents path traversal)
const uploadDir = path.join(__dirname, 'uploads');

// Ensure directory exists and is writable
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  // Set permissions (Unix/Linux)
  fs.chmodSync(uploadDir, 0o755);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Always use absolute path
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate safe filename (no user input)
    const randomName = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${randomName}${ext}`);
  }
});
```

### 6. Access Control

**✅ Add authentication/authorization:**
```javascript
// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Apply to upload route
app.post('/api/users', requireAuth, uploadLimiter, upload.single('avatar'), async (req, res) => {
  // Only authenticated users can upload
});
```

### 7. Rate Limiting (You Have This - Good!)

**✅ Your current implementation:**
```javascript
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 10,                     // 10 uploads per hour
});
```

### 8. Virus Scanning (For Production)

**For production, consider virus scanning:**
```bash
npm install clamscan  # ClamAV integration
```

```javascript
const NodeClam = require('clamscan');

const clamscan = await new NodeClam().init();

app.post('/upload', upload.single('avatar'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file' });
  }
  
  // Scan for viruses
  const { isInfected, viruses } = await clamscan.isInfected(req.file.path);
  
  if (isInfected) {
    fs.unlinkSync(req.file.path);  // Delete infected file
    return res.status(400).json({ error: 'File contains virus', viruses });
  }
  
  // File is clean, continue...
});
```

---

## 5.7.2. Secure Implementation Example

**✅ Complete Secure File Upload Configuration:**

```javascript
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const FileType = require('file-type');

// Secure storage configuration
const uploadDir = path.join(__dirname, 'uploads');

// Ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Whitelist of allowed file types
const allowedMimeTypes = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'application/pdf': '.pdf'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);  // Use absolute path
  },
  filename: (req, file, cb) => {
    // Generate random filename (no user input)
    const randomName = crypto.randomBytes(16).toString('hex');
    
    // Get extension from mimetype (more secure than originalname)
    const ext = allowedMimeTypes[file.mimetype] || '.bin';
    
    cb(null, `${randomName}${ext}`);
  }
});

// Enhanced file filter
const fileFilter = (req, file, cb) => {
  // Check if mimetype is in whitelist
  if (allowedMimeTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed: JPEG, PNG, GIF, PDF'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,  // 5MB
    files: 1,                    // Max 1 file
  }
});

// Secure upload route
app.post('/api/users', 
  requireAuth,        // Authentication required
  uploadLimiter,      // Rate limiting
  upload.single('avatar'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      // Validate file content (magic number check)
      const fileType = await FileType.fromFile(req.file.path);
      
      if (!fileType || !allowedMimeTypes[fileType.mime]) {
        // Delete suspicious file
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ 
          error: 'File content does not match file type' 
        });
      }
      
      // File is safe, save to database
      const avatar = `/uploads/${req.file.filename}`;
      // ... rest of your code
      
    } catch (error) {
      // Clean up file on error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: error.message });
    }
  }
);
```

---

## 5.7.3. Security Checklist

**Before deploying file uploads, ensure:**

- ✅ **Filename sanitization** - No user input in filename
- ✅ **File type validation** - Whitelist approach
- ✅ **Content validation** - Magic number checking
- ✅ **File size limits** - Prevent DoS attacks
- ✅ **Rate limiting** - Prevent abuse
- ✅ **Access control** - Authentication required
- ✅ **Storage security** - Absolute paths, proper permissions
- ✅ **Error handling** - Clean up files on error
- ✅ **Virus scanning** - For production (optional but recommended)
- ✅ **HTTPS only** - Encrypt file transfers
- ✅ **Input validation** - Validate all form fields
- ✅ **Logging** - Log all upload attempts for security auditing

---

## 5.7.4. Common Attack Vectors and Prevention

### Attack 1: Path Traversal

**Attack:**
```javascript
// Attacker uploads: "../../../etc/passwd"
// Without sanitization, file saved outside uploads/
```

**Prevention:**
```javascript
// Use absolute paths and random filenames
const uploadDir = path.join(__dirname, 'uploads');
const filename = crypto.randomBytes(16).toString('hex') + ext;
```

### Attack 2: File Type Spoofing

**Attack:**
```javascript
// Rename malicious.php to malicious.jpg
// Extension check passes, but file is still PHP
```

**Prevention:**
```javascript
// Check file content (magic numbers)
const fileType = await FileType.fromFile(req.file.path);
```

### Attack 3: Oversized Files (DoS)

**Attack:**
```javascript
// Upload 10GB file to crash server
```

**Prevention:**
```javascript
limits: { fileSize: 5 * 1024 * 1024 }  // 5MB max
```

### Attack 4: Malicious Scripts

**Attack:**
```javascript
// Upload PHP/JS script, then execute it
```

**Prevention:**
```javascript
// Whitelist only safe file types
// Never execute uploaded files
// Store outside web root if possible
```

---

## 5.7.5. Quick Security Fixes for Your Current Code

**Immediate improvements you can make:**

```javascript
// 1. Sanitize filename (use random name)
filename: (req, file, cb) => {
  const randomName = crypto.randomBytes(16).toString('hex');
  const ext = path.extname(file.originalname).toLowerCase();
  cb(null, `${randomName}${ext}`);
}

// 2. Use absolute path
const uploadDir = path.join(__dirname, 'uploads');

// 3. Add content validation after upload
// Install: npm install file-type
const FileType = require('file-type');

app.post('/api/users', upload.single('avatar'), async (req, res) => {
  if (req.file) {
    const fileType = await FileType.fromFile(req.file.path);
    if (!fileType || fileType.mime !== 'image/jpeg') {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Invalid file' });
    }
  }
  // ... rest of code
});
```

---

## 5.8. Complete Real-World Example

**Frontend (HTML + JavaScript):**
```html
<!DOCTYPE html>
<html>
<body>
  <form id="uploadForm" enctype="multipart/form-data">
    <input type="text" name="username" placeholder="Username" required>
    <input type="file" name="avatar" accept="image/*" required>
    <button type="submit">Upload</button>
  </form>
  
  <div id="result"></div>
  
  <script>
    document.getElementById('uploadForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      document.getElementById('result').innerHTML = JSON.stringify(result, null, 2);
    });
  </script>
</body>
</html>
```

**Backend:**
```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const uploadDir = './uploads';

// Create uploads directory
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }  // 5MB
});

// Upload route
app.post('/upload', upload.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Access text fields
  const username = req.body.username;
  
  // Access file info
  const fileInfo = {
    originalname: req.file.originalname,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
    path: req.file.path,
    url: `/uploads/${req.file.filename}`
  };
  
  res.json({
    success: true,
    message: 'File uploaded successfully',
    username: username,
    file: fileInfo
  });
});

// Serve uploaded files
app.use('/uploads', express.static(uploadDir));

app.listen(3000);
```

### Installation
```bash
npm install multer
```

---

## 6. Path (Node.js Built-in)

**Package:** `path`  
**Type:** Node.js Built-in Module  
**Purpose:** Utilities for working with file and directory paths

### Description
The `path` module provides utilities for working with file and directory paths. It's particularly useful for handling path differences between operating systems (Windows uses backslashes, Unix uses forward slashes).

### Key Methods
- `path.join()` - Join path segments together
- `path.resolve()` - Resolve absolute path
- `path.dirname()` - Get directory name from path
- `path.basename()` - Get filename from path
- `path.extname()` - Get file extension

### Common Usage
```javascript
const filePath = path.join(__dirname, 'uploads', 'file.txt');
const absolutePath = path.resolve('./uploads');
```

### No Installation Required
This is a built-in Node.js module, no installation needed.

---

## 7. FS (Node.js Built-in)

**Package:** `fs`  
**Type:** Node.js Built-in Module  
**Purpose:** File system operations  

### Description
The `fs` module provides an API for interacting with the file system. It allows you to read, write, create, delete files and directories. The module offers both **synchronous** (blocking) and **asynchronous** (non-blocking) versions of most methods.

### Key Methods - CRUD Operations

#### 📁 **DIRECTORY Operations (CRUD)**

##### **CREATE Directory**
```javascript
// Synchronous (blocking)
fs.mkdirSync('./uploads', { recursive: true });

// Asynchronous (non-blocking)
fs.mkdir('./uploads', { recursive: true }, (err) => {
  if (err) console.error(err);
  else console.log('Directory created');
});

// Promise-based (async/await)
const fsPromises = require('fs').promises;
await fsPromises.mkdir('./uploads', { recursive: true });
```
- `recursive: true` - Creates parent directories if they don't exist
- Without `recursive`, parent directories must exist

##### **READ Directory**
```javascript
// Synchronous - Returns array of filenames
const files = fs.readdirSync('./uploads');
console.log(files); // ['file1.txt', 'file2.jpg', 'subfolder']

// Asynchronous
fs.readdir('./uploads', (err, files) => {
  if (err) console.error(err);
  else console.log(files);
});

// Promise-based with file details
const files = await fsPromises.readdir('./uploads', { withFileTypes: true });
files.forEach(file => {
  console.log(file.name, file.isDirectory() ? 'DIR' : 'FILE');
});
```

##### **UPDATE Directory** (Rename/Move)
```javascript
// Synchronous
fs.renameSync('./old-folder', './new-folder');

// Asynchronous
fs.rename('./old-folder', './new-folder', (err) => {
  if (err) console.error(err);
});

// Promise-based
await fsPromises.rename('./old-folder', './new-folder');
```

##### **DELETE Directory**
```javascript
// Synchronous - Only deletes empty directory
fs.rmdirSync('./uploads');

// Asynchronous - Only deletes empty directory
fs.rmdir('./uploads', (err) => {
  if (err) console.error(err);
});

// Delete directory with all contents (recursive)
fs.rmSync('./uploads', { recursive: true, force: true });
// or
await fsPromises.rm('./uploads', { recursive: true, force: true });
```

---

#### 📄 **FILE Operations (CRUD)**

##### **CREATE File** (Write)
```javascript
// Synchronous - Creates file or overwrites if exists
fs.writeFileSync('./data.txt', 'Hello World', 'utf8');

// Asynchronous
fs.writeFile('./data.txt', 'Hello World', 'utf8', (err) => {
  if (err) console.error(err);
  else console.log('File created');
});

// Promise-based
await fsPromises.writeFile('./data.txt', 'Hello World', 'utf8');

// Append to file (add content without overwriting)
fs.appendFileSync('./data.txt', '\nNew line');
await fsPromises.appendFile('./data.txt', '\nNew line');
```

##### **READ File**
```javascript
// Synchronous - Returns file content
const data = fs.readFileSync('./data.txt', 'utf8');
console.log(data); // "Hello World"

// Asynchronous
fs.readFile('./data.txt', 'utf8', (err, data) => {
  if (err) console.error(err);
  else console.log(data);
});

// Promise-based
const data = await fsPromises.readFile('./data.txt', 'utf8');

// Read file as Buffer (binary data)
const buffer = fs.readFileSync('./image.jpg');
```

##### **UPDATE File** (Modify/Append)
```javascript
// Overwrite entire file
fs.writeFileSync('./data.txt', 'New content', 'utf8');

// Append to existing file
fs.appendFileSync('./data.txt', '\nAppended text', 'utf8');

// Read, modify, write pattern
let content = fs.readFileSync('./data.txt', 'utf8');
content = content.replace('old', 'new');
fs.writeFileSync('./data.txt', content, 'utf8');
```

##### **DELETE File**
```javascript
// Synchronous
fs.unlinkSync('./data.txt');

// Asynchronous
fs.unlink('./data.txt', (err) => {
  if (err) console.error(err);
  else console.log('File deleted');
});

// Promise-based
await fsPromises.unlink('./data.txt');
```

---

### 🔍 **UTILITY Methods**

##### **Check if File/Directory EXISTS**
```javascript
// Synchronous - Returns true/false
if (fs.existsSync('./uploads')) {
  console.log('Directory exists');
}

// Check if path is a file
if (fs.statSync('./data.txt').isFile()) {
  console.log('It is a file');
}

// Check if path is a directory
if (fs.statSync('./uploads').isDirectory()) {
  console.log('It is a directory');
}
```

##### **Get File/Directory STATS** (Size, dates, permissions)
```javascript
// Synchronous
const stats = fs.statSync('./data.txt');
console.log('Size:', stats.size);           // File size in bytes
console.log('Created:', stats.birthtime);   // Creation date
console.log('Modified:', stats.mtime);      // Last modified date
console.log('Is File:', stats.isFile());    // true/false
console.log('Is Directory:', stats.isDirectory()); // true/false

// Asynchronous
fs.stat('./data.txt', (err, stats) => {
  if (err) console.error(err);
  else console.log(stats);
});

// Promise-based
const stats = await fsPromises.stat('./data.txt');
```

##### **COPY File/Directory**
```javascript
// Copy file
fs.copyFileSync('./source.txt', './destination.txt');
await fsPromises.copyFile('./source.txt', './destination.txt');

// Copy directory (requires recursive function or external package)
```

---

### 📊 **Quick Reference Table**

| Operation | File | Directory |
|-----------|------|-----------|
| **CREATE** | `writeFileSync()` / `writeFile()` | `mkdirSync()` / `mkdir()` |
| **READ** | `readFileSync()` / `readFile()` | `readdirSync()` / `readdir()` |
| **UPDATE** | `writeFileSync()` / `appendFileSync()` | `renameSync()` / `rename()` |
| **DELETE** | `unlinkSync()` / `unlink()` | `rmdirSync()` / `rm()` or `rmSync()` |

### 🎯 **Method Naming Pattern**

**Synchronous methods** end with `Sync`:
- `readFileSync()`, `writeFileSync()`, `mkdirSync()`

**Asynchronous methods** use callbacks:
- `readFile()`, `writeFile()`, `mkdir()`

**Promise-based** (use `fs.promises`):
- `fsPromises.readFile()`, `fsPromises.writeFile()`, `fsPromises.mkdir()`

### 💡 **Common Usage Examples**

```javascript
const fs = require('fs');
const path = require('path');

// 1. Create directory if it doesn't exist
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Read file
const data = fs.readFileSync('file.txt', 'utf8');
console.log(data);

// 3. Write file
fs.writeFileSync('output.txt', 'Hello World', 'utf8');

// 4. Append to file
fs.appendFileSync('log.txt', '\nNew log entry', 'utf8');

// 5. Read directory contents
const files = fs.readdirSync('./uploads');
files.forEach(file => {
  console.log(file);
});

// 6. Check file stats
if (fs.existsSync('data.txt')) {
  const stats = fs.statSync('data.txt');
  console.log(`File size: ${stats.size} bytes`);
  console.log(`Modified: ${stats.mtime}`);
}

// 7. Delete file
if (fs.existsSync('temp.txt')) {
  fs.unlinkSync('temp.txt');
}

// 8. Delete directory (must be empty)
if (fs.existsSync('./temp-folder')) {
  fs.rmdirSync('./temp-folder');
}

// 9. Delete directory with contents
fs.rmSync('./temp-folder', { recursive: true, force: true });
```

### ⚠️ **Important Notes**

- **Synchronous methods block** the event loop - use carefully
- **Asynchronous methods** are preferred for better performance
- **Always handle errors** when using async methods
- **Use `recursive: true`** when creating nested directories
- **File paths** can be relative (`./file.txt`) or absolute (`/path/to/file.txt`)
- **Encoding:** Always specify encoding (`'utf8'`) for text files, omit for binary
- **Delete operations:** Directories must be empty unless using `recursive: true`

### No Installation Required
This is a built-in Node.js module, no installation needed.

---

## 8. Express Rate Limit

**Package:** `express-rate-limit`  
**Type:** External NPM Package  
**Purpose:** Rate limiting middleware for Express

### Description
Express Rate Limit is a middleware that limits repeated requests to public APIs and/or endpoints. It helps prevent abuse, brute-force attacks, and DoS (Denial of Service) attacks by limiting the number of requests a client can make within a specified time window.

### Key Features
- **IP-based Limiting:** Limit requests per IP address
- **Time Windows:** Define time periods (e.g., 15 minutes, 1 hour)
- **Custom Messages:** Customize error messages
- **Skip Options:** Skip rate limiting for certain conditions
- **Store Options:** Use different storage backends (memory, Redis, etc.)
- **Rate Limit Headers:** Automatically adds headers showing rate limit status

### Common Usage
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

### Configuration Options Explained

#### Basic Options

**`windowMs`** - Time window in milliseconds
```javascript
windowMs: 15 * 60 * 1000  // 15 minutes
windowMs: 60 * 60 * 1000  // 1 hour
windowMs: 24 * 60 * 60 * 1000  // 24 hours
```

**`max`** - Maximum number of requests allowed in the time window
```javascript
max: 100  // Allow 100 requests per window
max: 10   // Allow 10 requests per window
```

**`message`** - Error message sent when limit is exceeded
```javascript
message: "Too many requests, please try again later."
// or
message: {
  success: false,
  error: "Rate limit exceeded"
}
```

#### Header Options: `standardHeaders` and `legacyHeaders`

These options control which HTTP headers are added to responses to inform clients about rate limit status.

##### `standardHeaders: true` (Recommended)

**What it does:**
- Adds **RFC 7231 compliant** standard rate limit headers
- Uses modern header names that follow HTTP standards
- Headers added:
  - `RateLimit-Limit`: Maximum number of requests allowed
  - `RateLimit-Remaining`: Number of requests remaining in current window
  - `RateLimit-Reset`: Unix timestamp when the rate limit resets

**Example Response Headers:**
```
HTTP/1.1 200 OK
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1704067200
```

**When limit is exceeded:**
```
HTTP/1.1 429 Too Many Requests
RateLimit-Limit: 100
RateLimit-Remaining: 0
RateLimit-Reset: 1704067200
Retry-After: 900
```

**Why use it:**
- ✅ **Standard compliant** - Follows RFC 7231
- ✅ **Modern approach** - Industry best practice
- ✅ **Client-friendly** - Clients can programmatically check limits
- ✅ **Future-proof** - Works with modern tools and libraries

##### `legacyHeaders: false` (Recommended)

**What it does:**
- **Disables** old/deprecated header names
- Prevents adding headers like `X-RateLimit-*` (old format)
- Keeps responses clean and standard-compliant

**Legacy headers (when `legacyHeaders: true`):**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704067200
```

**Why disable it:**
- ❌ **Deprecated format** - Old naming convention
- ❌ **Not standard** - Doesn't follow RFC standards
- ❌ **Redundant** - Standard headers already provide this info
- ✅ **Cleaner responses** - Less header clutter

##### Your Current Configuration

```javascript
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                    // 100 requests max
  message: {
    success: false,
    error: "Too many requests, please try again later.",
  },
  standardHeaders: true,   // ✅ Add modern standard headers
  legacyHeaders: false,    // ✅ Don't add old deprecated headers
});
```

**What this means:**
- ✅ Clients will receive `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset` headers
- ✅ No deprecated `X-RateLimit-*` headers will be added
- ✅ Modern, clean, standard-compliant implementation

### Complete Example with Headers

**Backend:**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,
  message: {
    success: false,
    error: "Too many requests, please try again later.",
  },
  standardHeaders: true,   // Enable standard rate limit headers
  legacyHeaders: false,    // Disable legacy headers
});

app.use('/api/', limiter);

app.get('/api/data', (req, res) => {
  res.json({ data: 'Some data' });
});
```

**Client Request (First Request):**
```javascript
fetch('http://localhost:3000/api/data')
  .then(response => {
    console.log(response.headers.get('RateLimit-Limit'));      // "100"
    console.log(response.headers.get('RateLimit-Remaining'));  // "99"
    console.log(response.headers.get('RateLimit-Reset'));       // "1704067200"
  });
```

**Client Request (After 100 requests - Rate Limited):**
```javascript
fetch('http://localhost:3000/api/data')
  .then(response => {
    console.log(response.status);  // 429 (Too Many Requests)
    console.log(response.headers.get('RateLimit-Remaining'));  // "0"
    console.log(response.headers.get('Retry-After'));          // "900" (seconds)
  });
```

### Header Comparison Table

| Header Type | Header Name | `standardHeaders: true` | `legacyHeaders: true` |
|------------|-------------|------------------------|----------------------|
| **Limit** | `RateLimit-Limit` | ✅ Added | ❌ Not added |
| **Limit (Legacy)** | `X-RateLimit-Limit` | ❌ Not added | ✅ Added |
| **Remaining** | `RateLimit-Remaining` | ✅ Added | ❌ Not added |
| **Remaining (Legacy)** | `X-RateLimit-Remaining` | ❌ Not added | ✅ Added |
| **Reset** | `RateLimit-Reset` | ✅ Added | ❌ Not added |
| **Reset (Legacy)** | `X-RateLimit-Reset` | ❌ Not added | ✅ Added |

### Recommended Configuration

```javascript
// ✅ RECOMMENDED - Modern and standard-compliant
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,   // Use modern standard headers
  legacyHeaders: false,    // Don't use old headers
});

// ❌ NOT RECOMMENDED - Using deprecated headers
const oldLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: false,  // Missing modern headers
  legacyHeaders: true,      // Using old format
});
```

### Other Useful Options

```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  
  // Skip rate limiting for certain conditions
  skip: (req) => {
    // Skip for admin users
    return req.user && req.user.isAdmin;
  },
  
  // Custom key generator (rate limit by user ID instead of IP)
  keyGenerator: (req) => {
    return req.user ? req.user.id : req.ip;
  },
  
  // Custom handler when limit is exceeded
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many requests',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});
```

### Installation
```bash
npm install express-rate-limit
```

---

## 9. Express.json() and Body Parser Relationship

### What is `express.json()`?

**Purpose:** Parse incoming JSON request bodies and make them available in `req.body`

`express.json()` is a built-in Express middleware (available since Express 4.16.0) that:
1. **Parses JSON data** from incoming HTTP request bodies
2. **Converts JSON strings** to JavaScript objects
3. **Makes parsed data available** in `req.body` for your route handlers

### Why is it needed?

When a client sends JSON data in the request body (like from a POST or PUT request), Express doesn't automatically parse it. Without `express.json()`, `req.body` would be `undefined` or contain raw string data.

**Example without `express.json()`:**
```javascript
// Client sends: { "name": "John", "age": 30 }
app.post('/user', (req, res) => {
  console.log(req.body); // undefined or raw string
});
```

**Example with `express.json()`:**
```javascript
app.use(express.json()); // Enable JSON parsing

app.post('/user', (req, res) => {
  console.log(req.body); // { name: "John", age: 30 } ✅
  console.log(req.body.name); // "John" ✅
});
```

### The Relationship with Body-Parser

**Historical Context:**
- **Before Express 4.16.0:** You had to install `body-parser` as a separate package
- **After Express 4.16.0:** Express integrated body-parser's functionality directly

**The Connection:**
- `express.json()` is **literally the same code** as `bodyParser.json()` from the body-parser package
- Express team **adopted body-parser** and made it built-in to reduce dependencies
- The body-parser package still exists, but it's now **redundant** for Express 4.16.0+

**Old Way (Before Express 4.16.0):**
```javascript
const bodyParser = require('body-parser');
app.use(bodyParser.json());        // Parse JSON
app.use(bodyParser.urlencoded({ extended: true })); // Parse form data
```

**New Way (Express 4.16.0+):**
```javascript
// No need to install body-parser!
app.use(express.json());                    // Parse JSON (same as bodyParser.json())
app.use(express.urlencoded({ extended: true })); // Parse form data (same as bodyParser.urlencoded())
```

### How `express.json()` Works

1. **Intercepts requests** with `Content-Type: application/json` header
2. **Reads the raw body** from the HTTP request stream
3. **Parses the JSON string** using `JSON.parse()`
4. **Attaches the parsed object** to `req.body`
5. **Passes control** to the next middleware or route handler

### Configuration Options

`express.json()` accepts options:
```javascript
app.use(express.json({
  limit: '10mb',        // Maximum request body size
  strict: true,         // Only parse arrays and objects
  type: 'application/json' // Content-Type to match
}));
```

### Common Use Cases

- **REST APIs:** Receiving JSON data from frontend applications
- **Mobile Apps:** Handling JSON payloads from mobile clients
- **Microservices:** Communication between services using JSON
- **AJAX/Fetch Requests:** Processing JSON from browser requests

### Important Notes

- **Must be placed before routes** that need to access `req.body`
- **Only parses JSON** - use `express.urlencoded()` for form data
- **Security:** Consider setting a `limit` option to prevent large payload attacks
- **Performance:** Parsing happens synchronously, so very large JSON bodies can block the event loop

---

## 10. Express.urlencoded() - Understanding URL-Encoded Form Data

### What is `express.urlencoded()`?

**Purpose:** Parse incoming URL-encoded form data and make it available in `req.body`

`express.urlencoded()` is a built-in Express middleware that:
1. **Parses URL-encoded data** from HTML forms (Content-Type: `application/x-www-form-urlencoded`)
2. **Converts URL-encoded strings** to JavaScript objects
3. **Makes parsed data available** in `req.body` for your route handlers

### What is "URL-Encoded" Format?

URL-encoded format is how HTML forms send data by default. It looks like this:
```
name=John+Doe&age=30&email=john%40example.com
```

**Key characteristics:**
- Fields are separated by `&`
- Spaces are encoded as `+` or `%20`
- Special characters are URL-encoded (e.g., `@` becomes `%40`)
- Format: `key=value&key2=value2`

### What Does `{ extended: true }` Mean?

The `extended` option determines which parsing library to use:

#### `extended: false` (Legacy Mode)
- Uses Node's built-in `querystring` library
- **Limited:** Only supports simple key-value pairs
- **No nested objects or arrays**
- **Example:** `name=John&age=30` → `{ name: "John", age: "30" }`

#### `extended: true` (Recommended - Modern Mode)
- Uses `qs` library (more powerful)
- **Supports nested objects:** `user[name]=John&user[age]=30`
- **Supports arrays:** `hobbies[]=reading&hobbies[]=coding`
- **More flexible and feature-rich**
- **Example:** `user[name]=John&user[age]=30` → `{ user: { name: "John", age: "30" } }`

### Real-World Scenarios

#### Scenario 1: HTML Form Submission

**Frontend (HTML Form):**
```html
<form action="/submit" method="POST">
  <input type="text" name="username" value="john_doe">
  <input type="email" name="email" value="john@example.com">
  <input type="number" name="age" value="25">
  <button type="submit">Submit</button>
</form>
```

**What the browser sends:**
```
POST /submit HTTP/1.1
Content-Type: application/x-www-form-urlencoded

username=john_doe&email=john%40example.com&age=25
```

**Backend (Express):**
```javascript
app.use(express.urlencoded({ extended: true }));

app.post('/submit', (req, res) => {
  console.log(req.body);
  // Output: { username: 'john_doe', email: 'john@example.com', age: '25' }
  
  res.json({ message: 'Form submitted successfully', data: req.body });
});
```

#### Scenario 2: Nested Form Data (extended: true)

**Frontend (HTML Form with Nested Fields):**
```html
<form action="/user" method="POST">
  <input type="text" name="user[name]" value="John Doe">
  <input type="text" name="user[email]" value="john@example.com">
  <input type="text" name="address[street]" value="123 Main St">
  <input type="text" name="address[city]" value="New York">
  <button type="submit">Submit</button>
</form>
```

**What the browser sends:**
```
user[name]=John+Doe&user[email]=john%40example.com&address[street]=123+Main+St&address[city]=New+York
```

**Backend with `extended: true`:**
```javascript
app.use(express.urlencoded({ extended: true }));

app.post('/user', (req, res) => {
  console.log(req.body);
  // Output: {
  //   user: { name: 'John Doe', email: 'john@example.com' },
  //   address: { street: '123 Main St', city: 'New York' }
  // }
  
  const userName = req.body.user.name; // "John Doe" ✅
  const city = req.body.address.city;  // "New York" ✅
});
```

**Backend with `extended: false`:**
```javascript
app.use(express.urlencoded({ extended: false }));

app.post('/user', (req, res) => {
  console.log(req.body);
  // Output: {
  //   'user[name]': 'John Doe',
  //   'user[email]': 'john@example.com',
  //   'address[street]': '123 Main St',
  //   'address[city]': 'New York'
  // }
  // ❌ Nested structure is lost! Keys are strings with brackets
});
```

#### Scenario 3: Arrays in Form Data (extended: true)

**Frontend (HTML Form with Checkboxes/Arrays):**
```html
<form action="/preferences" method="POST">
  <input type="checkbox" name="hobbies[]" value="reading" checked>
  <input type="checkbox" name="hobbies[]" value="coding" checked>
  <input type="checkbox" name="hobbies[]" value="gaming">
  <button type="submit">Submit</button>
</form>
```

**What the browser sends:**
```
hobbies[]=reading&hobbies[]=coding
```

**Backend with `extended: true`:**
```javascript
app.use(express.urlencoded({ extended: true }));

app.post('/preferences', (req, res) => {
  console.log(req.body);
  // Output: { hobbies: ['reading', 'coding'] } ✅
  
  req.body.hobbies.forEach(hobby => {
    console.log(hobby); // "reading", "coding"
  });
});
```

**Backend with `extended: false`:**
```javascript
app.use(express.urlencoded({ extended: false }));

app.post('/preferences', (req, res) => {
  console.log(req.body);
  // Output: { 'hobbies[]': 'coding' } ❌ Only last value!
  // Arrays are not properly handled
});
```

#### Scenario 4: AJAX/Fetch Request with FormData

**Frontend (JavaScript):**
```javascript
// Create form data
const formData = new FormData();
formData.append('username', 'john_doe');
formData.append('email', 'john@example.com');

// Send as URL-encoded (default for FormData)
fetch('/api/user', {
  method: 'POST',
  body: formData  // Browser sets Content-Type: application/x-www-form-urlencoded
});
```

**Backend:**
```javascript
app.use(express.urlencoded({ extended: true }));

app.post('/api/user', (req, res) => {
  console.log(req.body);
  // Output: { username: 'john_doe', email: 'john@example.com' }
});
```

#### Scenario 5: jQuery/Axios Form Submission

**Frontend (jQuery):**
```javascript
$.ajax({
  url: '/api/submit',
  method: 'POST',
  data: {
    name: 'John',
    age: 30,
    city: 'New York'
  },
  // jQuery automatically converts to URL-encoded format
});
```

**Backend:**
```javascript
app.use(express.urlencoded({ extended: true }));

app.post('/api/submit', (req, res) => {
  console.log(req.body);
  // Output: { name: 'John', age: '30', city: 'New York' }
  // Note: age is a string '30', not number 30
});
```

### Comparison: extended: true vs extended: false

| Feature | `extended: false` | `extended: true` |
|---------|-------------------|------------------|
| **Nested Objects** | ❌ Not supported | ✅ Supported |
| **Arrays** | ❌ Not supported | ✅ Supported |
| **Complex Data** | ❌ Limited | ✅ Full support |
| **Performance** | ⚡ Faster | 🐢 Slightly slower |
| **Security** | ✅ More secure | ⚠️ Can parse complex nested data |
| **Recommendation** | Legacy only | ✅ **Use this** |

### When to Use `express.urlencoded()`

✅ **Use it when:**
- Receiving data from HTML forms
- Handling traditional form submissions
- Processing data from `<form>` elements
- Working with `FormData` objects
- Receiving `application/x-www-form-urlencoded` content type

❌ **Don't use it for:**
- JSON data (use `express.json()` instead)
- File uploads (use `multer` instead)
- Raw text or binary data

### Complete Example: Contact Form

**Frontend:**
```html
<!DOCTYPE html>
<html>
<body>
  <form action="/contact" method="POST">
    <input type="text" name="name" placeholder="Your Name" required>
    <input type="email" name="email" placeholder="Your Email" required>
    <textarea name="message" placeholder="Your Message" required></textarea>
    <button type="submit">Send Message</button>
  </form>
</body>
</html>
```

**Backend:**
```javascript
app.use(express.urlencoded({ extended: true }));

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  
  console.log('Contact form submission:');
  console.log('Name:', name);
  console.log('Email:', email);
  console.log('Message:', message);
  
  // Save to database, send email, etc.
  
  res.json({ 
    success: true, 
    message: 'Thank you for your message!' 
  });
});
```

### Important Notes

- **Always use `extended: true`** unless you have a specific reason not to
- **Must be placed before routes** that need to access `req.body`
- **Works with HTML forms** by default (they send URL-encoded data)
- **Values are always strings** - convert to numbers if needed: `parseInt(req.body.age)`
- **Security:** Be careful with nested parsing - validate and sanitize input
- **Content-Type:** Only processes requests with `application/x-www-form-urlencoded` header

### Difference from `express.json()`

| Feature | `express.json()` | `express.urlencoded()` |
|---------|------------------|------------------------|
| **Content-Type** | `application/json` | `application/x-www-form-urlencoded` |
| **Data Format** | JSON strings | URL-encoded strings |
| **Use Case** | APIs, AJAX with JSON | HTML forms, traditional forms |
| **Example** | `{"name":"John"}` | `name=John&age=30` |

---

## 11. Express.static() - Serving Static Files

### What is `express.static()`?

**Purpose:** Serve static files (HTML, CSS, JavaScript, images, etc.) directly from a directory

`express.static()` is a built-in Express middleware that serves static files from a specified directory. It's one of the most commonly used Express features for serving frontend assets, images, documents, and other files that don't change dynamically.

### Why is it needed?    

When you have files like:
- **HTML files** (`index.html`, `about.html`)
- **CSS stylesheets** (`style.css`, `bootstrap.css`)
- **JavaScript files** (`app.js`, `script.js`)
- **Images** (`logo.png`, `photo.jpg`)
- **Documents** (`report.pdf`, `data.json`)
- **Uploaded files** (user uploads stored in a folder)

You need a way to serve these files to clients. Without `express.static()`, you'd have to manually write routes for each file, which is impractical.

### How it Works

1. **Specifies a directory** containing static files
2. **Maps URL paths** to files in that directory
3. **Automatically serves files** when requested
4. **Handles file types** correctly (sets proper Content-Type headers)
5. **Supports directory browsing** (optional) 

### Basic Syntax

```javascript
app.use(path, express.static(directory));
```

- **`path`** (optional): URL path prefix (e.g., `/uploads`, `/public`, `/static`)
- **`directory`**: Physical directory path on your server (e.g., `'./uploads'`, `'./public'`)

### Real-World Scenarios

#### Scenario 1: Serving Uploaded Files

**Problem:** Users upload images/files, and you need to make them accessible via URL

**Directory Structure:**
```
project/
  ├── server.js
  └── uploads/
      ├── image-123.jpg
      ├── document-456.pdf
      └── video-789.mp4
```

**Backend:**
```javascript
// Serve files from 'uploads' directory at URL path '/uploads'
app.use('/uploads', express.static('uploads'));

// Now files are accessible at:
// http://localhost:3000/uploads/image-123.jpg
// http://localhost:3000/uploads/document-456.pdf
// http://localhost:3000/uploads/video-789.mp4
```

**Frontend (HTML):**
```html
<!-- Access uploaded image -->
<img src="http://localhost:3000/uploads/image-123.jpg" alt="User Image">

<!-- Link to document -->
<a href="http://localhost:3000/uploads/document-456.pdf">Download PDF</a>
```

#### Scenario 2: Serving Frontend Assets (HTML, CSS, JS)

**Directory Structure:**
```
project/
  ├── server.js
  └── public/
      ├── index.html
      ├── css/
      │   └── style.css
      ├── js/
      │   └── app.js
      └── images/
          └── logo.png
```

**Backend:**
```javascript
// Serve all files from 'public' directory at root URL
app.use(express.static('public'));

// Files are accessible at:
// http://localhost:3000/index.html
// http://localhost:3000/css/style.css
// http://localhost:3000/js/app.js
// http://localhost:3000/images/logo.png
```

**Frontend (index.html):**
```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <img src="/images/logo.png" alt="Logo">
  <script src="/js/app.js"></script>
</body>
</html>
```

#### Scenario 3: Multiple Static Directories

**Backend:**
```javascript
// Serve public assets at root
app.use(express.static('public')); // Serve assets from "public" Dir. 

// Serve uploaded files at /uploads path
app.use('/uploads', express.static('uploads')); // Serve assets from "uploads" Dir, if we get Request at "/uploads" path/route. 

// Serve admin assets at /admin path
app.use('/admin', express.static('admin-assets')); // Serve assets from "admin-assets" Dir, if we get Request at "/admin" path/route. 
```

**Access:**
- `http://localhost:3000/style.css` → from `public/` directory
- `http://localhost:3000/uploads/photo.jpg` → from `uploads/` directory
- `http://localhost:3000/admin/dashboard.html` → from `admin-assets/` directory

#### Scenario 4: Your Current Code

**In your server.js:**
```javascript
app.use('./uploads', express.static('upload'));
```

**⚠️ Potential Issues:**
1. **Path mismatch:** You're using `'./uploads'` (with dot) as the URL path - should be `'/uploads'` (with forward slash)
2. **Directory name:** Using `'upload'` (singular) but your variable is `uploadDir = "./uploads"` (plural)

**Recommended Fix:**
```javascript
// Option 1: Match your uploadDir variable
app.use('/uploads', express.static('uploads'));

// Option 2: Use path.join for better cross-platform support
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

### Understanding the Parameters

#### Without URL Path (Root Level)
```javascript
app.use(express.static('public'));
// Files in 'public' folder are served at root:
// public/index.html → http://localhost:3000/index.html
// public/css/style.css → http://localhost:3000/css/style.css
```

#### With URL Path (Prefixed)
```javascript
app.use('/static', express.static('public'));
// Files in 'public' folder are served with /static prefix:
// public/index.html → http://localhost:3000/static/index.html
// public/css/style.css → http://localhost:3000/static/css/style.css
```

### Advanced Configuration

#### With Options
```javascript
const express = require('express');
const path = require('path');

app.use('/uploads', express.static('uploads', {
  // Set custom headers
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.pdf')) {
      res.setHeader('Content-Disposition', 'attachment');
    }
  },
  // Enable directory listing (shows files in directory)
  index: false, // Don't serve index.html automatically
  // Custom 404 handler
  fallthrough: true
}));
```

#### Absolute vs Relative Paths
```javascript
const path = require('path');

// Relative path (relative to where node process runs)
app.use('/uploads', express.static('uploads'));

// Absolute path (recommended for production)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Using __dirname ensures path works regardless of where you run the script
```

### Common Use Cases

✅ **Serving uploaded files:**
```javascript
app.use('/uploads', express.static('uploads'));
```

✅ **Serving frontend build files:**
```javascript
app.use(express.static('dist')); // React/Vue build output
```

✅ **Serving public assets:**
```javascript
app.use('/assets', express.static('public'));
```

✅ **Serving documentation:**
```javascript
app.use('/docs', express.static('documentation'));
```

### How It Differs from Regular Routes

**Without express.static() (Manual Route):**
```javascript
app.get('/uploads/image.jpg', (req, res) => {
  res.sendFile(path.join(__dirname, 'uploads', 'image.jpg'));
});
// ❌ Have to write a route for EVERY file
```

**With express.static() (Automatic):**
```javascript
app.use('/uploads', express.static('uploads'));
// ✅ Automatically serves ANY file in the uploads directory
```

### Security Considerations

⚠️ **Important Security Notes:**

1. **Don't serve sensitive directories:**
```javascript
// ❌ BAD - Exposes entire project
app.use(express.static('.'));

// ✅ GOOD - Only serve specific safe directory
app.use(express.static('public'));
```

2. **Validate file access:**
```javascript
// For user uploads, consider adding authentication
app.use('/uploads', authenticateUser, express.static('uploads'));
```

3. **Set file size limits:**
```javascript
// Use express.json() limit for request body
app.use(express.json({ limit: '10mb' }));
```

### Complete Example: File Upload + Serving

**Backend:**
```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const uploadDir = './uploads';

// Create uploads directory
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const upload = multer({ dest: uploadDir });

// Serve uploaded files
app.use('/uploads', express.static(uploadDir));

// Upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ 
    success: true, 
    fileUrl: fileUrl,
    message: 'File uploaded successfully'
  });
});

app.listen(3000);
```

**Frontend:**
```html
<form id="uploadForm">
  <input type="file" name="file" id="fileInput">
  <button type="submit">Upload</button>
</form>
<img id="preview" style="display: none;">

<script>
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('file', document.getElementById('fileInput').files[0]);
  
  const response = await fetch('/upload', {
    method: 'POST',
    body: formData
  });
  
  const data = await response.json();
  
  // Display uploaded image using the static file URL
  if (data.success) {
    document.getElementById('preview').src = data.fileUrl;
    document.getElementById('preview').style.display = 'block';
  }
});
</script>
```

### Key Points to Remember

1. **`express.static()` serves files automatically** - no need for individual routes
2. **First parameter is URL path** (optional, defaults to root `/`)
3. **Second parameter is directory path** (where files are stored)
4. **Files are accessible via HTTP GET requests**
5. **Works with any file type** (images, PDFs, videos, etc.)
6. **Use absolute paths** (`path.join(__dirname, 'dir')`) for production
7. **Place before other routes** to avoid conflicts
8. **Security:** Only serve directories you trust

### Common Mistakes

❌ **Wrong:**
```javascript
app.use('./uploads', express.static('upload')); // Wrong path format
app.use('/uploads', express.static('./uploads')); // Works but relative paths can be problematic
```

✅ **Correct:**
```javascript
app.use('/uploads', express.static('uploads')); // Simple and works
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Best practice
```

---

## 12. Body Parser (Deprecated)

**Package:** `body-parser`  
**Type:** External NPM Package (Deprecated)  
**Purpose:** Parse incoming request bodies

### Description
Body Parser was used to parse incoming request bodies in a middleware before your handlers. However, **Express 4.16.0+ includes built-in body parsing**, making this package redundant.

### Current Status
- **Deprecated:** No longer needed with Express 4.16.0+
- **Built-in Alternative:** Use `express.json()` and `express.urlencoded()` instead
- **Direct Relationship:** `express.json()` is the same as `bodyParser.json()`

### Why It's Not Needed
The body-parser package is not needed because Express now provides built-in methods that do the exact same thing:
- `express.json()` = `bodyParser.json()`
- `express.urlencoded()` = `bodyParser.urlencoded()`

### Modern Usage (Express Built-in)
```javascript
// Instead of body-parser, use:
app.use(express.json()); // Parse JSON bodies (replaces bodyParser.json())
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies (replaces bodyParser.urlencoded())
```

### Installation (Not Recommended)
```bash
npm install body-parser  # Only if using Express < 4.16.0
```

---

## Summary

| Package | Type | Purpose | Installation |
|---------|------|---------|--------------|
| express | External | Web framework | `npm install express` |
| mysql2 | External | Database client | `npm install mysql2` |
| dotenv | External | Environment variables | `npm install dotenv` |
| cors | External | Cross-origin requests | `npm install cors` |
| multer | External | File uploads | `npm install multer` |
| path | Built-in | Path utilities | No installation needed |
| fs | Built-in | File system | No installation needed |
| express-rate-limit | External | Rate limiting | `npm install express-rate-limit` |
| express.json() | Built-in (Express 4.16.0+) | JSON body parsing | No installation needed |
| express.urlencoded() | Built-in (Express 4.16.0+) | Form data parsing | No installation needed |
| body-parser | External (Deprecated) | Body parsing | Not recommended |

---

## Best Practices

1. **Environment Variables:** Always use `dotenv` for sensitive configuration
2. **Security:** Implement rate limiting for public APIs
3. **File Uploads:** Validate file types and sizes when using multer
4. **CORS:** Configure CORS properly for production (don't allow all origins)
5. **Database:** Use connection pooling and prepared statements with mysql2
6. **Error Handling:** Always handle errors in async database operations

---

---

## Server.js Code Structure

Here's how the libraries are used in `server.js`:

### Package Imports
```javascript
const express = require("express");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const rateLimit = require("express-rate-limit");
```

### Initialization
```javascript
// Load environment variables from .env file
dotenv.config();

// Create Express application instance
const app = express();
const PORT = process.env.PORT || 3000;
```

### Directory Setup
```javascript
// Create uploads directory if it doesn't exist
// Uses fs.existsSync() to check and fs.mkdirSync() to create directory
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
```

### Middleware Configuration
```javascript
// CORS - Enable Cross-Origin Resource Sharing
// Allows requests from different origins/domains
app.use(cors());

// express.json() - Parses incoming JSON request bodies and makes them available in req.body
// This is the built-in Express version of bodyParser.json() (no need to install body-parser)
// Intercepts requests with Content-Type: application/json header
// Converts JSON strings to JavaScript objects and attaches to req.body
app.use(express.json());

// express.urlencoded() - Parses incoming URL-encoded form data (application/x-www-form-urlencoded)
// This is the built-in Express version of bodyParser.urlencoded()
// Handles form submissions and URL-encoded data
// extended: true allows parsing of rich objects and arrays
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('./uploads', express.static('upload'));
```

### Key Points
- **Middleware Order Matters:** Middleware is executed in the order it's defined
- **express.json()** must be placed before routes that need to access JSON data in `req.body`
- **express.urlencoded()** handles traditional HTML form submissions
- **CORS** should be configured early in the middleware chain
- **dotenv.config()** must be called before accessing `process.env` variables

---

## Additional Resources

- [Express Documentation](https://expressjs.com/)
- [MySQL2 Documentation](https://github.com/sidorares/node-mysql2)
- [Dotenv Documentation](https://github.com/motdotla/dotenv)
- [CORS Documentation](https://github.com/expressjs/cors)
- [Multer Documentation](https://github.com/expressjs/multer)
- [Node.js Path Module](https://nodejs.org/api/path.html)
- [Node.js FS Module](https://nodejs.org/api/fs.html)
- [Express Rate Limit](https://github.com/express-rate-limit/express-rate-limit)

