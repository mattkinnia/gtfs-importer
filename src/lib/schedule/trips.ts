import { Table, type Col, type ScheduleCtx as Ctx } from "@/lib/table";
import type { Sql } from "postgres";

export class Trips extends Table<Ctx> {
  override name = "trips";
  override cols: Col<Ctx>[] = [
    {
      name: "_import_id",
      type: "TEXT",
      loader: ({ ctx }) => ctx.opts.id,
    },
    {
      name: "trip_id",
      type: "TEXT",
      loader: ({ row }) => row.trip_id,
    },
    {
      name: "route_id",
      type: "TEXT",
      loader: ({ row }) => row.route_id,
    },
    {
      name: "service_id",
      type: "TEXT",
      loader: ({ row }) => row.service_id,
    },
    {
      name: "trip_headsign",
      type: "TEXT",
      loader: ({ row }) => row.trip_headsign,
    },
    {
      name: "trip_short_name",
      type: "TEXT",
      loader: ({ row }) => row.trip_short_name,
    },
    {
      name: "direction_id",
      type: "INTEGER",
      loader: ({ row }) => row.direction_id,
    },
    {
      name: "block_id",
      type: "TEXT",
      loader: ({ row }) => row.block_id,
    },
    {
      name: "shape_id",
      type: "TEXT",
      loader: ({ row }) => row.shape_id,
    },
    {
      name: "wheelchair_accessible",
      type: "INTEGER",
      loader: ({ row }) =>
        !row.wheelchair_accessible ? "0" : row.wheelchair_accessible,
    },
    {
      name: "bikes_allowed",
      type: "INTEGER",
      loader: ({ row }) => (!row.bikes_allowed ? "0" : row.bikes_allowed),
    },
    {
      name: "cars_allowed",
      type: "INTEGER",
      loader: ({ row }) => (!row.cars_allowed ? "0" : row.cars_allowed),
    },
  ];

  protected override async _afterCreate(sql: Sql, ctx: Ctx): Promise<void> {
    await sql`
      DO $$
      BEGIN
        ALTER TABLE ${sql(ctx.opts.schema)}.trips
          ADD CONSTRAINT trip_id_uniq UNIQUE (trip_id);
      EXCEPTION
        WHEN SQLSTATE '42P07' THEN
          NULL;
      END
      $$;
    `;
  }
}
