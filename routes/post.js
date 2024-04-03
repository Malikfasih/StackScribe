import { Router } from "express";
import {
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
} from "../controllers/post.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get("/", getPosts);
router.get("/getPost/:id", getPost);
router.post("/addPost", auth, addPost);
router.put("/updatePost/:id", auth, updatePost);
router.delete("/deletePost/:id", auth, deletePost);

export default router;
