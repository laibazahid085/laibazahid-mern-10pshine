const chai = require("chai");
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../server");
const User = require("../models/User");

chai.use(chaiHttp);
const { expect } = chai;

let validToken;

describe("Auth Middleware", () => {
  before(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/test_middleware", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await User.deleteMany();

    const user = new User({
      name: "Middleware Tester",
      email: "middleware@example.com",
      password: "hashedpassword", // No need to actually hash since we won't log in
    });

    await user.save();

    validToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
  });

  after(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it("should deny access when no token is provided", (done) => {
    chai
      .request(app)
      .get("/api/notes") // Any protected route
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.message).to.include("No token");
        done();
      });
  });

  it("should deny access with invalid token", (done) => {
    chai
      .request(app)
      .get("/api/notes")
      .set("Authorization", "Bearer invalidtoken")
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.message).to.include("Invalid or expired token");
        done();
      });
  });

  it("should allow access with valid token", (done) => {
    chai
      .request(app)
      .get("/api/notes")
      .set("Authorization", `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });
});
