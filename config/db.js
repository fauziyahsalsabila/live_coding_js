const mysql = require("mysql");
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "laut"
});

db.connect((err) => {
    if (err){
        console.error("Error database gagal terkoneksi:", err.stack);
        return;
    }
    console.log("Koneksi database berhasil...");
});

module.exports = db;