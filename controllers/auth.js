import bcrypt from "bcrypt";
import { db } from "../db.js";

// Register user
// export const register = (req, res) => {
//   const { username, email, password } = req.body;
//   // Check existing user
//   const q = "SELECT * FROM users WHERE username = ? OR email = ?";

//   db.query(q, [username, email], (err, data) => {
//     if (err) return res.status(500).json(err);
//     if (data.length) return res.status(409).send("User already exists");

//     console.log("plain password:", password);
//     bcrypt.hash(password, 10, (hashErr, hashPassword) => {
//       if (hashErr) res.status(500).json(hashErr);
//       console.log("hashed password:", hashPassword);
//       const q = "INSERT INTO users(`username`, `email`, `password`) VALUES (?)";
//       db.query(q, [username, email, hashPassword], (err, data) => {
//         if (err) return res.json(err);
//         return res.status(200).json("User has been created.");
//       });
//     });
//   });
// };

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
  } catch (err) {
    return res.status(500).json(err);
  }
};

// Login user
export const login = async (req, res) => {};

// Logout user
export const logout = async (req, res) => {};
