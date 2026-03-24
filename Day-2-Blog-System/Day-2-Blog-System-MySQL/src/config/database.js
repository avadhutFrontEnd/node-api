const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test database connection
// pool.getConnection().then((connection) => {
//     console.log("✅ MySQL Database connected successfully");
//     connection.release();
// }).catch((error) => {
//     console.error("❌ MySQL Database connection failed:", error.message);
//     process.exit(1);
// });

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL Database connected successfully");
    connection.release();
  } catch (error) {
    console.error("❌ MySQL Database connection failed:", error.message);
    process.exit(1);
  }
}

// async function initializeTables() {
//   try {
//     await pool.query(
//       `CREATE TABLE IF NOT EXISTS posts (
//             id INT AUTO_INCREMENT PRIMARY KEY,
//             title VARCHAR(255) NOT NULL,
//             slug VARCHAR(255) UNIQUE NOT NULL,
//             content TEXT NOT NULL,
//             excerpt VARCHAR(500),
//             author_name VARCHAR(100) NOT NULL,
//             status VARCHAR(20) DEFAULT 'draft',
//             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//         )`,
//     );

//     await pool.query(
//       `CREATE INDEX idx_slug ON posts(slug);
//       CREATE INDEX idx_status ON posts(status);`
//     );

//     await pool.query(`
//         CREATE TABLE comments (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     post_id INT NOT NULL,
//     author_name VARCHAR(100) NOT NULL,
//     email VARCHAR(255) NOT NULL,
//     content TEXT NOT NULL,
//     status VARCHAR(20) DEFAULT 'pending',
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
// );    
//     `);

//     await pool.query(` 
//         CREATE INDEX idx_post_id ON comments(post_id);
//     `);

//     console.log("✅ Database tables initialized");
//   } catch (error) {
//     console.error("❌ Database initialization failed:", error.message);
//     process.exit(1);
//   }
// }

testConnection();
// initializeTables();

module.exports = pool;
