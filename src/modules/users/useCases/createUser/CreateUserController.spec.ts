import request from 'supertest';
import { Connection } from 'typeorm';
import { app } from '../../../../app';
import { CreateConnection } from '../../../../database';

let connection: Connection;
describe("Create user controller", () => {

    beforeAll(async () => {
        connection = await CreateConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close;
    });

    it("should be able to create a new user", async () => {
        const responseUser = await request(app)
            .post("/api/v1/users/")
            .send({
                name: 'natan test',
                email: 'natantest@gmail.com',
                password: '1234'
            });

        expect(responseUser.status).toBe(201);
    });


    it("should not be able to create a new user if email already registered", async () => {

        await request(app)
            .post("/api/v1/users/")
            .send({
                name: 'natan test',
                email: 'natantest@gmail.com',
                password: '1234'
            });

        const responseUser = await request(app)
            .post("/api/v1/users/")
            .send({
                name: 'natan test2',
                email: 'natantest@gmail.com',
                password: '4321'
            });

        expect(responseUser.status).toBe(400);
        expect(responseUser.body).toHaveProperty("message");
    });
});