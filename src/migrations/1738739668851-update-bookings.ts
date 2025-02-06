import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBookings1738739668851 implements MigrationInterface {
    name = 'UpdateBookings1738739668851'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "tickets"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_161ef84a823b75f741862a77138"`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "eventId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_161ef84a823b75f741862a77138" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_161ef84a823b75f741862a77138"`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "eventId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_161ef84a823b75f741862a77138" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "tickets" integer NOT NULL`);
    }

}
