import { faker } from "@faker-js/faker";
import request from "supertest";
import UserFactory from "../../user/model/user.factory.js";
import TagLocationFactory from "../model/tagLocation.factory.js";
import { createApp } from "@src/app.js";
import { issuer, secretKey } from "@src/config/auth.js";
import { resetDatabase, retrieveAll } from "@src/test/utils.js";
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

describe("retrieve all tagLocation", () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  it("1.1 retrieve all tagLocation failed because user is not login yet", async () => {
    const app = await createApp();

    const tagLocationFactory = new TagLocationFactory();
    await tagLocationFactory.createMany(3);

    const response = await request(app).get("/v1/tagLocations");
    // check status code
    expect(response.statusCode).toEqual(401);
    // check response body
    expect(response.body).toEqual(error401);
    // check database
  });
  it("1.2 retrieve all tagLocation failed, dont have permission", async () => {
    const app = await createApp();

    const userFactory = new UserFactory();
    const userSeed = [
      {
        id: faker.datatype.uuid(),
        username: "employee",
        role: "",
      },
    ];
    userFactory.sequence(userSeed);
    await userFactory.createMany(1);

    const accessToken = signNewToken(issuer, secretKey, userSeed[0].id);
    const responseLogin = { body: { accessToken: accessToken } };

    const tagLocationFactory = new TagLocationFactory();
    await tagLocationFactory.createMany(3);

    const response = await request(app)
      .get("/v1/tagLocations")
      .set("Authorization", `Bearer ${responseLogin.body.accessToken}`);
    // check status code
    expect(response.statusCode).toEqual(403);
    // check response body
    expect(response.body).toEqual(error403);
    // check response database
  });
  it("1.3 retrieve all tagLocation radius 100m success, check not in radius", async () => {
    const app = await createApp();

    const userFactory = new UserFactory();
    const userSeed = [
      {
        id: faker.datatype.uuid(),
        username: "employee",
        role: "employee",
      },
    ];
    userFactory.sequence(userSeed);
    await userFactory.createMany(1);

    const accessToken = signNewToken(issuer, secretKey, userSeed[0].id);
    const responseLogin = { body: { accessToken: accessToken } };

    // Fungsi bantu untuk mengonversi sudut dalam derajat menjadi radian
    function toRadians(degrees: number) {
      return degrees * (Math.PI / 180);
    }

    function validateCoordinates(
      latitude1: number,
      longitude1: number,
      latitude2: number,
      longitude2: number,
      radius: number
    ) {
      // Konversi ke radian
      const lat1Rad = toRadians(latitude1);
      const lon1Rad = toRadians(longitude1);
      const lat2Rad = toRadians(latitude2);
      const lon2Rad = toRadians(longitude2);

      // Menghitung jarak antara dua titik menggunakan formula haversine
      const dLat = lat2Rad - lat1Rad;
      const dLon = lon2Rad - lon1Rad;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = radius * c;

      // Mengembalikan true jika jarak kurang dari atau sama dengan radius, false jika tidak
      return distance <= radius;
    }

    const longitude = parseInt(faker.address.longitude());
    const latitude = parseInt(faker.address.latitude());

    const tagLocationFactory = new TagLocationFactory();
    const tagLocationsSeed = [
      {
        name: faker.name.firstName(),
        longitude: longitude,
        latitude: latitude,
      },
      {
        name: faker.name.firstName(),
        longitude: longitude,
        latitude: latitude,
      },
      {
        name: faker.name.firstName(),
        longitude: longitude + 200,
        latitude: latitude + 200,
      },
    ];
    userFactory.sequence(tagLocationsSeed);
    await tagLocationFactory.createMany(3);

    const response = await request(app)
      .get(`/v1/tagLocations?longitude=${longitude}&latitude=${latitude}`)
      .set("Authorization", `Bearer ${responseLogin.body.accessToken}`);
    // check status code
    expect(response.statusCode).toEqual(200);
    // check response body
    const tagLocationRecord = await retrieveAll("tagLocations");
    expect(response.body.tagLocations.length).toStrictEqual(2);
    expect(tagLocationRecord[0]._id).toStrictEqual(response.body.tagLocations[0]._id);
    expect(tagLocationRecord[0].name).toStrictEqual(response.body.tagLocations[0].name);
    expect(
      validateCoordinates(
        latitude,
        longitude,
        response.body.tagLocations[0].latitude,
        response.body.tagLocations[0].longitude,
        100
      )
    ).toStrictEqual(true);
    expect(tagLocationRecord[2]._id).toStrictEqual(response.body.tagLocations[1]._id);
    expect(tagLocationRecord[2].name).toStrictEqual(response.body.tagLocations[1].name);
    expect(
      validateCoordinates(
        latitude,
        longitude,
        response.body.tagLocations[2].latitude,
        response.body.tagLocations[2].longitude,
        100
      )
    ).toStrictEqual(true);
    // check database
  });
});
