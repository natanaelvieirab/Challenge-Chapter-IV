import { Connection } from "typeorm";
import { CreateConnection } from "../../../../database";
import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;

describe("Get Balance Operation Controller", () => {

    beforeAll(async () => {
        connection = await CreateConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able get the statement", async () => {
        const user = {
            name: "balanceTest",
            email: "balanceTest@email.com",
            password: "balanceTest"
        }

        await request(app)
            .post('/api/v1/users/')
            .send({
                name: user.name,
                email: user.email,
                password: user.password
            });

        const userAuthenticate = await request(app)
            .post('/api/v1/sessions')
            .send({
                email: user.email,
                password: user.password
            });

        const { token } = userAuthenticate.body;

        const responseStatement = await request(app)
            .post('/api/v1/statements/deposit')
            .send({
                amount: 500,
                description: 'depositando 500 conto'
            })
            .set({
                Authorization: `Bearer ${token}`
            });

        const { id: statement_id } = responseStatement.body;

        const returnGetBalance = await request(app)
            .get(`/api/v1/statements/${statement_id}`)
            .set({
                Authorization: `Bearer ${token}`
            });


        expect(returnGetBalance.body.id).toBe(responseStatement.body.id);
    });

    it("should not be able get statement if the session not active ", async () => {

        const token = "token_invalid";

        const statement_id = "1234567";

        const returnGetBalance = await request(app)
            .get(`/api/v1/statements/${statement_id}`)
            .set({
                Authorization: `Bearer ${token}`
            });


        expect(returnGetBalance.status).toBe(401);
    });


    it("should not be able get statement if the statement for invalid", async () => {
        const userTest = {
            name: "balanceTest2",
            email: "balanceTest2@email.com",
            password: "balanceTest2"
        }

        await request(app)
            .post('/api/v1/users/')
            .send({
                name: userTest.name,
                email: userTest.email,
                password: userTest.password
            });

        const userAuthenticate = await request(app)
            .post('/api/v1/sessions')
            .send({
                email: userTest.email,
                password: userTest.password
            });

        const { user, token } = userAuthenticate.body;

        const statement_id = user.id; // informando id invalido 

        const returnGetBalance = await request(app)
            .get(`/api/v1/statements/${statement_id}`)
            .set({
                Authorization: `Bearer ${token}`
            });

        expect(returnGetBalance.status).toBe(404);
    });
});