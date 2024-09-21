import mysql from "mysql2/promise"

export const db_conn = mysql.createPool({
    host: "localhost",
    user: "mh-user",
    password: "mobilehour123",
    database: "mobile-hour",
})

