import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("Should be able to crete a new User", async () => {
        const user = await createUserUseCase.execute({
            name: "name Teste",
            email: "email@test.com",
            password: "1234"
        });

        expect(user).toHaveProperty('id');
    });

    it("Should not be able to crete a new User if exists a user with email already exists", async () => {

        expect(async () => {
            await createUserUseCase.execute({
                name: "name Teste",
                email: "email@test.com",
                password: "1234"
            });

            await createUserUseCase.execute({
                name: "name Teste 22222",
                email: "email@test.com",
                password: "2123132"
            });
        }).rejects.toBeInstanceOf(AppError);

    });
});