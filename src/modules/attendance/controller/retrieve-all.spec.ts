import { faker } from "@faker-js/faker";
import request from "supertest";
import UserFactory from "../../user/model/user.factory.js";
import AttendanceFactory from "../model/attendance.factory.js";
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

describe("retrieve all attendance as admin", () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  it("1.1 retrieve all attendance failed because user is not login yet", async () => {
    const app = await createApp();

    const attendanceFactory = new AttendanceFactory();
    await attendanceFactory.createMany(3);

    const response = await request(app).get("/v1/attendances");
    // check status code
    expect(response.statusCode).toEqual(401);
    // check response body
    expect(response.body).toEqual(error401);
    // check database
  });
  it("1.2 retrieve all attendance failed, dont have permission", async () => {
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

    const attendanceFactory = new AttendanceFactory();
    await attendanceFactory.createMany(3);

    const response = await request(app)
      .get("/v1/attendances")
      .set("Authorization", `Bearer ${responseLogin.body.accessToken}`);
    // check status code
    expect(response.statusCode).toEqual(403);
    // check response body
    expect(response.body).toEqual(error403);
    // check response database
  });
  it("1.3 retrieve all attendance success", async () => {
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

    const attendanceFactory = new AttendanceFactory();
    await attendanceFactory.createMany(3);

    const response = await request(app)
      .get("/v1/attendances")
      .set("Authorization", `Bearer ${responseLogin.body.accessToken}`);
    // check status code
    expect(response.statusCode).toEqual(200);
    // check response body
    const attendanceRecord = await retrieveAll("attendances", response.body._id);
    expect(response.body.attendance.length).toStrictEqual(3);
    expect(attendanceRecord[0]._id).toStrictEqual(response.body.attendances[0]._id);
    expect(attendanceRecord[0].group).toStrictEqual(response.body.attendances[0].group);
    expect(attendanceRecord[0].photo).toStrictEqual(response.body.attendances[0].photo);
    expect(attendanceRecord[0].location).toStrictEqual(response.body.attendances[0].location);
    expect(attendanceRecord[0].email).toStrictEqual(response.body.attendances[0].email);
    expect(attendanceRecord[0].groupName).toStrictEqual(response.body.attendances[0].groupName);

    expect(attendanceRecord[1].name).toStrictEqual(response.body.attendance[1].name);
    expect(attendanceRecord[2].name).toStrictEqual(response.body.attendance[2].name);

    expect(response.body.pagination.page).toStrictEqual(1);
    expect(response.body.pagination.pageSize).toStrictEqual(10);
    expect(response.body.pagination.pageCount).toStrictEqual(1);
    expect(response.body.pagination.totalDocument).toStrictEqual(3);
    // check database
  });
  it("1.4 retrieve all attendance filtered by people, success", async () => {
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

    const attendanceFactory = new AttendanceFactory();
    const attendanceSeed = [
      {
        username: "employee",
      },
      {
        username: "employee",
      },
      {
        username: "employee123",
      },
    ];
    attendanceFactory.sequence(attendanceSeed);
    await attendanceFactory.createMany(3);

    const response = await request(app)
      .get("/v1/attendances?filter[username]=employee")
      .set("Authorization", `Bearer ${responseLogin.body.accessToken}`);
    // check status code
    expect(response.statusCode).toEqual(200);
    // check response body
    const attendanceRecord = await retrieveAll("attendances", response.body._id);
    expect(response.body.attendance.length).toStrictEqual(2);
    expect(attendanceRecord[0]._id).toStrictEqual(response.body.attendances[0]._id);
    expect(attendanceRecord[0].group).toStrictEqual(response.body.attendances[0].group);
    expect(attendanceRecord[0].photo).toStrictEqual(response.body.attendances[0].photo);
    expect(attendanceRecord[0].location).toStrictEqual(response.body.attendances[0].location);
    expect(attendanceRecord[0].email).toStrictEqual(response.body.attendances[0].email);
    expect(attendanceRecord[0].groupName).toStrictEqual(response.body.attendances[0].groupName);

    expect(attendanceRecord[1].name).toStrictEqual(response.body.attendance[1].name);

    expect(response.body.pagination.page).toStrictEqual(1);
    expect(response.body.pagination.pageSize).toStrictEqual(10);
    expect(response.body.pagination.pageCount).toStrictEqual(1);
    expect(response.body.pagination.totalDocument).toStrictEqual(2);
    // check database
  });
  it("1.5 retrieve all attendance filtered by date range, success", async () => {
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

    const attendanceFactory = new AttendanceFactory();
    const attendanceSeed = [
      {
        createdAt: "2022-11-22",
      },
      {
        createdAt: "2022-11-23",
      },
      {
        createdAt: "2022-11-25",
      },
    ];
    attendanceFactory.sequence(attendanceSeed);
    await attendanceFactory.createMany(3);

    const response = await request(app)
      .get("/v1/attendances?filter[date_from]=2022-11-22&filter[date_to]=2022-11-24")
      .set("Authorization", `Bearer ${responseLogin.body.accessToken}`);
    // check status code
    expect(response.statusCode).toEqual(200);
    // check response body
    const attendanceRecord = await retrieveAll("attendances", response.body._id);
    expect(response.body.attendance.length).toStrictEqual(2);
    expect(attendanceRecord[0]._id).toStrictEqual(response.body.attendances[0]._id);
    expect(attendanceRecord[0].group).toStrictEqual(response.body.attendances[0].group);
    expect(attendanceRecord[0].photo).toStrictEqual(response.body.attendances[0].photo);
    expect(attendanceRecord[0].location).toStrictEqual(response.body.attendances[0].location);
    expect(attendanceRecord[0].email).toStrictEqual(response.body.attendances[0].email);
    expect(attendanceRecord[0].groupName).toStrictEqual(response.body.attendances[0].groupName);

    expect(attendanceRecord[1].name).toStrictEqual(response.body.attendance[1].name);

    expect(response.body.pagination.page).toStrictEqual(1);
    expect(response.body.pagination.pageSize).toStrictEqual(10);
    expect(response.body.pagination.pageCount).toStrictEqual(1);
    expect(response.body.pagination.totalDocument).toStrictEqual(2);
    // check database
  });
});

