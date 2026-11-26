import { Pool } from "pg";
import config from "../config";
import { resolve } from "node:path";
import { readFile } from "node:fs/promises";

export const pool = new Pool({
  connectionString: config.connection_string,
});

export const initDB = async () => {
    try {
      
        const schema = await readFile(
            resolve(process.cwd(), "schema.sql"),
            "utf-8"
        )
        await pool.query(schema);
        console.log("Database connected!!");
  } catch (error) {
    console.log(error);
  }
};