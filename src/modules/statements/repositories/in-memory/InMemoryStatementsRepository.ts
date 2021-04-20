import { Statement } from "../../entities/Statement";
import { ICreateStatementDTO } from "../../useCases/createStatement/ICreateStatementDTO";
import { IGetBalanceDTO } from "../../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../../useCases/getStatementOperation/IGetStatementOperationDTO";
import { IStatementsRepository } from "../IStatementsRepository";

export class InMemoryStatementsRepository implements IStatementsRepository {
  private statements: Statement[] = [];

  async create(data: ICreateStatementDTO): Promise<Statement> {
    const statement = new Statement();

    Object.assign(statement, data);

    this.statements.push(statement);

    return statement;
  }

  async findStatementOperation({ statement_id, user_id }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.statements.find(operation => (
      operation.id === statement_id &&
      operation.user_id === user_id
    ));
  }

  async getUserBalance({ user_id, with_statement = false }: IGetBalanceDTO):
    Promise<
      { balance: number } | { balance: number, statement: Statement[] }
    > {
    const statement = this.statements.filter(
      operation => operation.user_id === user_id || operation.send_id === user_id
    );
    // statement => possui todas as operações no qual o usuário esta envolvido (op é dele ou recebeu grana)

    const balance = statement.reduce((acc, operation) => {
      if (operation.type === 'deposit') {
        return acc + operation.amount;
      }
      else if (operation.type === 'transfer') {
        // se o id do usuário estiver no campo send_id, 
        // então recebeu dinheiro se não, 
        // ele enviou dinheiro .
        return operation.send_id === user_id ?
          acc + operation.amount :
          acc - operation.amount;
      }
      else {
        return acc - operation.amount;
      }
    }, 0);

    if (with_statement) {
      return {
        statement,
        balance
      }
    }

    return { balance }
  }
}
