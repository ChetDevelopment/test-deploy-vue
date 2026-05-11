#!/usr/bin/env node

/**
 * Vercel Backend + Database Deployment Script
 * 
 * USAGE:
 *   node deploy.js
 * 
 * This script will:
 * 1. Check if Vercel CLI is installed
 * 2. Login to Vercel
 * 3. Deploy backend
 * 4. Prompt for database connection string
 * 5. Add environment variable
 * 6. Create database tables
 * 7. Redeploy with database connected
 */

const { execSync } = require("child_process");
const readline = require("readline");
const fs = require("fs");
const path = require("path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function exec(command) {
  try {
    return execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(`Command failed: ${command}`);
    throw error;
  }
}

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log("===========================================");
  console.log("  Vercel Backend + Database Deployment");
  console.log("===========================================\n");

  // Step 1: Check Vercel CLI
  console.log("📦 Step 1: Checking Vercel CLI...");
  try {
    execSync("vercel --version", { stdio: "pipe" });
    console.log("✅ Vercel CLI installed\n");
  } catch (error) {
    console.log("❌ Vercel CLI not found. Installing...");
    exec("npm install -g vercel");
    console.log("✅ Vercel CLI installed\n");
  }

  // Step 2: Login
  console.log("🔐 Step 2: Logging in to Vercel...");
  exec("vercel login");
  console.log("✅ Logged in\n");

  // Step 3: Deploy backend (creates project)
  console.log("🚀 Step 3: Deploying backend...");
  exec("vercel --prod");
  console.log("✅ Backend deployed\n");

  // Step 4: Database setup instructions
  console.log("===========================================");
  console.log("  DATABASE SETUP REQUIRED");
  console.log("===========================================\n");
  console.log("📋 Step 4: Create Database (One-time setup)\n");
  console.log("1. Go to: https://vercel.com/new");
  console.log("2. Click 'Storage' → 'Add Database'");
  console.log("3. Choose 'Neon' or 'Vercel Postgres'");
  console.log("4. Click 'Create Database'");
  console.log("5. Copy the connection string\n");
  console.log("Connection string looks like:");
  console.log("postgres://user:password@host.neon.tech/dbname?sslmode=require\n");

  const connectionString = await question("Paste your connection string: ");

  // Step 5: Add environment variable
  console.log("\n🔧 Step 5: Adding environment variable...");
  exec(`vercel env add POSTGRES_URL production "${connectionString}"`);
  console.log("✅ Environment variable added\n");

  // Step 6: Create database tables
  console.log("📊 Step 6: Creating database tables...");
  
  // Create temporary init script
  const initScript = `
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "${connectionString.replace(/"/g, '\\"')}",
});

async function createTables() {
  try {
    await pool.query(\`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        age INTEGER,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    \`);
    console.log("✅ Table 'users' created successfully!");
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    await pool.end();
    process.exit(1);
  }
}

createTables();
`;

  fs.writeFileSync("temp-init-db.js", initScript);
  exec("node temp-init-db.js");
  fs.unlinkSync("temp-init-db.js");
  console.log("✅ Database tables created\n");

  // Step 7: Redeploy
  console.log("🔄 Step 7: Redeploying with database connection...");
  exec("vercel --prod");
  console.log("✅ Redeployed\n");

  // Done
  console.log("===========================================");
  console.log("  🎉 DEPLOYMENT COMPLETE!");
  console.log("===========================================\n");
  
  console.log("Your API is live at:");
  console.log("https://YOUR-PROJECT.vercel.app/api/users\n");
  
  console.log("Test commands:");
  console.log("  curl https://YOUR-PROJECT.vercel.app/api/users");
  console.log("  curl -X POST https://YOUR-PROJECT.vercel.app/api/users -H \"Content-Type: application/json\" -d \"{\\\"name\\\":\\\"John\\\",\\\"age\\\":30}\"");
  console.log("");

  rl.close();
}

main().catch(error => {
  console.error("❌ Deployment failed:", error.message);
  rl.close();
  process.exit(1);
});
