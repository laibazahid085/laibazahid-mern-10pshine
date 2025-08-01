const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const server = require("../server"); // make sure server.js exports `app`
const User = require("../models/User");

chai.use(chaiHttp);
const { expect } = chai;

let token;

describe("User Authentication", () => {
  before(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/test_users");
  });

  after(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it("should sign up a new user", (done) => {
    chai
      .request(server)
      .post("/api/users/signup")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "123456",
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("token");
        done();
      });
  });

  it("should log in the user", (done) => {
    chai
      .request(server)
      .post("/api/users/login")
      .send({
        email: "test@example.com",
        password: "123456",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("token");
        token = res.body.token;
        done();
      });
  });

  it("should get the user profile", (done) => {
    chai
      .request(server)
      .get("/api/users/profile")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.user).to.have.property("email", "test@example.com");
        done();
      });
  });
});
