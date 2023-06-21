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

describe("retrieve an group", () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  it("1.1 retrieve group failed because user is not login yet", async () => {
    const app = await createApp();

    const groupFactory = new GroupFactory();
    const resultFactory = await groupFactory.createMany(3);

    const response = await request(app).get(`/v1/groups/${resultFactory.insertedIds[1]}`);
    // check status code
    expect(response.statusCode).toEqual(401);
    // check response body
    expect(response.body).toEqual(error401);
    // check database
  });
  it("1.2 retrieve group failed, dont have permission", async () => {
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

    const groupFactory = new GroupFactory();
    const resultFactory = await groupFactory.createMany(3);

    const response = await request(app)
      .get(`/v1/groups/${resultFactory.insertedIds[1]}`)
      .set("Authorization", `Bearer ${responseLogin.body.accessToken}`);
    // check status code
    expect(response.statusCode).toEqual(403);
    // check response body
    expect(response.body).toEqual(error403);
    // check response database
  });
  it("1.3 retrieve group success", async () => {
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

    const groupFactory = new GroupFactory();
    const resultFactory = await groupFactory.createMany(3);

    const response = await request(app)
      .get(`/v1/groups/${resultFactory.insertedIds[1]}`)
      .set("Authorization", `Bearer ${responseLogin.body.accessToken}`);
    // check status code
    expect(response.statusCode).toEqual(200);
    // check response body
    const groupRecord = await retrieve("coas", resultFactory.insertedIds[1]);
    expect(response.body._id).toBeDefined();
    expect(response.body.name).toStrictEqual(groupRecord.name);
    // check database
  });
});
