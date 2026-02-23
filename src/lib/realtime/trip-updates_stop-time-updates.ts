import {
  Table,
  type Col,
  type RealtimeCtx as Ctx,
  type Row,
} from "@/lib/table";
import { decodeGtfsRt } from "@/lib/utils";
import type { Sql } from "postgres";

export class TripUpdatesStopTimeUpdates extends Table<Ctx> {
  override name = "rt_trip_updates_stop_time_updates";
  override cols: Col<Ctx>[] = [
    {
      name: "_import_id",
      type: "TEXT",
      loader: ({ ctx }) => ctx.opts.id,
    },
    {
      name: "_entity_id",
      type: "TEXT",
      loader: ({ row }) => row._entity_id,
    },
    {
      name: "_timestamp",
      type: "BIGINT",
      loader: ({ row }) => row._timestamp,
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
          _timestamp: realtime.header.timestamp,
          _entity_id: entity.id,
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
          FOREIGN KEY (_import_id, _entity_id)
          REFERENCES ${sql(ctx.opts.schema)}.rt_trip_updates (_import_id, _entity_id)
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
