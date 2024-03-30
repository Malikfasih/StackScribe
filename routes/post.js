import { Router } from "express";
import {
  getPosts,
  getPost,
  //   createPost,
  //   updatePost,
  //   deletePost,
} from "../controllers/post.js";

const router = Router();

router.get("/", getPosts);
router.get("/getPost/:id", getPost);
// router.post("/createPost", createPost);
// router.put("/updatePost/:id", updatePost);
// router.delete("/deletePost/:id", deletePost);

export default router;
