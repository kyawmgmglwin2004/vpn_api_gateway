import e from "express";
import Mysql from "../../helper/db.js";
import StatusCode from "../../helper/statusCode.js";
import bcrypt from "bcrypt";

async function userLogin(phone, password) {
  let connection;
  try {

    if (!phone || !password) {
      return StatusCode.INVALID_ARGUMENT("Missing required fields");
    }

    const sql = `SELECT * FROM users WHERE phone = ?`;
    connection = await Mysql.getConnection();
    const [rows] = await connection.query(sql, [phone]);

    if (rows.length === 0) {
      return StatusCode.NOT_FOUND("user not found");
    }

    const user = rows[0];
    console.log("===", user.status);

    if (user.status === 0) {
      return StatusCode.UNAUTHENTICATED("Admin have been ban this user");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return StatusCode.INVALID_ARGUMENT("Password is not correct!");
    }
    console.log("User login successful:", user);

    return StatusCode.OK("login success", user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return StatusCode.UNKNOWN("Database error");
  } finally {
    if (connection) connection.release();
  }
}

async function userRegister(user_name, phone, password) {
  let connection;
  try {
    if (!user_name || !phone || !password) {
      return StatusCode.INVALID_ARGUMENT("Missing required fields");
    }
    const existingUserSql = `SELECT * FROM users WHERE phone = ?`;

    connection = await Mysql.getConnection();
    const [existingUsers] = await connection.query(existingUserSql, [phone]);

    if (existingUsers.length > 0) {
      return StatusCode.INVALID_ARGUMENT("Phone number already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdAt = new Date().toISOString().slice(0, 19).replace("T", " ");

    let sql = `INSERT INTO users (user_name, phone, password, created_at) VALUES (?, ?, ?, ?)`;

    const [result] = await connection.query(sql, [user_name, phone, hashedPassword, createdAt]);

    if (result.affectedRows === 0) {
      return StatusCode.UNKNOWN("User registration failed");
    }

    return StatusCode.OK("user registered successfully");

  } catch (error) {
    console.error("Error registering user:", error);
    return StatusCode.UNKNOWN("Database error");
  } finally {
    if (connection) connection.release();
  }
}

async function getUserById(userId) {
  let connection;
  try {
    const id = Number(userId);
    if (!userId || typeof userId !== "number") {
      return StatusCode.INVALID_ARGUMENT("Invalid user ID");
    }
    const sql = `
        SELECT 
            u.id, 
            u.user_name, 
            u.phone,
            u.plan_id,
            u.current_data,
            u.start_date,
            u.end_date,
            u.created_at,
            COALESCE(w.type, 0) AS plan_type,
        FROM users u
        LEFT JOIN plans w ON u.plan_id = w.id
        WHERE u.id = ?
    `;

    connection = await Mysql.getConnection();
    const [rows] = await connection.query(sql, [userId]);

    if (rows.length === 0) {
      return StatusCode.NOT_FOUND("User not found");
    }

    const user = rows[0];
    return StatusCode.OK("User retrieved successfully", user);

  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return StatusCode.UNKNOWN("Database error");
  } finally {
    if (connection) connection.release();
  }
}

export default {
  userLogin,
  userRegister,
  getUserById
};