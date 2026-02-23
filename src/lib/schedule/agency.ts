import { Table, type Col, type ScheduleCtx as Ctx } from "@/lib/table";
import type { Sql } from "postgres";

export class Agency extends Table<Ctx> {
  override name = "agency";
  override cols: Col<Ctx>[] = [
    {
      name: "_import_id",
      type: "TEXT",
      loader: ({ ctx }) => ctx.opts.id,
    },
    {
      name: "agency_id",
      type: "TEXT",
      loader: ({ row }) => row.agency_id,
    },
    {
      name: "agency_name",
      type: "TEXT",
      loader: ({ row }) => row.agency_name,
    },
    {
      name: "agency_url",
      type: "TEXT",
      loader: ({ row }) => row.agency_url,
    },
    {
      name: "agency_timezone",
      type: "TEXT",
      loader: ({ row }) => row.agency_timezone,
    },
    {
      name: "agency_lang",
      type: "TEXT",
      loader: ({ row }) => row.agency_lang,
    },
    {
      name: "agency_phone",
      type: "TEXT",
      loader: ({ row }) => row.agency_phone,
    },
    {
      name: "agency_fare_url",
      type: "TEXT",
      loader: ({ row }) => row.agency_fare_url,
    },
    {
      name: "agency_email",
      type: "TEXT",
      loader: ({ row }) => row.agency_email,
    },
    {
      name: "cemv_support",
      type: "INTEGER",
      loader: ({ row }) => (!row.cemv_support ? "0" : row.cemv_support),
    },
  ];

  protected override async _afterCreate(sql: Sql, ctx: Ctx): Promise<void> {
    await sql`
      DO $$
      BEGIN
        ALTER TABLE ${sql(ctx.opts.schema)}.agency
          ADD CONSTRAINT agency_id_uniq UNIQUE (agency_id);
      EXCEPTION
        WHEN SQLSTATE '42P07' THEN
          NULL;
      END
      $$;
    `;
  }
}
