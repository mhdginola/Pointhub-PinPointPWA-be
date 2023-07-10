import { faker } from "@faker-js/faker";
import request from "supertest";
import UserFactory from "../../user/model/user.factory.js";
import TagLocationFactory from "../model/tagLocation.factory.js";
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

describe("delete an tagLocation", () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  it("1.1 delete tagLocation failed because user is not login yet", async () => {
    const app = await createApp();

    const tagLocationFactory = new TagLocationFactory();
    const resultFactory = await tagLocationFactory.createMany(3);

    const response = await request(app).delete(`/v1/tagLocations/${resultFactory.insertedIds[1]}`);
    // check status code
    expect(response.statusCode).toEqual(401);
    // check response body
    expect(response.body).toEqual(error401);
    // check database
  });
  it("1.2 delete tagLocation failed, dont have permission", async () => {
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

    const tagLocationFactory = new TagLocationFactory();
    const resultFactory = await tagLocationFactory.createMany(3);

    const response = await request(app)
      .delete(`/v1/tagLocations/${resultFactory.insertedIds[1]}`)
      .set("Authorization", `Bearer ${responseLogin.body.accessToken}`);
    // check status code
    expect(response.statusCode).toEqual(403);
    // check response body
    expect(response.body).toEqual(error403);
    // check response database
  });
  it("1.3 delete tagLocation success", async () => {
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

    const tagLocationFactory = new TagLocationFactory();
    const resultFactory = await tagLocationFactory.createMany(3);

    const response = await request(app)
      .delete(`/v1/tagLocations/${resultFactory.insertedIds[1]}`)
      .set("Authorization", `Bearer ${responseLogin.body.accessToken}`);
    // check status code
    expect(response.statusCode).toEqual(204);
    // check response body
    expect(response.body).toStrictEqual({});
    // check database
    const tagLocationRecord = await retrieve("tagLocations", resultFactory.insertedIds[1]);
    expect(tagLocationRecord).toBeNull();

    const tagLocationRecords = await retrieveAll("tagLocations");
    expect(tagLocationRecords.length).toStrictEqual(2);
  });
});
