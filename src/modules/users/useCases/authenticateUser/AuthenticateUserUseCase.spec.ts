import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


let userRepository: InMemoryUsersRepository;
let authenticationUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {

    beforeEach(() => {
        userRepository = new InMemoryUsersRepository();
        authenticationUseCase = new AuthenticateUserUseCase(userRepository);
        createUserUseCase = new CreateUserUseCase(userRepository);
    });

    it("should be able to authenticate a user already exists", async () => {
        const user = {
            name: "user fake",
            email: "email@fake.com.br",
            password: "1234"
        }

        await createUserUseCase.execute({
            name: user.name,
            email: user.email,
            password: user.password
        });

        const authentication = await authenticationUseCase.execute({
            email: user.email,
            password: user.password
        });

        expect(authentication).toHaveProperty("token");
        expect(authentication).toHaveProperty("user");
    });

    it("should not be able to authenticate a user with password incorrect", async () => {
        expect(async () => {
            const user = {
                name: "user fake",
                email: "email@fake.com.br",
                password: "1234"
            }

            await createUserUseCase.execute({
                name: user.name,
                email: user.email,
                password: user.password
            });

            const authentication = await authenticationUseCase.execute({
                email: user.email,
                password: "password"
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);


    });

    it("should not be able to authenticate a user not already exists", async () => {
        expect(async () => {
            await authenticationUseCase.execute({
                email: "user@email.com",
                password: "1235"
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });
});