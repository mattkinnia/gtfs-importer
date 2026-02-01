import { Table, type Col, type Ctx } from "@/lib/table";
import type { Sql } from "postgres";

export class Routes extends Table {
  override name = "routes";
  override cols: Col[] = [
    {
      name: "route_id",
      type: "TEXT",
      loader: ({ row }) => row.route_id,
    },
    {
      name: "agency_id",
      type: "TEXT",
      loader: ({ row }) => row.agency_id,
    },
    {
      name: "route_short_name",
      type: "TEXT",
      loader: ({ row }) => row.route_short_name,
    },
    {
      name: "route_long_name",
      type: "TEXT",
      loader: ({ row }) => row.route_long_name,
    },
    {
      name: "route_desc",
      type: "TEXT",
      loader: ({ row }) => row.route_desc,
    },
    {
      name: "route_type",
      type: "INTEGER",
      loader: ({ row }) => row.route_type,
    },
    {
      name: "route_url",
      type: "TEXT",
      loader: ({ row }) => row.route_url,
    },
    {
      name: "route_color",
      type: "TEXT",
      loader: ({ row }) => row.route_color,
    },
    {
      name: "route_text_color",
      type: "TEXT",
      loader: ({ row }) => row.route_text_color,
    },
    {
      name: "route_sort_order",
      type: "INTEGER",
      loader: ({ row }) => row.route_sort_order,
    },
    {
      name: "continuous_pickup",
      type: "INTEGER",
      loader: ({ row }) => row.continuous_pickup,
    },
    {
      name: "continuous_drop_off",
      type: "INTEGER",
      loader: ({ row }) => row.continuous_drop_off,
    },
    {
      name: "network_id",
      type: "TEXT",
      loader: ({ row }) => row.network_id,
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
        ALTER TABLE ${sql(ctx.opts.schema)}.routes
          ADD CONSTRAINT route_id_uniq UNIQUE (route_id);
      EXCEPTION
        WHEN SQLSTATE '42P07' THEN
          NULL;
      END
      $$;
    `;
  }
}
