import Sequelize from "sequelize";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

// dotenv package installed to store database variables
dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USERNAME,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: "mysql",
  }
);
async function createDatabaseIfNotExists() {
  try {
    // Create a MySQL connection
    const connection = await mysql.createPool({
      host: process.env.HOST,
      user: process.env.USERNAME,
      password: process.env.PASSWORD,
    });

    // Create the database if it doesn't exist
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DATABASE}\`;`
    );

    // Close the connection
    await connection.end();
  } catch (error) {
    console.error("Error creating database:", error);
  }
}

async function authenticateDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Connection to the database successful.");
    return true;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw new Error("Error in authenticate database");
  }
}

async function syncModels(models = []) {
  try {
    for (const model of models) {
      await model.sync({ alter: true });
    }
    return true;
  } catch (error) {
    console.error("Error synchronizing models:", error);
    return false;
  }
}

export default {
  sequelize,
  createDatabaseIfNotExists,
  authenticateDatabase,
  syncModels,
};
