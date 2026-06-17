import request from "supertest";
import app from "../src/app.js";
import Book from "../src/models/BookSchema.js";

const PASSWORD = "password123";

const users = {
  admin: {
    name: "Admin User",
    email: "admin@test.com",
    password: PASSWORD,
    role: "admin",
  },
  librarian: {
    name: "Librarian User",
    email: "librarian@test.com",
    password: PASSWORD,
    role: "librarian",
  },
  member: {
    name: "Member User",
    email: "member@test.com",
    password: PASSWORD,
    role: "member",
  },
};

const bookPayload = {
  title: "The Great Test",
  author: "Jane Author",
  category: "Fiction",
  isbn: "9781234567890",
  description: "A book for integration tests",
  totalCopies: 3,
  availableCopies: 3,
};

async function register(user) {
  return request(app).post("/api/auth/register").send(user);
}

async function login(email) {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email, password: PASSWORD });

  return res.body.token;
}

describe("Authentication", () => {
  test("Register - creates a new user", async () => {
    const res = await register(users.member);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User created successfully");
  });

  test("Login - returns a token for valid credentials", async () => {
    await register(users.admin);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: users.admin.email, password: PASSWORD });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.token).toBeDefined();
  });
});

describe("Books", () => {
  let librarianToken;
  let adminToken;
  let bookId;

  beforeEach(async () => {
    await register(users.librarian);
    await register(users.admin);

    librarianToken = await login(users.librarian.email);
    adminToken = await login(users.admin.email);
  });

  test("Create - adds a new book", async () => {
    const res = await request(app)
      .post("/api/books")
      .set("Authorization", librarianToken)
      .send(bookPayload);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("book added successfully");

    const book = await Book.findOne({ isbn: bookPayload.isbn });
    expect(book).not.toBeNull();
    bookId = book._id;
  });

  test("Update - modifies an existing book", async () => {
    await request(app)
      .post("/api/books")
      .set("Authorization", librarianToken)
      .send(bookPayload);

    const book = await Book.findOne({ isbn: bookPayload.isbn });

    const res = await request(app)
      .put(`/api/books/${book._id}`)
      .set("Authorization", librarianToken)
      .send({ title: "Updated Title" });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Title");
  });

  test("Delete - soft deletes a book", async () => {
    await request(app)
      .post("/api/books")
      .set("Authorization", librarianToken)
      .send(bookPayload);

    const book = await Book.findOne({ isbn: bookPayload.isbn });

    const res = await request(app)
      .patch(`/api/books/${book._id}`)
      .set("Authorization", adminToken);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isDeleted).toBe(true);
  });
});

describe("Borrowing", () => {
  let memberToken;

  beforeEach(async () => {
    await register(users.librarian);
    await register(users.member);

    const librarianToken = await login(users.librarian.email);
    memberToken = await login(users.member.email);

    await request(app)
      .post("/api/books")
      .set("Authorization", librarianToken)
      .send(bookPayload);
  });

  test("Borrow Book - member can borrow an available book", async () => {
    const res = await request(app)
      .post("/api/borrow")
      .set("Authorization", memberToken)
      .send({ isbn: bookPayload.isbn });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Borrow successful");
    expect(res.body.borrow.status).toBe("borrowed");
  });

  test("Return Book - member can return a borrowed book", async () => {
    await request(app)
      .post("/api/borrow")
      .set("Authorization", memberToken)
      .send({ isbn: bookPayload.isbn });

    const res = await request(app)
      .patch("/api/return")
      .set("Authorization", memberToken)
      .send({ isbn: bookPayload.isbn });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Return successful");
    expect(res.body.data.status).toBe("returned");
    expect(res.body.data.returnDate).toBeDefined();
  });
});
