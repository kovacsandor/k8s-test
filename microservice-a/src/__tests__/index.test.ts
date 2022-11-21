import { agent } from "supertest";
import { describe, expect, test } from "@jest/globals";
import { app } from "../app";
import { TestObject } from "../testObjectModel";

describe("test objects", () => {

  test("user can create test object", async () => {
    const response: { body: TestObject } = await agent(app)
      .post("/microservice-a/add-test-object-to-database/testname")
      .expect(201);

    expect(response.body.name).toBe("testname");
  });

  test("user can get test objects", async () => {
    await agent(app)
      .post("/microservice-a/add-test-object-to-database/testname")
      .expect(201);
    const response: { body: TestObject[] } = await agent(app)
      .get("/microservice-a/test-objects-from-database")
      .expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe("testname");
  });
});
