import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

export const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.PASSWORD_DB,
  database: process.env.DATABASE_NAME,
});
