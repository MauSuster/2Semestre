import sql from "mssql";
import 'dotenv/config';

const config = {
  user: process.env.MSSQL_USER || "suster_",
  password: process.env.MSSQL_PASSWORD || "admin",
  server: process.env.MSSQL_HOST || "sql.bsite.net",
  database: process.env.MSSQL_DB || "suster_",
  options: {
    encrypt: true, // obrigatório para Azure ou conexões externas
    trustServerCertificate: true, // permite certificado autoassinado
    instanceName: "MSSQL2016" // nome da instância, se houver
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

export const pool = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log("Conectado ao MSSQL!");
    return pool;
  })
  .catch(err => {
    console.error("Erro ao conectar ao MSSQL:", err);
    process.exit(1);
  });
