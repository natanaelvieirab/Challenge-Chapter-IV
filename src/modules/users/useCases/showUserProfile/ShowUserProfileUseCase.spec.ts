import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let userRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show user", () => {
    beforeEach(() => {
        userRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);

        showUserProfileUseCase = new ShowUserProfileUseCase(userRepositoryInMemory);
    });

    it("Should be able to show a user", async () => {

        const user = {
            name: "user fake",
            email: "email@fake.com.br",
            password: "1234"
        }
        const { id } = await createUserUseCase.execute({
            name: user.name,
            email: user.email,
            password: user.password
        });

        const user_id = String(id);

        const showUser = await showUserProfileUseCase.execute(user_id);

        expect(showUser.name).toBe(user.name);
        expect(showUser).toHaveProperty("id");

    });

    it("Should not be able to show a user not already exists", async () => {
        expect(async () => {

            const user_id = "id_not_exits"

            const showUser = await showUserProfileUseCase.execute(user_id);
        }).rejects.toBeInstanceOf(ShowUserProfileError);

    });
});