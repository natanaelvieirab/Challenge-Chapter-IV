import { Connection } from "typeorm";
import { CreateConnection } from "../../../../database";
import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;

describe("Get Balance Controller", () => {

    beforeAll(async () => {
        connection = await CreateConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able get the balance of a user", async () => {
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
            .get("/api/v1/statements/balance")
            .set({
                Authorization: `Bearer ${token}`
            });

        expect(returnGetBalance.body.balance).toBe(500);
        expect(returnGetBalance.body.statement[0].id).toBe(responseStatement.body.id);
    });

    it("should not be able get the balance of a user if the session not active ", async () => {

        const token = "token_invalid";

        const statement_id = "1234567";

        const returnGetBalance = await request(app)
            .get("/api/v1/statements/balance")

            .set({
                Authorization: `Bearer ${token}`
            });


        expect(returnGetBalance.status).toBe(401);
    });

});