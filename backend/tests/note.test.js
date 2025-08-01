const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server"); // Make sure server.js exports the app
const mongoose = require("mongoose");
const Note = require("../models/Note");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

chai.use(chaiHttp);
const { expect } = chai;

let token;
let noteId;

describe("Notes API", () => {
  before(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/test_notes");

    // Create a user
    const user = new User({
      name: "Test User",
      email: "test@example.com",
      password: "123456",
    });
    await user.save();

    // Generate token
    token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1h",
    });
  });

  after(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it("should create a new note", (done) => {
    chai
      .request(server)
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Note", content: "Some content" })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("_id");
        noteId = res.body._id;
        done();
      });
  });

  it("should fetch all notes", (done) => {
    chai
      .request(server)
      .get("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  it("should update the note", (done) => {
    chai
      .request(server)
      .put(`/api/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Title", content: "Updated content" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.title).to.equal("Updated Title");
        done();
      });
  });

  it("should delete the note", (done) => {
    chai
      .request(server)
      .delete(`/api/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Note deleted");
        done();
      });
  });
});
