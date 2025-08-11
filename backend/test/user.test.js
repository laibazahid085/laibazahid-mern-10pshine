const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const app = require("../server");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

chai.use(chaiHttp);
const { expect } = chai;

let token;

describe("User Controller", () => {
  before(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/test_user", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await User.deleteMany();
  });

  after(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it("should signup a new user", (done) => {
    chai
      .request(app)
      .post("/api/auth/signup")
      .send({
        name: "Test User",
        email: "testuser@example.com",
        password: "Test@1234",
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("token");
        expect(res.body.user.name).to.equal("Test User");
        token = res.body.token;
        done();
      });
  });

  it("should not signup an existing user", (done) => {
    chai
      .request(app)
      .post("/api/auth/signup")
      .send({
        name: "Test User",
        email: "testuser@example.com",
        password: "Test@1234",
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal("User already exists.");
        done();
      });
  });

  it("should login the user", (done) => {
    chai
      .request(app)
      .post("/api/auth/login")
      .send({
        email: "testuser@example.com",
        password: "Test@1234",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("token");
        expect(res.body.user.email).to.equal("testuser@example.com");
        token = res.body.token;
        done();
      });
  });

  it("should not login with wrong password", (done) => {
    chai
      .request(app)
      .post("/api/auth/login")
      .send({
        email: "testuser@example.com",
        password: "WrongPass123",
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal("Invalid credentials.");
        done();
      });
  });

  it("should get the profile of logged in user", (done) => {
    chai
      .request(app)
      .get("/api/auth/profile")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.email).to.equal("testuser@example.com");
        done();
      });
  });

  it("should return 404 if user profile not found", async () => {
    const fakeToken = jwt.sign({ id: "000000000000000000000000" }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const res = await chai
      .request(app)
      .get("/api/auth/profile")
      .set("Authorization", `Bearer ${fakeToken}`);

    expect(res).to.have.status(404);
    expect(res.body.message).to.equal("User not found.");
  });
});
