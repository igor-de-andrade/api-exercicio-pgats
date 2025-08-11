const express = require("express");
const router = express.Router();
const userService = require("../service/userService");

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ error: "Token não informado." });
  const token = authHeader.split(" ")[1];
  const payload = userService.verifyToken(token);
  if (!payload) return res.status(401).json({ error: "Token inválido." });
  req.user = payload;
  next();
}

router.post("/register", async (req, res) => {
  try {
    const result = await userService.registerUser(req.body);
    if (result && result.error)
      return res.status(400).json({ erro: result.error });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ erro: err.message || "Erro inesperado." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const result = await userService.authenticateUser(req.body);
    if (result && result.error)
      return res.status(401).json({ erro: result.error });
    res.json(result);
  } catch (err) {
    res.status(500).json({ erro: err.message || "Erro inesperado." });
  }
});

router.get("/users", authMiddleware, async (req, res) => {
  try {
    const result = await userService.getAllUsers();
    res.json(result);
  } catch (err) {
    res.status(500).json({ erro: err.message || "Erro inesperado." });
  }
});

router.put("/users/:login", authMiddleware, async (req, res) => {
  try {
    const { login } = req.params;
    const result = await userService.updateUser(
      login,
      req.body,
      req.user.login
    );
    if (result && result.error)
      return res.status(403).json({ erro: result.error });
    res.json(result);
  } catch (err) {
    res.status(500).json({ erro: err.message || "Erro inesperado." });
  }
});

router.authMiddleware = authMiddleware;
module.exports = router;
