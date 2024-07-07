import UserModel from "../models/User.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const password = req.body.password;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const doc = new UserModel({
      fullName: req.body.fullName,
      email: req.body.email,
      passwordHash: hash,
      avatarUrl: req.body.avatarUrl
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id
      },
      "secret123",
      {
        expiresIn: "30d"
      }
    );
    const { passwordHash, ...userData } = user._doc;

    res.status(201).json({ ...userData, token });

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "Пользователь не найден" });
    
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPassword) return res.status(400).json({ message: "Неверный пароль" });

    const token = jwt.sign(
      {
        _id: user._id
      },
      "secret123",
      {
        expiresIn: "30d"
      }
    );

    const { passwordHash, ...userData } = user._doc;

    return res.status(200).json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};


export const me = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const { passwordHash, ...userData } = user._doc;

    res.status(200).json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}