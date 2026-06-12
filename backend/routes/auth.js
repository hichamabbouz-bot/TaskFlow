const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");

const router = express.Router();

const toPublicUser = (user) => ({
  fullName: user.fullName,
  email: user.email,
  profilePicture: user.profilePicture,
});

router.post("/register", upload.single("profilePicture"), async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      profilePicture: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await user.save();
    res.status(201).json({ message: "Utilisateur cree avec succes" });
  } catch (err) {
    console.error("Erreur inscription:", err);
    res.status(400).json({
      message: "Email deja utilise ou erreur lors de l'inscription",
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }

  try {
    const user = await User.findOne({ email });
    const isPasswordValid = user && (await bcrypt.compare(password, user.password));

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: toPublicUser(user),
    });
  } catch (err) {
    console.error("Erreur login:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouve" });
    }

    res.json(toPublicUser(user));
  } catch (err) {
    console.error("Erreur profil:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.put("/profile-picture", auth, upload.single("profilePicture"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Photo de profil requise" });
  }

  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouve" });
    }

    user.profilePicture = `/uploads/${req.file.filename}`;
    await user.save();

    res.json(toPublicUser(user));
  } catch (err) {
    console.error("Erreur upload photo profil:", err);
    res.status(500).json({ message: "Erreur serveur lors de l'upload" });
  }
});

module.exports = router;