describe("retrieve all attendance as employee", () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  it("1.1 retrieve all attendance failed because user is not login yet", async () => {
    const app = await createApp();

    const attendanceFactory = new AttendanceFactory();
    await attendanceFactory.createMany(3);

    const response = await request(app).get("/v1/attendances");
    // check status code
    expect(response.statusCode).toEqual(401);
    // check response body
    expect(response.body).toEqual(error401);
    // check database
  });
  it("1.2 retrieve all attendance failed, dont have permission", async () => {
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

    const attendanceFactory = new AttendanceFactory();
    await attendanceFactory.createMany(3);

    const response = await request(app)
      .get("/v1/attendances")
      .set("Authorization", `Bearer ${responseLogin.body.accessToken}`);
    // check status code
    expect(response.statusCode).toEqual(403);
    // check response body
    expect(response.body).toEqual(error403);
    // check response database
  });
  it("1.3 retrieve all attendance success", async () => {
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

    const attendanceFactory = new AttendanceFactory();
    const attendanceSeed = [
      {
        email: "employee@gmail.com",
      },
      {
        email: "employee@gmail.com",
      },
      {
        email: "employee200@gmail.com",
      },
    ];
    attendanceFactory.sequence(attendanceSeed);
    await attendanceFactory.createMany(3);

    const response = await request(app)
      .get("/v1/attendances")
      .set("Authorization", `Bearer ${responseLogin.body.accessToken}`);
    // check status code
    expect(response.statusCode).toEqual(200);
    // check response body
    const attendanceRecord = await retrieveAll("attendances", response.body._id);
    expect(response.body.attendance.length).toStrictEqual(2);
    expect(attendanceRecord[0]._id).toStrictEqual(response.body.attendances[0]._id);
    expect(attendanceRecord[0].group).toStrictEqual(response.body.attendances[0].group);
    expect(attendanceRecord[0].photo).toStrictEqual(response.body.attendances[0].photo);
    expect(attendanceRecord[0].location).toStrictEqual(response.body.attendances[0].location);
    expect(attendanceRecord[0].email).toStrictEqual(response.body.attendances[0].email);
    expect(attendanceRecord[0].groupName).toStrictEqual(response.body.attendances[0].groupName);

    expect(attendanceRecord[1].name).toStrictEqual(response.body.attendance[1].name);

    expect(response.body.pagination.page).toStrictEqual(1);
    expect(response.body.pagination.pageSize).toStrictEqual(10);
    expect(response.body.pagination.pageCount).toStrictEqual(1);
    expect(response.body.pagination.totalDocument).toStrictEqual(2);
    // check database
  });
});
