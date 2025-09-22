import sql from "mssql";
import 'dotenv/config';

const config = {
  user: process.env.MSSQL_USER || "suster_",
  password: process.env.MSSQL_PASSWORD || "admin",
  server: process.env.MSSQL_HOST || "sql.bsite.net",
  database: process.env.MSSQL_DB || "suster_",
  options: {
    encrypt: true,
    trustServerCertificate: true,
    instanceName: "MSSQL2016"
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// Cria o pool global
const pool = new sql.ConnectionPool(config);

// Exporta o pool já conectado
export const getPool = async () => {
  if (!pool.connected) await pool.connect();
  return pool;
};
