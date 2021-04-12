import { Connection, createConnection, getConnectionOptions } from 'typeorm';

async function CreateConnection(): Promise<Connection> {
    const defaultOptions = await getConnectionOptions();

    return createConnection(
        Object.assign(defaultOptions, {
            host: '',
            database: process.env.NODE_ENV === 'test'
                ? 'fin_api_db_test' : ''
        }),
    );
}

export { CreateConnection }
