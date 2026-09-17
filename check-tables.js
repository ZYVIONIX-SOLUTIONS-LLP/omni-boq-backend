require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function check() {
  try {
    await client.connect();

    const result = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'users'
      ORDER BY ordinal_position;
    `);

    console.table(result.rows);
  } catch (error) {
    console.error('FAILED:', error.message);
  } finally {
    await client.end();
  }
}

check();