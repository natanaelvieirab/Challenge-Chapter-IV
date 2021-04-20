import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateStatementUseCase } from './CreateStatementUseCase';

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
    TRANSFER = 'transfer'
}

export class CreateStatementTRANSFERController {
    async execute(request: Request, response: Response) {

        const { id: user_id } = request.user;
        const { amount, description } = request.body;
        const { send_id } = request.params;

        const type = OperationType.TRANSFER;

        const createStatement = container.resolve(CreateStatementUseCase);

        const statement = await createStatement.execute({
            user_id,
            type,
            amount,
            description,
            send_id
        });

        return response.status(201).json(statement);
    }
}
