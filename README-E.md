link do desafio: 
https://www.notion.so/Desafio-01-Testes-unit-rios-0321db2af07e4b48a85a1e4e360fcd11


Para realizar os testes, instale:
 > jest: yarn add jest @types/jest -D
 > iniciando o jest: yarn jest --init
 para que o jest reconheça o typescript, faça:
 > ts-jest: yarn add ts-jest -D 
 em jest.config.json, modifique o para que estas propriedades fique assim:
    bail: true,// fazer com que o jest pare quando um test não passar
    preset: "ts-jest", // jest reconheça o typescript
    testMatch: [
    "**/*.spec.ts", // informando onde encontrar os arquivos de testes
  ]

Mapeando funcionamento do user:
> index /users >> userRoutes >>  createUserController >> { name, email , password} >> CreateUserUseCase  
    retorna 201 >> ok
    400 >>  erro 

 Authenticate User
> index / >> userRoutes /sessions >>  AuthenticateUserController >> {  email , password} >> AuthenticateUserUseCase  
    retorna json {user, token}
    401 >>  erro 


> index /profile >> profileRoutes >> "user autenticado" >> showUserProfileController >> id >> showUserProfile(UseCase)

    retorna json >> user
    404 >> error

statements/balance
INDEX >> get/balance >> getBalanceController >> user_id >> getBalance 
    retarn json >> statement
  404 >> error

Statements/post / deposit || withdraw 
INDEX >> post/deposit | /withdraw >> createStatementController  >> {user_id} + {amount, description}: body  >> CreateStatementUseCase(userRepository, statementRepository)
  Retorna:
  404  >>erro
  201  >> statement

  test não esta dando certo:
    -> Should not be able to register the operation of withdraw for user that has no balance


Get Statement Operation
/:statement_id
index >> GetStatementOperationController >> user_id e statement_id >> GetStatementOperationUseCase >> { UserRepository e StatementRepository} >>
  Erro:
   404  GetStatementOperationError.StatementNotFound();
   404 GetStatementOperationError.UserNoFound()
   retorna statement
