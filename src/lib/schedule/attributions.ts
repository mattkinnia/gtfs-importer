import { Table, type Col, type ScheduleCtx as Ctx } from "@/lib/table";
import type { Sql } from "postgres";

export class Attributions extends Table<Ctx> {
  override name = "attributions";
  override cols: Col<Ctx>[] = [
    {
      name: "attribution_id",
      type: "TEXT",
      loader: ({ row }) => row.attribution_id,
    },
    {
      name: "agency_id",
      type: "TEXT",
      loader: ({ row }) => row.agency_id,
    },
    {
      name: "route_id",
      type: "TEXT",
      loader: ({ row }) => row.route_id,
    },
    {
      name: "trip_id",
      type: "TEXT",
      loader: ({ row }) => row.trip_id,
    },
    {
      name: "organization_name",
      type: "TEXT",
      loader: ({ row }) => row.organization_name,
    },
    {
      name: "is_producer",
      type: "INTEGER",
      loader: ({ row }) => (!row.is_producer ? "0" : row.is_producer),
    },
    {
      name: "is_operator",
      type: "INTEGER",
      loader: ({ row }) => (!row.is_operator ? "0" : row.is_operator),
    },
    {
      name: "is_authority",
      type: "INTEGER",
      loader: ({ row }) => (!row.is_authority ? "0" : row.is_authority),
    },
    {
      name: "attribution_url",
      type: "TEXT",
      loader: ({ row }) => row.attribution_url,
    },
    {
      name: "attribution_email",
      type: "TEXT",
      loader: ({ row }) => row.attribution_email,
    },
    {
      name: "attribution_phone",
      type: "TEXT",
      loader: ({ row }) => row.attribution_phone,
    },
  ];

  protected override async _afterCreate(sql: Sql, ctx: Ctx): Promise<void> {
    await sql`
      DO $$
      BEGIN
        ALTER TABLE ${sql(ctx.opts.schema)}.attributions
          ADD CONSTRAINT attribution_id_uniq UNIQUE (attribution_id);
      EXCEPTION
        WHEN SQLSTATE '42P07' THEN
          NULL;
      END
      $$;
    `;
  }
}
