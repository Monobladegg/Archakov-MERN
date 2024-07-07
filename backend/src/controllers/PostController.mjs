import PostModel from "../models/Post.mjs";
import { validationResult } from "express-validator";

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();
    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);
    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return res
        .status(400)
        .json("Некорректные данные при создании статьи", errors.array());
    }

    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(" "),
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find()

    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { new: true }
    )

    if (!updatedPost) {
      return res.status(404).json({
        message: "Статья не найдена",
      });
    }

    res.json(updatedPost);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};


export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await PostModel.findByIdAndDelete(postId, (err, doc) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Не удалось удалить статью",
        });
      }
      if (!doc) {
        return res.status(404).json({
          message: "Статья не найдена",
        });
      }
      res.status(200).json({
        success: true,
      });
    });
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await PostModel.findByIdAndUpdate(postId, req.body, {
      new: true,
    });
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};
