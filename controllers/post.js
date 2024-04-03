import { db } from "../db.js";

// Get all posts
export const getPosts = async (req, res) => {
  try {
    // Construct the SQL query to get the posts
    const q = req.query.cat
      ? "SELECT * FROM posts WHERE cat = ?"
      : "SELECT * FROM posts";

    const posts = await db.query(q, [req.query.cat]);
    if (!posts.length === 0) res.status(404).json("No posts available");

    res.status(200).json(posts[0]);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getPost = async (req, res) => {
  try {
    // Construct the SQL query to get the post
    const q =
      "SELECT p.id, `username`, `title`, `desc`, p.img, u.img AS userImg, `cat`,`date` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ? ";

    const post = await db.query(q, [req.params.id]);
    res.status(200).json(post[0]);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const addPost = async (req, res) => {
  const userId = req.userId;

  try {
    // Construct the SQL query to add the post
    const query =
      "INSERT INTO posts (title, `desc`, img, cat, uid) VALUES (?, ?, ?, ?, ?)";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      userId,
    ];

    await db.query(query, values);
    return res.json("Post has been created.");
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId; // Accessing user ID set by the auth middleware

  try {
    // Construct the SQL query to delete the post
    const query = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?";

    // Execute the query asynchronously
    const [result] = await db.query(query, [id, userId]);

    console.log("result of posts by user:", result);

    if (result.affectedRows === 0) {
      return res.status(403).json("You can delete only your post!");
    }

    return res.json("Post has been deleted!");
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  }
};

export const updatePost = (req, res) => {
  const postId = req.params.id;
  const userId = req.userId;

  // Construct the SQL query to update the post
  const query =
    "UPDATE posts SET `title`=?,`desc`=?,`img`=?,`cat`=? WHERE `id` = ? AND `uid` = ?";

  const values = [req.body.title, req.body.desc, req.body.img, req.body.cat];

  db.query(query, [...values, postId, userId]);
  return res.json("Post has been updated.");
};
