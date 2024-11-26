const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../config/db");

//render halaman register
router.get("/register", (req, res) => {
  res.render("register");
});

//proses register user
router.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = "INSERT INTO userbiota (username, email, password) VALUE (?, ?, ?)";
  db.query(query, [username, email, hashedPassword], (err, result) => { 
    if (err) throw err;
    res.redirect("/auth/login");
  });
});

//render halaman login
router.get("/login", (req, res) => {
  res.render("login");
});

//proses login user
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT * FROM userbiota WHERE username = ?";
  db.query(query, [username], (err, result) => {
    if (err) {
      console.error("Error saat login:", err);
      return res.status(500).send("Terjadi kesalahan saat login.");
    }

    if (result.length > 0) {
      const userbiota = result[0];

      // Verifikasi password
      if (bcrypt.compareSync(password, userbiota.password)) {
        // Simpan session user
        req.session.userbiota = userbiota; // Pastikan ini berjalan
        res.redirect("/auth/dash"); // redirect ke halaman dashboard setelah login sukses
      } else {
        res.send("Password salah.");
      }
    } else {
      res.send("User tidak ditemukan.");
    }
  });
});


//render halaman dash user
router.get("/dash", (req, res) => {
  if (req.session.userbiota) {
    res.render("dash", { userbiota: req.session.userbiota });
  } else {
    res.redirect("/auth/login");
  }
});

//proses logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/auth/login");
});


module.exports = router;
