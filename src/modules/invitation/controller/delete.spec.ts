import { faker } from "@faker-js/faker";
import request from "supertest";
import UserFactory from "../../user/model/user.factory.js";
import InvitationFactory from "../model/invitation.factory.js";
import { createApp } from "@src/app.js";
import { issuer, secretKey } from "@src/config/auth.js";
import { resetDatabase, retrieve, retrieveAll } from "@src/test/utils.js";
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

describe("delete an invitation", () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  it("1.1 delete invitation failed because user is not login yet", async () => {
    const app = await createApp();

    const invitationFactory = new InvitationFactory();
    const resultFactory = await invitationFactory.createMany(3);

    const response = await request(app).delete(`/v1/invitations/${resultFactory.insertedIds[1]}`);
    // check status code
    expect(response.statusCode).toEqual(401);
    // check response body
    expect(response.body).toEqual(error401);
    // check database
  });
  it("1.2 delete invitation failed, dont have permission", async () => {
    const app = await createApp();

    const userFactory = new UserFactory();
    const userSeed = [
      {
        id: faker.datatype.uuid(),
        username: "admin",
        role: "",
      },
    ];
    userFactory.sequence(userSeed);
    await userFactory.createMany(1);

    const accessToken = signNewToken(issuer, secretKey, userSeed[0].id);
    const responseLogin = { body: { accessToken: accessToken } };

    const invitationFactory = new InvitationFactory();
    const resultFactory = await invitationFactory.createMany(3);

    const response = await request(app)
      .delete(`/v1/invitations/${resultFactory.insertedIds[1]}`)
      .set("Authorization", `Bearer ${responseLogin.body.accessToken}`);
    // check status code
    expect(response.statusCode).toEqual(403);
    // check response body
    expect(response.body).toEqual(error403);
    // check response database
  });
  it("1.3 delete user success", async () => {
    const app = await createApp();

    const userFactory = new UserFactory();
    const userSeed = [
      {
        id: faker.datatype.uuid(),
        username: "admin",
        role: "admin",
      },
    ];
    userFactory.sequence(userSeed);
    await userFactory.createMany(1);

    const accessToken = signNewToken(issuer, secretKey, userSeed[0].id);
    const responseLogin = { body: { accessToken: accessToken } };

    const invitationFactory = new InvitationFactory();
    const resultFactory = await invitationFactory.createMany(3);

    const response = await request(app)
      .delete(`/v1/users/${resultFactory.insertedIds[1]}`)
      .set("Authorization", `Bearer ${responseLogin.body.accessToken}`);
    // check status code
    expect(response.statusCode).toEqual(204);
    // check response body
    expect(response.body).toStrictEqual({});
    // check database
    const userRecord = await retrieve("invitations", resultFactory.insertedIds[1]);
    expect(userRecord).toBeNull();

    const userRecords = await retrieveAll("invitations");
    expect(userRecords.length).toStrictEqual(2);
  });
});
