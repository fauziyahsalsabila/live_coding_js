const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const path = require("path");

const app = express();

//set view engine
app.set("view engine", "ejs");

//middleware untuk parsing data (body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

//set static folder css
app.use(express.static(path.join(__dirname, "public")));

//middleware untuk cek status login
app.use((req, res, next) => {
  if (
    !req.session.userbiota &&
    req.path !== "/auth/login" &&
    req.path !== "/auth/register"
  ) {
    return res.redirect("/auth/login");
  }
  next();
});

//routes
app.use("/auth", authRoutes);

//mysql connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "laut",
});

connection.connect((err) => {
  if (err) {
    console.error("Terjadi kesalahan...", err.stack);
    return;
  }
  console.log("Koneksi berhasil" + connection.threadId);
});

// Read
app.get("/", (req, res) => {
  const query = "SELECT * FROM biota";
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.render("index", { biota : results });
  });
});

// Create
app.post("/add", (req, res) => {
  const { Ekosistem, Air, Tanggal, Wilayah } = req.body;
  const query = "INSERT INTO biota (Ekosistem, Air, Tanggal, Wilayah) VALUES (?, ?, ?, ?)";
  connection.query(query, [Ekosistem, Air, Tanggal, Wilayah], (err, result) => {
    if (err) throw err;
    res.redirect("/");
  });
});

// Edit
app.get("/edit/:id", (req, res) => {
  const query = "SELECT * FROM biota WHERE ID = ?";
  connection.query(query, [req.params.id], (err, result) => {
    if (err) throw err;
    res.render("edit", { biota : result[0] });
  });
});

// Update
app.post("/update/:id", (req, res) => {
  const { Ekosistem, Air, Tanggal, Wilayah } = req.body;
  const query = "UPDATE biota SET Ekosistem = ?, Air = ?, Tanggal = ?, Wilayah = ? WHERE ID = ?";
  connection.query(query, [Ekosistem, Air, Tanggal, Wilayah, req.params.id], (err, result) => {
    if (err) throw err;
    res.redirect("/");
  });
});

// Delete
app.get("/delete/:id", (req, res) => {
  const query = "DELETE FROM biota WHERE ID = ?";
  connection.query(query, [req.params.id], (err, result) => {
    if (err) throw err;
    res.redirect("/");
  });
});

// Server listening
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
