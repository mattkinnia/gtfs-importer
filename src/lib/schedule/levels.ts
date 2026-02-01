import { Table, type Col, type Ctx } from "@/lib/table";
import type { Sql } from "postgres";

export class Levels extends Table {
  override name = "levels";
  override cols: Col[] = [
    {
      name: "level_id",
      type: "TEXT",
      loader: ({ row }) => row.level_id,
    },
    {
      name: "level_index",
      type: "DOUBLE PRECISION",
      loader: ({ row }) => row.level_index,
    },
    {
      name: "level_name",
      type: "TEXT",
      loader: ({ row }) => row.level_name,
    },
  ];

  protected override async _afterCreate(sql: Sql, ctx: Ctx): Promise<void> {
    await sql`
      DO $$
      BEGIN
        ALTER TABLE ${sql(ctx.opts.schema)}.levels
          ADD CONSTRAINT level_id_uniq UNIQUE (level_id);
      EXCEPTION
        WHEN SQLSTATE '42P07' THEN
          NULL;
      END
      $$;
    `;
  }
}
