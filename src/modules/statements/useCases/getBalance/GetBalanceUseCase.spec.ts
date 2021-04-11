import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get all balance", () => {

    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);

        statementsRepositoryInMemory = new InMemoryStatementsRepository();
        createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
        getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, usersRepositoryInMemory);
    });

    it("Should be able get all balance of a user already exists", async () => {
        const user = await createUserUseCase.execute({
            name: "testAll",
            email: "testAll@test.com",
            password: "1245"
        });

        const user_id = String(user.id);

        await createStatementUseCase.execute({
            user_id,
            amount: 100,
            type: OperationType.DEPOSIT,
            description: "Deposito de 2000 reais",
        });

        const getAll = await getBalanceUseCase.execute({ user_id });

        expect(getAll.statement.length).toBe(1);
        expect(getAll.statement[0]).toHaveProperty("id");
        expect(getAll.statement[0].user_id).toBe(user_id);
    });

    it("Should not be able get all balance if a user not already exists", () => {
        expect(async () => {

            const getAll = await getBalanceUseCase.execute({ user_id: "User_not_exist" });

        }).rejects.toBeInstanceOf(GetBalanceError);
    });

});