import { Table, type Col, type ScheduleCtx as Ctx } from "@/lib/table";
import type { Sql } from "postgres";

export class Calendar extends Table<Ctx> {
  override name = "calendar";
  override cols: Col<Ctx>[] = [
    {
      name: "service_id",
      type: "TEXT",
      loader: ({ row }) => row.service_id,
    },
    {
      name: "monday",
      type: "INTEGER",
      loader: ({ row }) => row.monday,
    },
    {
      name: "tuesday",
      type: "INTEGER",
      loader: ({ row }) => row.tuesday,
    },
    {
      name: "wednesday",
      type: "INTEGER",
      loader: ({ row }) => row.wednesday,
    },
    {
      name: "thursday",
      type: "INTEGER",
      loader: ({ row }) => row.thursday,
    },
    {
      name: "friday",
      type: "INTEGER",
      loader: ({ row }) => row.friday,
    },
    {
      name: "saturday",
      type: "INTEGER",
      loader: ({ row }) => row.saturday,
    },
    {
      name: "sunday",
      type: "INTEGER",
      loader: ({ row }) => row.sunday,
    },
    {
      name: "start_date",
      type: "DATE",
      loader: ({ row }) => row.start_date,
    },
    {
      name: "end_date",
      type: "DATE",
      loader: ({ row }) => row.end_date,
    },
  ];

  protected override async _afterCreate(sql: Sql, ctx: Ctx): Promise<void> {
    await sql`
      DO $$
      BEGIN
        ALTER TABLE ${sql(ctx.opts.schema)}.calendar
          ADD CONSTRAINT service_id_uniq UNIQUE (service_id);
      EXCEPTION
        WHEN SQLSTATE '42P07' THEN
          NULL;
      END
      $$;
    `;
  }
}
