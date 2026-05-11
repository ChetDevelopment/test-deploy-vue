const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || "postgres://localhost:5432/node_hms",
});

pool.on("connect", () => {
  console.log("PostgreSQL Connected");
});

module.exports = pool;
