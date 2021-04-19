import { Column, MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class CreateColumnSendIdInStatement1618599841280 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("statements", new TableColumn({
            name: "send_id",
            type: "uuid"
        }));

        await queryRunner.createForeignKey("statements", new TableForeignKey({
            columnNames: ["send_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "SET NULL",
            onUpdate: "SET NULL",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("statements", "send_id");
    }

}
