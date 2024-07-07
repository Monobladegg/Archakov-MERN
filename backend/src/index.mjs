import express from "express";
import mongoose from "mongoose";
import {
  loginValidation,
  registrationValidation,
} from "./validations/auth.mjs";
import checkAuth from "./utils/checkAuth.mjs";
import { register, login, me } from "./controllers/UserController.mjs";
import {
  create,
  getAll,
  getOne,
  remove,
  update,
  getLastTags
} from "./controllers/PostController.mjs";
import { postCreateValidation } from "./validations/post.mjs";
import multer from "multer";
import handleValidationsErrors from "./utils/handleValidationsErrors.mjs";
import cors from "cors";

mongoose
  .connect(
    "mongodb+srv://monoblade:wwwwww@cluster0.tfbxkxu.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post("/auth/login", loginValidation, handleValidationsErrors, login);
app.post(
  "/auth/register",
  registrationValidation,
  handleValidationsErrors,
  register
);
app.get("/auth/me", checkAuth, me);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }
  console.log(req.file);
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/tags", getLastTags);

app.get("/posts", getAll);
app.get("/posts/:id", getOne);
app.post("/posts", checkAuth, postCreateValidation, create);
app.delete("/posts/:id", checkAuth, remove);
app.patch("/posts/:id", checkAuth, handleValidationsErrors, update);

app.listen(4444, (err) => {
  if (err) return console.log(err);
  console.log("Server listening on port 4444");
});
