import { Table, type Col, type Ctx, type Row } from "@/lib/table";
import { decodeGtfsRt } from "@/lib/utils";
import type { Sql } from "postgres";

export class TripUpdatesStopTimeUpdates extends Table {
  override name = "rt_trip_updates_stop_time_updates";
  override cols: Col[] = [
    {
      name: "_ts",
      type: "BIGINT",
      loader: ({ row }) => row._ts,
    },
    {
      name: "_id",
      type: "TEXT",
      loader: ({ row }) => row._id,
    },
    {
      name: "stop_sequence",
      type: "INTEGER",
      loader: ({ row }) => row.stopSequence,
    },
    {
      name: "stop_id",
      type: "TEXT",
      loader: ({ row }) => row.stopId,
    },
    {
      name: "arrival_delay",
      type: "INTEGER",
      loader: ({ row }) => row.arrival?.delay,
    },
    {
      name: "arrival_time",
      type: "INTEGER",
      loader: ({ row }) =>
        row.arrival?.time ? Number(row.arrival.time) : null,
    },
    {
      name: "arrival_uncertainty",
      type: "INTEGER",
      loader: ({ row }) => row.arrival?.uncertainty,
    },
    {
      name: "departure_delay",
      type: "INTEGER",
      loader: ({ row }) => row.departure?.delay,
    },
    {
      name: "departure_time",
      type: "INTEGER",
      loader: ({ row }) =>
        row.departure?.time ? Number(row.departure.time) : null,
    },
    {
      name: "departure_uncertainty",
      type: "INTEGER",
      loader: ({ row }) => row.departure?.uncertainty,
    },
    {
      name: "schedule_relationship",
      type: "TEXT",
      loader: ({ row }) => row.scheduleRelationship,
    },
    {
      name: "stop_time_properties",
      type: "JSON",
      loader: ({ row }) =>
        row.stopTimeProperties ? JSON.stringify(row.stopTimeProperties) : null,
    },
  ];

  protected override async *_source(file: Bun.BunFile): AsyncIterable<Row> {
    const realtime = await decodeGtfsRt(file);

    const rows = realtime.entity.flatMap(
      (entity: any) =>
        entity.tripUpdate?.stopTimeUpdate?.map((row: any) => ({
          ...row,
          _ts: realtime.header.timestamp,
          _id: entity.id,
        })) ?? [],
    );

    for (const row of rows) {
      yield row as Row;
    }
  }

  protected override async _afterCreate(sql: Sql, ctx: Ctx): Promise<void> {
    await sql`
      DO $$
      BEGIN
        ALTER TABLE ${sql(ctx.opts.schema)}.rt_trip_updates_stop_time_updates
          ADD CONSTRAINT rt_trip_updates_stop_time_updates__ts__id_fkey
          FOREIGN KEY (_ts, _id)
          REFERENCES ${sql(ctx.opts.schema)}.rt_trip_updates (_ts, _id)
          ON UPDATE CASCADE
          ON DELETE CASCADE;
      EXCEPTION
        WHEN SQLSTATE '42710' THEN
          NULL;
      END
      $$;
    `;
  }
}
