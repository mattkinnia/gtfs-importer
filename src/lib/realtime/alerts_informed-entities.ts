import {
  Table,
  type Col,
  type RealtimeCtx as Ctx,
  type Row,
} from "@/lib/table";
import { decodeGtfsRt } from "@/lib/utils";
import type { Sql } from "postgres";

export class AlertsInformedEntities extends Table<Ctx> {
  override name = "rt_alerts_informed_entities";
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
      name: "agency_id",
      type: "TEXT",
      loader: ({ row }) => row.agencyId,
    },
    {
      name: "route_id",
      type: "TEXT",
      loader: ({ row }) => row.routeId,
    },
    {
      name: "route_type",
      type: "INTEGER",
      loader: ({ row }) => row.routeType,
    },
    {
      name: "direction_id",
      type: "INTEGER",
      loader: ({ row }) => row.directionId,
    },
    {
      name: "trip_id",
      type: "TEXT",
      loader: ({ row }) => row.trip?.tripId,
    },
    {
      name: "trip_route_id",
      type: "TEXT",
      loader: ({ row }) => row.trip?.routeId,
    },
    {
      name: "trip_direction_id",
      type: "INTEGER",
      loader: ({ row }) => row.trip?.directionId,
    },
    {
      name: "trip_start_time",
      type: "INTERVAL",
      loader: ({ row }) => row.trip?.startTime,
    },
    {
      name: "trip_schedule_relationship",
      type: "TEXT",
      loader: ({ row }) => row.trip?.scheduleRelationship,
    },
    {
      name: "trip_start_date",
      type: "DATE",
      loader: ({ row }) => row.trip?.startDate,
    },
    {
      name: "stop_id",
      type: "TEXT",
      loader: ({ row }) => row.stopId,
    },
  ];

  protected override async *_source(file: Bun.BunFile): AsyncIterable<Row> {
    const realtime = await decodeGtfsRt(file);

    const rows = realtime.entity.flatMap(
      (entity: any) =>
        entity.alert?.informedEntity?.map((row: any) => ({
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
        ALTER TABLE ${sql(ctx.opts.schema)}.rt_alerts_informed_entities
          ADD CONSTRAINT rt_alerts_informed_entities__ts__id_fkey
          FOREIGN KEY (_ts, _id)
          REFERENCES ${sql(ctx.opts.schema)}.rt_alerts (_ts, _id)
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
