import { Table, type Col, type ScheduleCtx as Ctx } from "@/lib/table";
import type { Sql } from "postgres";

export class Pathways extends Table<Ctx> {
  override name = "pathways";
  override cols: Col<Ctx>[] = [
    {
      name: "_import_id",
      type: "TEXT",
      loader: ({ ctx }) => ctx.opts.id,
    },
    {
      name: "pathway_id",
      type: "TEXT",
      loader: ({ row }) => row.pathway_id,
    },
    {
      name: "from_stop_id",
      type: "TEXT",
      loader: ({ row }) => row.from_stop_id,
    },
    {
      name: "to_stop_id",
      type: "TEXT",
      loader: ({ row }) => row.to_stop_id,
    },
    {
      name: "pathway_mode",
      type: "INTEGER",
      loader: ({ row }) => row.pathway_mode,
    },
    {
      name: "is_bidirectional",
      type: "INTEGER",
      loader: ({ row }) => row.is_bidirectional,
    },
    {
      name: "length",
      type: "DOUBLE PRECISION",
      loader: ({ row }) => row.length,
    },
    {
      name: "traversal_time",
      type: "INTEGER",
      loader: ({ row }) => row.traversal_time,
    },
    {
      name: "stair_count",
      type: "INTEGER",
      loader: ({ row }) => row.stair_count,
    },
    {
      name: "max_slope",
      type: "DOUBLE PRECISION",
      loader: ({ row }) => (!row.max_slope ? "0" : row.max_slope),
    },
    {
      name: "min_width",
      type: "DOUBLE PRECISION",
      loader: ({ row }) => row.min_width,
    },
    {
      name: "signposted_as",
      type: "TEXT",
      loader: ({ row }) => row.signposted_as,
    },
    {
      name: "reversed_signposted_as",
      type: "TEXT",
      loader: ({ row }) => row.reversed_signposted_as,
    },
  ];

  protected override async _afterCreate(sql: Sql, ctx: Ctx): Promise<void> {
    await sql`
      DO $$
      BEGIN
        ALTER TABLE ${sql(ctx.opts.schema)}.pathways
          ADD CONSTRAINT pathway_id_uniq UNIQUE (pathway_id);
      EXCEPTION
        WHEN SQLSTATE '42P07' THEN
          NULL;
      END
      $$;
    `;
  }
}
