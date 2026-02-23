import {
  Table,
  type Col,
  type RealtimeCtx as Ctx,
  type Row,
} from "@/lib/table";
import { decodeGtfsRt } from "@/lib/utils";
import type { Sql } from "postgres";

export class TripUpdates extends Table<Ctx> {
  override name = "rt_trip_updates";
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
      name: "trip_id",
      type: "TEXT",
      loader: ({ row }) => row.trip.tripId,
    },
    {
      name: "trip_route_id",
      type: "TEXT",
      loader: ({ row }) => row.trip.routeId,
    },
    {
      name: "trip_direction_id",
      type: "INTEGER",
      loader: ({ row }) => row.trip.directionId,
    },
    {
      name: "trip_start_time",
      type: "INTERVAL",
      loader: ({ row }) => row.trip.startTime,
    },
    {
      name: "trip_schedule_relationship",
      type: "TEXT",
      loader: ({ row }) => row.trip.scheduleRelationship,
    },
    {
      name: "trip_start_date",
      type: "DATE",
      loader: ({ row }) => row.trip.startDate,
    },
    {
      name: "vehicle_id",
      type: "TEXT",
      loader: ({ row }) => row.vehicle?.id,
    },
    {
      name: "vehicle_label",
      type: "TEXT",
      loader: ({ row }) => row.vehicle?.label,
    },
    {
      name: "vehicle_license_plate",
      type: "TEXT",
      loader: ({ row }) => row.vehicle?.licensePlate,
    },
    {
      name: "timestamp",
      type: "BIGINT",
      loader: ({ row }) => (row.timestamp ? Number(row.timestamp) : null),
    },
    {
      name: "delay",
      type: "INTEGER",
      loader: ({ row }) => row.delay,
    },
    {
      name: "trip_properties",
      type: "JSON",
      loader: ({ row }) =>
        row.tripProperties ? JSON.stringify(row.tripProperties) : null,
    },
  ];

  protected override async *_source(file: Bun.BunFile): AsyncIterable<Row> {
    const realtime = await decodeGtfsRt(file);

    const rows = realtime.entity.flatMap((entity: any) =>
      entity.tripUpdate
        ? [
            {
              ...entity.tripUpdate,
              _timestamp: realtime.header.timestamp,
              _entity_id: entity.id,
            },
          ]
        : [],
    );

    for (const row of rows) {
      yield row as Row;
    }
  }

  protected override async _afterCreate(sql: Sql, ctx: Ctx): Promise<void> {
    await sql`
      DO $$
      BEGIN
        ALTER TABLE ${sql(ctx.opts.schema)}.rt_trip_updates
          ADD CONSTRAINT rt_trip_updates_pkey
          PRIMARY KEY (_import_id, _entity_id);
      EXCEPTION
        WHEN SQLSTATE '42710' THEN
          NULL;
        WHEN SQLSTATE '42P16' THEN
          NULL;
      END
      $$;
    `;
  }
}
