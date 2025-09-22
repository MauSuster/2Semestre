import 'dotenv/config'
import mysql from 'mysql2/promise'  

const{MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB} = process.env
const testConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: MYSQL_HOST,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DB
    })
    const [rows] = await connection.execute('SELECT NOW() AS agora')
    console.log('Conexão bem-sucedida - Data/Hora:', rows[0].agora)
    await connection.end()
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error)
  }
}


testConnection()
