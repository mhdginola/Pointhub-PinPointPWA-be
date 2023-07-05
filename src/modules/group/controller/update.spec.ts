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

describe("update an group", () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  it("1.1 update group failed because user is not login yet", async () => {
    const app = await createApp();

    const data = {
      name: faker.name.fullName(),
    };

    const groupFactory = new GroupFactory();
    const resultFactory = await groupFactory.createMany(3);

    const response = await request(app).patch(`/v1/groups/${resultFactory.insertedIds[1]}`).send(data);
    // check status code
    expect(response.statusCode).toEqual(401);
    // check response body
    expect(response.body).toEqual(error401);
    // check database
  });
  it("1.2 update group failed, dont have permission", async () => {
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

    const groupFactory = new GroupFactory();
    const resultFactory = await groupFactory.createMany(3);

    const response = await request(app)
      .patch(`/v1/groups/${resultFactory.insertedIds[1]}`)
      .set("Authorization", `Bearer ${responseLogin.body.accessToken}`)
      .send(data);
    // check status code
    expect(response.statusCode).toEqual(403);
    // check response body
    expect(response.body).toEqual(error403);
    // check response database
  });
  it("1.3 update group failed, unique group by name", async () => {
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

    const groupFactory = new GroupFactory();
    const groupSeed = [
      {
        name: "name 1",
      },
      {
        name: "name 2",
      },
      {
        name: "name 3",
      },
    ];
    groupFactory.sequence(groupSeed);
    const resultFactory = await groupFactory.createMany(3);

    const data = { name: "name 3" };

    const response = await request(app)
      .patch(`/v1/groups/${resultFactory.insertedIds[1]}`)
      .set("Authorization", `Bearer ${responseLogin.body.accessToken}`)
      .send(data);
    // check status code
    expect(response.statusCode).toEqual(422);
    // check response body
    expect(response.body).toEqual(error422UniqueName);
    // check database
  });
  it("1.4 update group failed, column required", async () => {
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

    const groupFactory = new GroupFactory();
    const resultFactory = await groupFactory.createMany(3);

    const response = await request(app)
      .patch(`/v1/groups/${resultFactory.insertedIds[1]}`)
      .set("Authorization", `Bearer ${responseLogin.body.accessToken}`)
      .send(data);
    // check status code
    expect(response.statusCode).toEqual(422);
    // check response body
    expect(response.body).toEqual(error422RequiredField);
    // check database
  });
  it("1.5 update group success", async () => {
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

    const groupFactory = new GroupFactory();
    const resultFactory = await groupFactory.createMany(3);

    const response = await request(app)
      .patch(`/v1/groups/${resultFactory.insertedIds[1]}`)
      .set("Authorization", `Bearer ${responseLogin.body.accessToken}`)
      .send(data);
    // check status code
    expect(response.statusCode).toEqual(204);
    // check response body
    expect(response.body).toStrictEqual({});
    // check database
    const groupRecord = await retrieve("groups", resultFactory.insertedIds[1]);
    expect(groupRecord.name).toStrictEqual(data.name);
  });
});
