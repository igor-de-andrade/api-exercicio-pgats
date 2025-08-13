const request = require("supertest");
const sinon = require("sinon");
const { expect } = require("chai");

const app = require("../../app");
const userService = require("../../service/userService");

describe("User Controller", () => {
  describe("POST /register", () => {
    it("Quando informo dados válidos, devo receber a resposta 201", async () => {
      const userServiceMock = sinon.stub(userService, "registerUser");
      userServiceMock.returns({
        nome: "Carlos Almeida Neves",
        login: "CARLOS_ALMEIDA",
        email: "test@test.com",
      });

      const resposta = await request(app).post("/api/register").send({
        nome: "Carlos Almeida Neves",
        login: "CARLOS_ALMEIDA",
        senha: "123",
        email: "test@test.com",
      });

      expect(resposta.status).to.equal(201);
      expect(resposta.body).to.deep.equal({
        nome: "Carlos Almeida Neves",
        login: "CARLOS_ALMEIDA",
        email: "test@test.com",
      });

      sinon.restore();
    });

    it("Quando informo um login já cadastrado, devo receber a resposta 400", async () => {
      const userServiceMock = sinon.stub(userService, "registerUser");
      userServiceMock.returns({ error: "Usuário já existe." });

      const resposta = await request(app).post("/api/register").send({
        nome: "Carlos Almeida Neves",
        login: "CARLOS_ALMEIDA",
        senha: "123",
        email: "test@test.com",
      });
      expect(resposta.status).to.equal(400);
      expect(resposta.body).to.have.property("erro", "Usuário já existe.");

      sinon.restore();
    });
  });

  describe("GET /users", () => {
    it("Quando informo dados válidos, devo receber a resposta 200", async () => {
      const userServiceMock = sinon.stub(userService, "getAllUsers");
      sinon.stub(userService, "verifyToken").returns("fakeToken");

      userServiceMock.returns([
        {
          nome: "Carlos Almeida",
          login: "CARLOS",
          email: "test@test.com",
        },
        {
          nome: "Carlos Almeida",
          login: "CARLOS2",
          email: "test@test.com",
        },
      ]);
      const resposta = await request(app)
        .get("/api/users")
        .set("Authorization", "Bearer fakeToken");
      expect(resposta.status).to.equal(200);
      expect(resposta.body).to.deep.equal([
        {
          nome: "Carlos Almeida",
          login: "CARLOS",
          email: "test@test.com",
        },
        {
          nome: "Carlos Almeida",
          login: "CARLOS2",
          email: "test@test.com",
        },
      ]);
      sinon.restore();
    });
  });

  describe("POST /login", () => {
    it("Quando informo dados válidos, devo receber a resposta 200", async () => {
      const userServiceMock = sinon.stub(userService, "authenticateUser");
      userServiceMock.returns({ token: "tokenMockado" });

      const resposta = await request(app).post("/api/login").send({
        login: "CARLOS_ALMEIDA",
        senha: "123",
      });

      expect(resposta.status).to.equal(200);
      expect(resposta.body).to.have.property("token", "tokenMockado");
      sinon.restore();
    });

    it("Quando informo dados inexistentes, devo receber a resposta 401", async () => {
      const userServiceMock = sinon.stub(userService, "authenticateUser");
      userServiceMock.returns({ error: "Usuário ou senha inválidos." });

      const resposta = await request(app).post("/api/login").send({
        login: "CARLOS_ALMEIDA",
        senha: "123",
      });

      expect(resposta.status).to.equal(401);
      expect(resposta.body).to.have.property(
        "erro",
        "Usuário ou senha inválidos."
      );

      sinon.restore();
    });
  });
});
