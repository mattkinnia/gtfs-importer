import { Table, type Col, type ScheduleCtx as Ctx } from "@/lib/table";
import type { Sql } from "postgres";

export class Stops extends Table<Ctx> {
  override name = "stops";
  override cols: Col<Ctx>[] = [
    {
      name: "stop_id",
      type: "TEXT",
      loader: ({ row }) => row.stop_id,
    },
    {
      name: "stop_code",
      type: "TEXT",
      loader: ({ row }) => row.stop_code,
    },
    {
      name: "stop_name",
      type: "TEXT",
      loader: ({ row }) => row.stop_name,
    },
    {
      name: "tts_stop_name",
      type: "TEXT",
      loader: ({ row }) => row.tts_stop_name,
    },
    {
      name: "stop_desc",
      type: "TEXT",
      loader: ({ row }) => row.stop_desc,
    },
    {
      name: "stop_lat",
      type: "DOUBLE PRECISION",
      loader: ({ row }) => row.stop_lat,
    },
    {
      name: "stop_lon",
      type: "DOUBLE PRECISION",
      loader: ({ row }) => row.stop_lon,
    },
    {
      name: "zone_id",
      type: "TEXT",
      loader: ({ row }) => row.zone_id,
    },
    {
      name: "stop_url",
      type: "TEXT",
      loader: ({ row }) => row.stop_url,
    },
    {
      name: "location_type",
      type: "INTEGER",
      loader: ({ row }) => (!row.location_type ? "0" : row.location_type),
    },
    {
      name: "parent_station",
      type: "TEXT",
      loader: ({ row }) => row.parent_station,
    },
    {
      name: "stop_timezone",
      type: "TEXT",
      loader: ({ row }) => row.stop_timezone,
    },
    {
      name: "wheelchair_boarding",
      type: "INTEGER",
      loader: ({ row }) =>
        !row.wheelchair_boarding ? "0" : row.wheelchair_boarding,
    },
    {
      name: "level_id",
      type: "TEXT",
      loader: ({ row }) => row.level_id,
    },
    {
      name: "platform_code",
      type: "TEXT",
      loader: ({ row }) => row.platform_code,
    },
    {
      name: "stop_access",
      type: "INTEGER",
      loader: ({ row }) => row.stop_access,
    },
  ];

  protected override async _afterCreate(sql: Sql, ctx: Ctx): Promise<void> {
    await sql`
      ALTER TABLE ${sql(ctx.opts.schema)}.stops
      ADD COLUMN IF NOT EXISTS stop_pt POINT GENERATED ALWAYS AS (
        POINT(stop_lon, stop_lat)
      ) STORED;
    `;

    await sql`
      DO $$
      BEGIN
        ALTER TABLE ${sql(ctx.opts.schema)}.stops
          ADD CONSTRAINT stop_id_uniq UNIQUE (stop_id);
      EXCEPTION
        WHEN SQLSTATE '42P07' THEN
          NULL;
      END
      $$;
    `;
  }
}
