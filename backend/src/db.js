import 'dotenv/config';
import sql from 'mssql';

export const pool = new sql.ConnectionPool({
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  server: process.env.MSSQL_HOST, // ex: sql.bsite.net
  database: process.env.MSSQL_DB,
  options: {
    encrypt: true,
    trustServerCertificate: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
});

await pool.connect();
console.log('Conectado ao SQL Server!');
