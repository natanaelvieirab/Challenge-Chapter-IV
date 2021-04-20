import { Connection } from "typeorm";
import { CreateConnection } from "../../../../database";
import request from 'supertest';
import { app } from "../../../../app";

let connection: Connection;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
    TRANSFER = 'transfer'
}

describe("Create Statement Controller", () => {

    beforeAll(async () => {
        connection = await CreateConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to create a new operation of deposit", async () => {
        const user = {
            name: "statementTest",
            email: "testStatement@email.com",
            password: "statement"
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
                amount: 100,
                description: 'depositando 100 conto'
            })
            .set({
                Authorization: `Bearer ${token}`
            });

        expect(responseStatement.status).toBe(201);
        expect(responseStatement.body.type).toBe(OperationType.DEPOSIT);
        expect(responseStatement.body.amount).toBe(100);
    });

    it("should be able to create a new operation of withdraw", async () => {
        const user = {
            name: "statementTest2",
            email: "testStatement2@email.com",
            password: "statement2"
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

        await request(app)
            .post('/api/v1/statements/deposit')
            .send({
                amount: 100,
                description: 'depositando 100 conto'
            })
            .set({
                Authorization: `Bearer ${token}`
            });

        const responseStatement = await request(app)
            .post('/api/v1/statements/withdraw')
            .send({
                amount: 100,
                description: 'sacando 100 conto'
            })
            .set({
                Authorization: `Bearer ${token}`
            });

        expect(responseStatement.status).toBe(201);
        expect(responseStatement.body.type).toBe(OperationType.WITHDRAW);
        expect(responseStatement.body.amount).toBe(100);
    });

    it("should be able to create a new operation of transfer", async () => {
        const userOne = {
            name: "Etta Carroll",
            email: "uko@num.sa",
            password: "testTransfer"
        }

        await request(app)
            .post('/api/v1/users/')
            .send({
                name: userOne.name,
                email: userOne.email,
                password: userOne.password
            });

        await request(app)
            .post('/api/v1/users/')
            .send({
                name: "Bernard Butler",
                email: "sit@nu.do",
                password: "user2"
            });

        const userAuthenticate = await request(app)
            .post('/api/v1/sessions')
            .send({
                email: userOne.email,
                password: userOne.password
            });

        const { token } = userAuthenticate.body;

        const userTWOAuthenticate = await request(app)
            .post('/api/v1/sessions')
            .send({
                email: "sit@nu.do",
                password: "user2"
            });

        const { user: userTWO } = userTWOAuthenticate.body;

        await request(app)
            .post('/api/v1/statements/deposit')
            .send({
                amount: 500,
                description: 'depositando 500 conto'
            })
            .set({
                Authorization: `Bearer ${token}`
            });

        const statementTransfer = await request(app)
            .post(`/api/v1/statements/transfer/${userTWO.id}`)
            .send({
                amount: 100,
                description: 'transferindo 100 conto'
            })
            .set({
                Authorization: `Bearer ${token}`
            });

        const getBalance = await request(app)
            .get('/api/v1/statements/balance')
            .set({
                Authorization: `Bearer ${token}`
            });

        expect(statementTransfer.status).toBe(201);
        expect(statementTransfer.body.type).toBe(OperationType.TRANSFER);
        expect(getBalance.body.balance).toBe(400);
        expect(getBalance.body.statement.length).toBe(2); // quantidades de operações realizadas
    });

    it("should not be able to create a new operation of deposit if the user is not authenticate", async () => {

        const token = "not_authenticated"

        const responseStatement = await request(app)
            .post('/api/v1/statements/deposit')
            .send({
                amount: 100,
                description: 'depositando 100 conto'
            })
            .set({
                Authorization: `Bearer ${token}`
            });

        expect(responseStatement.status).toBe(401);
    });
});