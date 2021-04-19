import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
    TRANSFER = 'TRANSFER'
}

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {

    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        statementsRepositoryInMemory = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
        createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
    });

    it("Should be able to register the operation of deposit for user", async () => {
        const user = await createUserUseCase.execute({
            name: "teste ",
            email: "test@tes.com",
            password: "test"
        });

        const user_id = String(user.id);

        const statement = await createStatementUseCase.execute({
            user_id,
            type: OperationType.DEPOSIT,
            amount: 100,
            description: "testando deposito de 100 conto"
        });

        expect(statement).toHaveProperty("id");
    });

    it("Should be able to register the operation of withdraw for user", async () => {
        const user = await createUserUseCase.execute({
            name: "teste Saque",
            email: "testSaque@tes.com",
            password: "testSaque"
        });

        const user_id = String(user.id);

        await createStatementUseCase.execute({
            user_id,
            type: OperationType.DEPOSIT,
            amount: 100,
            description: "Deposito de 100 conto"
        });

        const statement = await createStatementUseCase.execute({
            user_id,
            type: OperationType.WITHDRAW,
            amount: 100,
            description: "Saque de 100 conto"
        });

        expect(statement).toHaveProperty("id");
    });

    it("Should be able to register the operation of Transfer for one user", async () => {

        const userOne = await createUserUseCase.execute({
            name: "Martha Gilbert",
            email: "la@tomrahej.sd",
            password: "userOne"
        });

        const userTwo = await createUserUseCase.execute({
            name: "Ollie Lawrence",
            email: "fonduuha@pabriod.fj",
            password: "userTwo"
        });

        await createStatementUseCase.execute({
            user_id: String(userOne.id),
            type: OperationType.DEPOSIT,
            amount: 150,
            description: "Deposito de 150 conto"
        });

        const statementTransfer = await createStatementUseCase.execute({
            user_id: String(userOne.id),
            send_id: String(userTwo.id),
            type: OperationType.TRANSFER,
            amount: 100,
            description: "Transferência de 100 conto "
        });

        expect(statementTransfer).toHaveProperty("id");

    });

    it("Should not be able to register the operation of withdraw for user that has no balance", () => {
        expect(async () => {

            const { id } = await createUserUseCase.execute({
                name: "natanTest",
                email: "natanTest@test.com",
                password: "123456",
            });

            const statement = await createStatementUseCase.execute({
                user_id: String(id),
                type: OperationType.WITHDRAW,
                amount: 100,
                description: "Saque de 100 conto"
            });

        }).rejects.toBeInstanceOf(AppError);
    });

    it("Should not be able to register the operation if user not already exists", async () => {

        expect(async () => {
            await createStatementUseCase.execute({
                user_id: "user_not_exists",
                type: OperationType.DEPOSIT,
                amount: 1000000,
                description: "testando deposito"
            });
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);

    });
});