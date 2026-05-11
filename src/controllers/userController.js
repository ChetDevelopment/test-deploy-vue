const pool = require("../config/db");

//
// 📥 GET ALL USERS
//
exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

//
// 📥 GET ONE USER BY ID
//
exports.getUserById = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

//
// ➕ CREATE USER
//
exports.createUser = async (req, res) => {
  try {
    const { name, age, email } = req.body;
    const result = await pool.query(
      "INSERT INTO users (name, age, email) VALUES ($1, $2, $3) RETURNING *",
      [name, age, email]
    );

    res.status(201).json({
      message: "User created successfully",
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

//
// ✏️ UPDATE USER
//
exports.updateUser = async (req, res) => {
  try {
    const { name, age, email } = req.body;
    const result = await pool.query(
      "UPDATE users SET name = $1, age = $2, email = $3 WHERE id = $4 RETURNING *",
      [name, age, email, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "User updated successfully",
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

//
// 🗑 DELETE USER
//
exports.deleteUser = async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
