link do desafio IV: 
https://www.notion.so/Desafio-01-Testes-unit-rios-0321db2af07e4b48a85a1e4e360fcd11

link do desafio V: (o desafio reutiliza o código do desafio IV)
https://www.notion.so/Desafio-01-Transfer-ncias-com-a-FinAPI-5e1dbfc0bd66420f85f6a4948ad727c2


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

Desafio V: Implementar a funcionalidade de transferência entre usuários já cadastrados
# Transferência entre usuários

**RF**
[] O usuário deve conseguir realizar uma transferência para outro usuário.
[] O usuário deve conseguir receber uma transferência de outro usuário.
[] O usuário deve conseguir ver o saldo (balance) da conta. 

**RNF**
[] estrutura para realizar uma transferência:
{
  "amount": 100,
	"description": "Descrição da transferência"
}
na url: /api/v1/statements/transfers/:user_id
onde user_id é usuário que vai receber o valor transferido.

[]estrutura do statement que será exibida ao acessar a rota "/api/v1/statements/"
{
  "id": "4d04b6ec-2280-4dc2-9432-8a00f64e7930",
  "user_id": "abc06865-11b9-412a-aa78-f47cc1010101"
	"sender_id": "cfd06865-11b9-412a-aa78-f47cc3e52905"
  "amount": 100,
  "description": "Transferência de valor",
  "type": "transfer",
  "created_at": "2021-03-26T21:33:11.370Z",
  "updated_at": "2021-03-26T21:33:11.370Z"
}

**RN**
[] Não deve ser possível transferir valores superiores ao disponível no saldo de uma conta;
[] O valor transferido é "tirado" da conta do usuário e o mesmo valor é "adicionado" na conta do usuário que recebeu a transferência.


# MINHA ESTRATEGIA PARA IMPLEMENTAR ESTA FUNCIONALIDADE
* Na tabela 'statement' adiciono a coluna 'send_id' que representa o usuário que RECEBEU  a transferência, e a coluna 'id' representa o usuário que FEZ a operação.
* Ao realizar o "balance" deve verificar as operações que são de um determinado usuário (que já faz isso), se a operação for de transferência deve ser feito o seguinte:
  * se o usuário que fez a operação, retira o valor x do total somado até o momento;
  * se o usuário que RECEBEU a operação, adiciona o valor x do total somado até o momento;


Rodar testes somente do arquivo : yarn test src/modules/statements/useCases/createStatement/CreateStatementUseCase.spec.ts  