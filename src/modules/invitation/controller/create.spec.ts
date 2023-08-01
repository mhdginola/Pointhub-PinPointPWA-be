import { faker } from "@faker-js/faker";
import request from "supertest";
import UserFactory from "../../user/model/user.factory.js";
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
    email: ["The email field is required."],
    group: ["The group field is required."],
  },
  message: "The request was well-formed but was unable to be followed due to semantic errors.",
  status: "Unprocessable Entity",
};

describe("create an invitation", () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  it("1.1 create invitation failed because invitation is not login yet", async () => {
    const app = await createApp();

    const data = {
      email: faker.internet.email(),
      group: faker.name.jobTitle(),
    };

    const response = await request(app).post("/v1/invitations").send(data);
    // check status code
    expect(response.statusCode).toEqual(401);
    // check response body
    expect(response.body).toEqual(error401);
    // check database
  });
  it("1.2 create invitation failed, dont have permission", async () => {
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

    const data = {
      email: faker.internet.email(),
      group: faker.name.jobTitle(),
    };

    const response = await request(app)
      .post("/v1/invitations")
      .set("Authorization", `Bearer ${responseLogin.body.accessToken}`)
      .send(data);
    // check status code
    expect(response.statusCode).toEqual(403);
    // check response body
    expect(response.body).toEqual(error403);
    // check response database
  });
  it("1.3 create invitation failed, column required", async () => {
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
      .post("/v1/invitations")
      .set("Authorization", `Bearer ${responseLogin.body.accessToken}`)
      .send(data);
    // check status code
    expect(response.statusCode).toEqual(422);
    // check response body
    expect(response.body).toEqual(error422RequiredField);
    // check database
  });
  it("1.4 create invitation success", async () => {
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

    const data = {
      email: faker.internet.email(),
      group: faker.name.jobTitle(),
    };

    const response = await request(app)
      .post("/v1/invitations")
      .set("Authorization", `Bearer ${responseLogin.body.accessToken}`)
      .send(data);
    // check status code
    expect(response.statusCode).toEqual(201);
    // check response body
    expect(response.body._id).not.toBeUndefined();
    // check database
    const userRecord = await retrieve("invitations", response.body._id);
    expect(userRecord._id).toStrictEqual(response.body._id);
    expect(userRecord.group).toStrictEqual(data.group);
    expect(userRecord.email).toStrictEqual(data.email);
  });
});
