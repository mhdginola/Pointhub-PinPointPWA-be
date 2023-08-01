import { faker } from "@faker-js/faker";
import request from "supertest";
import UserFactory from "../../user/model/user.factory.js";
import InvitationFactory from "../model/invitation.factory.js";
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
    accept: ["The accept field is required."],
  },
  message: "The request was well-formed but was unable to be followed due to semantic errors.",
  status: "Unprocessable Entity",
};

describe("accept an invitation", () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  it("1.1 accept invitation failed because user is not login yet", async () => {
    const app = await createApp();

    const data = { accept: true };

    const invitationFactory = new InvitationFactory();
    const resultFactory = await invitationFactory.createMany(3);

    const response = await request(app).patch(`/v1/invitations/${resultFactory.insertedIds[1]}`).send(data);
    // check status code
    expect(response.statusCode).toEqual(401);
    // check response body
    expect(response.body).toEqual(error401);
    // check database
  });
  it("1.2 accept invitation failed, dont have permission", async () => {
    const app = await createApp();

    const userFactory = new UserFactory();
    const userSeed = [
      {
        _id: faker.database.mongodbObjectId(),
        username: "employee",
        role: "",
      },
    ];
    userFactory.sequence(userSeed);
    await userFactory.createMany(1);

    const accessToken = signNewToken(issuer, secretKey, userSeed[0]._id);
    const responseLogin = { body: { accessToken: accessToken } };

    const data = { accept: true };

    const invitationFactory = new InvitationFactory();
    const resultFactory = await invitationFactory.createMany(3);

    const response = await request(app)
      .patch(`/v1/invitations/${resultFactory.insertedIds[1]}`)
      .set("Authorization", `Bearer ${responseLogin.body.accessToken}`)
      .send(data);
    // check status code
    expect(response.statusCode).toEqual(403);
    // check response body
    expect(response.body).toEqual(error403);
    // check response database
  });
  it("1.3 accept invitation failed, column required", async () => {
    const app = await createApp();

    const userFactory = new UserFactory();
    const userSeed = [
      {
        _id: faker.database.mongodbObjectId(),
        username: "employee",
        role: "employee",
      },
    ];
    userFactory.sequence(userSeed);
    await userFactory.createMany(1);

    const accessToken = signNewToken(issuer, secretKey, userSeed[0]._id);
    const responseLogin = { body: { accessToken: accessToken } };

    const data = {};

    const invitationFactory = new InvitationFactory();
    const resultFactory = await invitationFactory.createMany(3);

    const response = await request(app)
      .patch(`/v1/invitations/${resultFactory.insertedIds[1]}`)
      .set("Authorization", `Bearer ${responseLogin.body.accessToken}`)
      .send(data);
    // check status code
    expect(response.statusCode).toEqual(422);
    // check response body
    expect(response.body).toEqual(error422RequiredField);
    // check database
  });
  it("1.4 accept invitation success", async () => {
    const app = await createApp();

    const userFactory = new UserFactory();
    const userSeed = [
      {
        _id: faker.database.mongodbObjectId(),
        username: "employee",
        role: "employee",
      },
    ];
    userFactory.sequence(userSeed);
    await userFactory.createMany(1);

    const accessToken = signNewToken(issuer, secretKey, userSeed[0]._id);
    const responseLogin = { body: { accessToken: accessToken } };

    const data = { accept: true };

    const invitationFactory = new InvitationFactory();
    const resultFactory = await invitationFactory.createMany(3);

    const response = await request(app)
      .patch(`/v1/invitations/${resultFactory.insertedIds[1]}`)
      .set("Authorization", `Bearer ${responseLogin.body.accessToken}`)
      .send(data);
    // check status code
    expect(response.statusCode).toEqual(204);
    // check response body
    expect(response.body).toStrictEqual({});
    // check database
    const invitationRecord = await retrieve("invitations", resultFactory.insertedIds[1]);
    expect(invitationRecord.accept).toStrictEqual(data.accept);
  });
  it("1.5 reject invitation success", async () => {
    const app = await createApp();

    const userFactory = new UserFactory();
    const userSeed = [
      {
        _id: faker.database.mongodbObjectId(),
        username: "employee",
        role: "employee",
      },
    ];
    userFactory.sequence(userSeed);
    await userFactory.createMany(1);

    const accessToken = signNewToken(issuer, secretKey, userSeed[0]._id);
    const responseLogin = { body: { accessToken: accessToken } };

    const data = { accept: false };

    const invitationFactory = new InvitationFactory();
    const resultFactory = await invitationFactory.createMany(3);

    const response = await request(app)
      .patch(`/v1/invitations/${resultFactory.insertedIds[1]}`)
      .set("Authorization", `Bearer ${responseLogin.body.accessToken}`)
      .send(data);
    // check status code
    expect(response.statusCode).toEqual(204);
    // check response body
    expect(response.body).toStrictEqual({});
    // check database
    const invitationRecord = await retrieve("invitations", resultFactory.insertedIds[1]);
    expect(invitationRecord.accept).toStrictEqual(data.accept);
  });
});
