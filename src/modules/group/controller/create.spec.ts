import { faker } from "@faker-js/faker";
import request from "supertest";
import UserFactory from "../../user/model/user.factory.js";
import GroupFactory from "../model/group.factory.js";
import { createApp } from "@src/app.js";
import { issuer, secretKey } from "@src/config/auth.js";
import { resetDatabase, retrieve } from "@src/test/utils.js";
import { signNewToken } from "@src/utils/jwt.js";

// error message
const error401 = {
  code: 401,
  message: "Authentication credentials is invalid.",
  status: "Unauthorized",
};

const error403 = {
  code: 403,
  message: "Don't have necessary permissions for this resource.",
  status: "Forbidden",
};

const error422RequiredField = {
  code: 422,
  errors: {
    name: ["The name field is required."],
  },
  message: "The request was well-formed but was unable to be followed due to semantic errors.",
  status: "Unprocessable Entity",
};

const error422UniqueName = {
  code: 422,
  errors: { name: ["name must be unique"] },
  message: "The request was well-formed but was unable to be followed due to semantic errors.",
  status: "Unprocessable Entity",
};

describe("create an group", () => {
  beforeEach(async () => {
    //refresh database
    await resetDatabase();
  });
  it("1.1 create group failed because user is not login yet", async () => {
    const app = await createApp();

    const data = {
      name: faker.name.fullName(),
    };

    const response = await request(app).post("/v1/groups").send(data);
    // check status code
    expect(response.statusCode).toEqual(401);
    // check response body
    expect(response.body).toEqual(error401);
    // check database
  });
  it("1.2 create group failed, dont have permission", async () => {
    const app = await createApp();

    const userFactory = new UserFactory();
    const userSeed = [
      {
        _id: faker.database.mongodbObjectId(),
        username: "admin",
        role: "",
      },
    ];
    userFactory.sequence(userSeed);
    await userFactory.createMany(1);

    const accessToken = signNewToken(issuer, secretKey, userSeed[0]._id);
    const responseLogin = { body: { accessToken: accessToken } };

    const data = { name: faker.name.fullName() };

    const response = await request(app)
      .post("/v1/groups")
      .set("Authorization", `Bearer ${responseLogin.body.accessToken}`)
      .send(data);
    // check status code
    expect(response.statusCode).toEqual(403);
    // check response body
    expect(response.body).toEqual(error403);
    // check response database
  });
  it("1.3 create group failed, column required", async () => {
    const app = await createApp();

    const userFactory = new UserFactory();
    const userSeed = [
      {
        _id: faker.database.mongodbObjectId(),
        username: "admin",
        role: "admin",
      },
    ];
    userFactory.sequence(userSeed);
    await userFactory.createMany(1);

    const accessToken = signNewToken(issuer, secretKey, userSeed[0]._id);
    const responseLogin = { body: { accessToken: accessToken } };

    const data = {};

    const response = await request(app)
      .post("/v1/groups")
      .set("Authorization", `Bearer ${responseLogin.body.accessToken}`)
      .send(data);
    // check status code
    expect(response.statusCode).toEqual(422);
    // check response body
    expect(response.body).toEqual(error422RequiredField);
    // check database
  });
  it("1.4 create group failed, unique group by name", async () => {
    const app = await createApp();

    const userFactory = new UserFactory();
    const userSeed = [
      {
        _id: faker.database.mongodbObjectId(),
        password: "admin123",
        role: "admin",
      },
    ];
    userFactory.sequence(userSeed);
    await userFactory.createMany(1);

    const accessToken = signNewToken(issuer, secretKey, userSeed[0]._id);
    const responseLogin = { body: { accessToken: accessToken } };

    const groupFactory = new GroupFactory();
    const groupSeed = [
      {
        name: "unique",
      },
    ];
    groupFactory.sequence(groupSeed);
    await groupFactory.createMany(1);

    const data = { name: "unique" };

    const response = await request(app)
      .post("/v1/groups")
      .set("Authorization", `Bearer ${responseLogin.body.accessToken}`)
      .send(data);
    // check status code
    expect(response.statusCode).toEqual(422);
    // check response body
    expect(response.body).toEqual(error422UniqueName);
    // check database
  });
  it("1.5 create group success", async () => {
    const app = await createApp();

    const userFactory = new UserFactory();
    const userSeed = [
      {
        _id: faker.database.mongodbObjectId(),
        username: "admin",
        role: "admin",
      },
    ];
    userFactory.sequence(userSeed);
    await userFactory.createMany(1);

    const accessToken = signNewToken(issuer, secretKey, userSeed[0]._id);
    const responseLogin = { body: { accessToken: accessToken } };

    const data = { name: faker.name.fullName() };

    const response = await request(app)
      .post("/v1/groups")
      .set("Authorization", `Bearer ${responseLogin.body.accessToken}`)
      .send(data);
    // check status code
    expect(response.statusCode).toEqual(201);
    // check response body
    expect(response.body._id).not.toBeUndefined();
    // check database
    const groupRecord = await retrieve("groups", response.body._id);
    expect(groupRecord._id).toStrictEqual(response.body._id);
    expect(groupRecord.name).toStrictEqual(data.name);
  });
});
