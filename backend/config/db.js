const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || process.env.DB_PASS, // Supports both names
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306, // Added this line for Railway
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // If Railway gives you a connection error, uncomment the line below:
  // ssl: { rejectUnauthorized: false }
});

module.exports = pool;
