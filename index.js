import express from "express";
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

const app = express();
app.use(express.json());
dotenv.config();

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.PASSWORD_DB,
  database: process.env.DATABASE_NAME,
});

app.listen(8000, () => {
  console.log("Application is connected!");
});

app.get("/books", async (req, res) => {
  try {
    const q = "SELECT * FROM books";

    const books = await db.query(q);
    res.status(201).send({ message: "All books", books: books[0] });
  } catch (error) {
    res.status(500).send({
      message: "Unable to fetch books",
      error,
    });
  }
});

// Create book
app.post("/books/create-book", async (req, res) => {
  const { title, desc, cover } = req.body;

  try {
    const q = "INSERT INTO books (`title`, `desc`, `cover`) VALUES (?)";
    const values = [title, desc, cover];

    await db.query(q, [values]);
    return res.status(201).send({ message: "book has been created!" });
  } catch (error) {
    res.status(500).send({ message: "Unable to create new book", error });
  }
});

// Update book
app.put("/books/update-book/:id", async (req, res) => {
  const { id } = req.params;

  const { title, desc, cover } = req.body;
  try {
    const q =
      "UPDATE books SET `title` = ?, `desc` = ?, `cover` = ? WHERE id = ?";
    const values = [title, desc, cover];

    const book = await db.query(q, [...values, id]);
    return res
      .status(201)
      .send({ message: "Book has been Updated!", updatedBook: book });
  } catch (error) {
    res.status(500).send({ message: "Unable to update a book", error });
  }
});

// Delete book
app.delete("/books/delete-book/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const q = "DELETE From books WHERE id = ?";

    await db.query(q, [id]);
    return res.status(201).send({ message: "Book has been Deleted!" });
  } catch (error) {
    res.status(500).send({ message: "Unable to delete a book", error });
  }
});
