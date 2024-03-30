import bcrypt from "bcrypt";
import { db } from "../db.js";
import jwt from "jsonwebtoken";

// Register User
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check existing user
    const userExists = await db.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    // Extract the actual result set
    const actualResult = userExists[0];
    // console.log("User exists data:", actualResult);

    if (actualResult.length) {
      return res.status(409).send("User already exists");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // await db.query(
    //   "INSERT INTO users (username, email, password) VALUES (?,?,?)",
    //   [username, email, hashPassword]
    // );

    // Or

    await db.query("INSERT INTO users (username, email, password) VALUES (?)", [
      [username, email, hashPassword],
    ]);

    return res.status(200).json("User has been created.");
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Login user
export const login = async (req, res) => {
  try {
    // Check user exists
    const userExists = await db.query("SELECT * FROM users WHERE email = ?", [
      req.body.email,
    ]);
    if (!userExists[0][0]) res.status(404).json("User not found!");

    //  Check password is correct
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      userExists[0][0].password
    );
    if (!isPasswordCorrect) res.status(404).json("Invalid credentials");

    // Generate token
    const token = jwt.sign(
      { email: userExists[0][0].email, id: userExists[0][0]._id },
      process.env.JWT_SECRET_KEY
    );

    // separate password from user credentials
    const { password, ...other } = userExists[0][0];
    console.log("other fields", other);
    console.log("user password", password);

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(other);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Logout user
export const logout = async (req, res) => {
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("User has been logged out.");
};
