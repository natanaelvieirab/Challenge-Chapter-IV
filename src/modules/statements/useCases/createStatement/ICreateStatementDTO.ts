
enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

export default class ICreateStatementDTO {
  user_id: string;
  description: string;
  amount: number;
  type: OperationType;
  send_id?: string;
}