const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const app = require("../server");
const User = require("../models/User");
const Note = require("../models/Note");

chai.use(chaiHttp);
const { expect } = chai;

let token;
let noteId;

describe("Notes API", () => {
  before(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/test_notes", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await User.deleteMany();
    await Note.deleteMany();

    // Create user and login to get token
    await chai.request(app).post("/api/auth/signup").send({
      name: "Note Tester",
      email: "note@example.com",
      password: "Test@1234",
    });

    const res = await chai.request(app).post("/api/auth/login").send({
      email: "note@example.com",
      password: "Test@1234",
    });

    token = res.body.token;
  });

  after(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it("should create a new note", (done) => {
    chai
      .request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Note", content: "This is a test note" })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("_id");
        expect(res.body.title).to.equal("Test Note");
        noteId = res.body._id;
        done();
      });
  });

  it("should fetch all notes for the user", (done) => {
    chai
      .request(app)
      .get("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        expect(res.body.length).to.be.greaterThan(0);
        done();
      });
  });

  it("should update the note", (done) => {
    chai
      .request(app)
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
      .request(app)
      .delete(`/api/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Note deleted");
        done();
      });
  });

  it("should fail to create a note without token", (done) => {
    chai
      .request(app)
      .post("/api/notes")
      .send({ title: "No Auth", content: "Should fail" })
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
});
