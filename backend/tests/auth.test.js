const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const app = require("../server"); // Make sure your server.js exports app
const User = require("../models/User");

chai.use(chaiHttp);
const { expect } = chai;

let token;

describe("Authentication API", () => {
  before(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/test_auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it("should fail signup with weak password", (done) => {
    chai
      .request(app)
      .post("/api/auth/signup")
      .send({
        name: "Weak User",
        email: "weak@example.com",
        password: "1234",
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.include("Password must be at least 8 characters");
        done();
      });
  });

  it("should signup successfully", (done) => {
    chai
      .request(app)
      .post("/api/auth/signup")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "Test@1234",
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("token");
        expect(res.body.user.email).to.equal("test@example.com");
        done();
      });
  });

  it("should login successfully", (done) => {
    chai
      .request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "Test@1234",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("token");
        token = res.body.token;
        done();
      });
  });

  it("should fail login with wrong password", (done) => {
    chai
      .request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "wrongpass",
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal("Invalid credentials.");
        done();
      });
  });

  it("should protect route using middleware", (done) => {
    chai
      .request(app)
      .get("/api/users/profile") // This assumes a protected route exists
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.user.email).to.equal("test@example.com");
        done();
      });
  });
});
