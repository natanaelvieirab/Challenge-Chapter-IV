import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperation: GetStatementOperationUseCase;

describe("Get a single operation ", () => {

    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        statementsRepositoryInMemory = new InMemoryStatementsRepository();

        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory,);
        createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory)
        getStatementOperation = new GetStatementOperationUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
    });

    it("should be able to obtain an operation record where the type is deposit", async () => {
        const user = await createUserUseCase.execute({
            name: 'rafael Teste',
            email: 'rafael@test.com',
            password: 'test'
        });
        const user_id = String(user.id);

        const statement = await createStatementUseCase.execute(
            {
                user_id,
                amount: 50,
                type: OperationType.DEPOSIT,
                description: "deposito de 50 conto"
            }
        );

        const operationStatement = await getStatementOperation.execute({
            user_id,
            statement_id: String(statement.id)
        });

        expect(operationStatement.type).toBe(OperationType.DEPOSIT);
        expect(operationStatement.id).toBe(statement.id);
        expect(operationStatement.user_id).toBe(user.id);
    });

    it("should be able to obtain an operation record where the type is withdraw", async () => {
        const user = await createUserUseCase.execute({
            name: 'rafael Teste',
            email: 'rafael@test.com',
            password: 'test'
        });

        const user_id = String(user.id);

        await createStatementUseCase.execute(
            {
                user_id,
                amount: 160,
                type: OperationType.DEPOSIT,
                description: "saque de 160 conto"
            }
        );

        const statement = await createStatementUseCase.execute(
            {
                user_id,
                amount: 150,
                type: OperationType.WITHDRAW,
                description: "saque de 150 conto"
            }
        );

        const operationStatement = await getStatementOperation.execute({
            user_id,
            statement_id: String(statement.id)
        });

        expect(operationStatement.type).toBe(OperationType.WITHDRAW);
        expect(operationStatement.id).toBe(statement.id);
        expect(operationStatement.user_id).toBe(user.id);
    });

    it("should not be able to obtain an operation where a user not already exists", async () => {
        expect(async () => {

            const operationStatement = await getStatementOperation.execute({
                user_id: "user_not_exist",
                statement_id: "131231212123"
            });

        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);


    });

    it("should be able to obtain an operation record where a 'statement' not already exists", async () => {

        expect(async () => {
            const user = await createUserUseCase.execute({
                name: 'rafael Teste',
                email: 'rafael@test.com',
                password: 'test'
            });

            const user_id = String(user.id);

            const operationStatement = await getStatementOperation.execute({
                user_id,
                statement_id: "statement_not_exists"
            });

        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
    });
});