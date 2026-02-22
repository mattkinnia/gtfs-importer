import {
  Table,
  type Col,
  type RealtimeCtx as Ctx,
  type Row,
} from "@/lib/table";
import { decodeGtfsRt } from "@/lib/utils";
import type { Sql } from "postgres";

export class VehiclePositions extends Table<Ctx> {
  override name = "rt_vehicle_positions";
  override cols: Col<Ctx>[] = [
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
      name: "trip_id",
      type: "TEXT",
      loader: ({ row }) => row.trip?.tripId,
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
      name: "position_latitude",
      type: "DOUBLE PRECISION",
      loader: ({ row }) => row.position?.latitude,
    },
    {
      name: "position_longitude",
      type: "DOUBLE PRECISION",
      loader: ({ row }) => row.position?.longitude,
    },
    {
      name: "position_bearing",
      type: "DOUBLE PRECISION",
      loader: ({ row }) => row.position?.bearing,
    },
    {
      name: "position_odometer",
      type: "INTEGER",
      loader: ({ row }) => row.position?.odometer,
    },
    {
      name: "position_speed",
      type: "DOUBLE PRECISION",
      loader: ({ row }) => row.position?.speed,
    },
    {
      name: "current_stop_sequence",
      type: "INTEGER",
      loader: ({ row }) => row.currentStopSequence,
    },
    {
      name: "stop_id",
      type: "TEXT",
      loader: ({ row }) => row.stopId,
    },
    {
      name: "current_status",
      type: "TEXT",
      loader: ({ row }) => row.currentStatus,
    },
    {
      name: "timestamp",
      type: "BIGINT",
      loader: ({ row }) => (row.timestamp ? Number(row.timestamp) : null),
    },
    {
      name: "congestion_level",
      type: "TEXT",
      loader: ({ row }) => row.congestionLevel,
    },
    {
      name: "occupancy_status",
      type: "TEXT",
      loader: ({ row }) => row.occupancyStatus,
    },
    {
      name: "occupancy_percentage",
      type: "INTEGER",
      loader: ({ row }) => row.occupancyPercentage,
    },
    {
      name: "multi_carriage_details",
      type: "JSON",
      loader: ({ row }) =>
        row.multiCarriageDetails
          ? JSON.stringify(row.multiCarriageDetails)
          : null,
    },
  ];

  protected override async *_source(file: Bun.BunFile): AsyncIterable<Row> {
    const realtime = await decodeGtfsRt(file);

    const rows = realtime.entity.flatMap((entity: any) =>
      entity.vehicle
        ? [
            {
              ...entity.vehicle,
              _ts: realtime.header.timestamp,
              _id: entity.id,
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
      ALTER TABLE ${sql(ctx.opts.schema)}.rt_vehicle_positions
      ADD COLUMN IF NOT EXISTS position_pt POINT GENERATED ALWAYS AS (
        POINT(position_longitude, position_latitude)
      ) STORED;
    `;

    await sql`
      DO $$
      BEGIN
        ALTER TABLE ${sql(ctx.opts.schema)}.rt_vehicle_positions
          ADD CONSTRAINT rt_vehicle_positions_pkey
          PRIMARY KEY (_ts, _id);
      EXCEPTION
        WHEN SQLSTATE '42710' THEN
          NULL;
        WHEN SQLSTATE '42P16' THEN
          NULL;
      END
      $$;
    `;
  }

  protected override async _afterImport(sql: Sql, ctx: Ctx): Promise<void> {
    if (ctx.opts.deleteStale) {
      await sql`
        WITH max_ts AS (
          SELECT MAX(_ts) AS value
          FROM ${sql(ctx.opts.schema)}.rt_vehicle_positions
        )
        DELETE FROM ${sql(ctx.opts.schema)}.rt_vehicle_positions t
        USING max_ts
        WHERE t._ts < max_ts.value;
      `;
    }
  }
}
