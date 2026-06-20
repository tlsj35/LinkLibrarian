const request = require("supertest");

const API = "http://localhost:5000";

describe("API Integration Tests", () => {
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = "password123";
  let token;

  test("GET /api/status returns backend status", async () => {
    const res = await request(API).get("/api/status");

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("LinkLibrarian Backend Running");
  });

  test("POST /api/register creates a user", async () => {
    const res = await request(API)
      .post("/api/register")
      .send({
        email: testEmail,
        password: testPassword,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User registered successfully");
  });

  test("POST /api/login logs in registered user", async () => {
    const res = await request(API)
      .post("/api/login")
      .send({
        email: testEmail,
        password: testPassword,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.token).toBeDefined();

    token = res.body.token;
  });

  test("GET /api/users works with valid token", async () => {
    const res = await request(API)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});