const { users } = require("../model/userModel");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "supersecretkey";

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function findUserByLogin(login) {
  return users.find((u) => u.login === login);
}

function registerUser({ nome, login, senha, email }) {
  if (!login || !senha) {
    return { error: "Usuário e senha são obrigatórios." };
  }
  if (!validateEmail(email)) {
    return { error: "E-mail inválido." };
  }
  if (findUserByLogin(login)) {
    return { error: "Usuário já existe." };
  }
  const user = { nome, login, senha, email };
  users.push(user);
  return { ...user, senha: undefined };
}

function authenticateUser({ login, senha }) {
  const user = findUserByLogin(login);
  if (!user) return { error: "Usuário ou senha inválidos." };
  if (senha !== user.senha) {
    return { error: "Usuário ou senha inválidos." };
  }
  // Inclui todos os dados do usuário exceto a senha no payload do token
  const { senha: _, ...userData } = user;
  const token = jwt.sign(userData, JWT_SECRET, {
    expiresIn: "1h",
  });
  return { token };
}

function getAllUsers() {
  return users.map(({ senha, ...rest }) => rest);
}

function updateUser(login, { nome, senha, email }, requesterLogin) {
  if (login !== requesterLogin) {
    return { error: "Você só pode editar suas próprias informações." };
  }
  const user = findUserByLogin(login);
  if (!user) return { error: "Usuário não encontrado." };
  if (email && !validateEmail(email)) {
    return { error: "E-mail inválido." };
  }
  if (nome) user.nome = nome;
  if (senha) user.senha = senha;
  if (email) user.email = email;
  return { ...user, senha: undefined };
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

module.exports = {
  registerUser,
  authenticateUser,
  getAllUsers,
  updateUser,
  verifyToken,
};
