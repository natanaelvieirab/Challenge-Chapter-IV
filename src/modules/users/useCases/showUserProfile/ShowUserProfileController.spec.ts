import { Connection } from "typeorm";
import { app } from "../../../../app";
import { CreateConnection } from "../../../../database";
import request from 'supertest';

let connection: Connection;

describe("Show User Profile Controller", () => {

    beforeAll(async () => {
        connection = await CreateConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to show the data of a user if the session is authenticated ", async () => {
        const user = {
            name: "test",
            email: "testProfile@email.com",
            password: "profile"
        };

        await request(app)
            .post("/api/v1/users/")
            .send({
                name: user.name,
                email: user.email,
                password: user.password
            });

        const userAuthenticate = await request(app)
            .post("/api/v1/sessions")
            .send({
                email: user.email,
                password: user.password
            });

        const { token } = userAuthenticate.body;

        const getUser = await request(app)
            .get('/api/v1/profile/')
            .set({
                Authorization: `Bearer ${token}`
            });

        expect(getUser.status).toBe(200);
        expect(getUser.body.name).toBe(user.name);
        expect(getUser.body.email).toBe(user.email);
    });

    it("should not be able to show the data of a user if the session is not authenticated ", async () => {

        const token = "userAuthenticate.body";

        const getUser = await request(app)
            .get('/api/v1/profile/')
            .set({
                Authorization: `Bearer ${token}`
            });

        expect(getUser.status).toBe(401);
        expect(getUser.body).toHaveProperty("message");

    });
});