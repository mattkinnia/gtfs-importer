import {
  Table,
  type Col,
  type RealtimeCtx as Ctx,
  type Row,
} from "@/lib/table";
import { decodeGtfsRt } from "@/lib/utils";
import type { Sql } from "postgres";

export class Alerts extends Table<Ctx> {
  override name = "rt_alerts";
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
      name: "active_period",
      type: "JSON",
      loader: ({ row }) =>
        row.activePeriod ? JSON.stringify(row.activePeriod) : null,
    },
    {
      name: "cause",
      type: "TEXT",
      loader: ({ row }) => row.cause,
    },
    {
      name: "effect",
      type: "TEXT",
      loader: ({ row }) => row.effect,
    },
    {
      name: "url",
      type: "JSON",
      loader: ({ row }) => (row.url ? JSON.stringify(row.url) : null),
    },
    {
      name: "header_text",
      type: "JSON",
      loader: ({ row }) =>
        row.headerText ? JSON.stringify(row.headerText) : null,
    },
    {
      name: "description_text",
      type: "JSON",
      loader: ({ row }) =>
        row.descriptionText ? JSON.stringify(row.descriptionText) : null,
    },
    {
      name: "tts_header_text",
      type: "JSON",
      loader: ({ row }) =>
        row.ttsHeaderText ? JSON.stringify(row.ttsHeaderText) : null,
    },
    {
      name: "tts_description_text",
      type: "JSON",
      loader: ({ row }) =>
        row.ttsDescriptionText ? JSON.stringify(row.ttsDescriptionText) : null,
    },
    {
      name: "severity_level",
      type: "TEXT",
      loader: ({ row }) => row.severityLevel,
    },
  ];

  protected override async *_source(file: Bun.BunFile): AsyncIterable<Row> {
    const realtime = await decodeGtfsRt(file);

    const rows = realtime.entity.flatMap((entity: any) =>
      entity.alert
        ? [
            {
              ...entity.alert,
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
        ALTER TABLE ${sql(ctx.opts.schema)}.rt_alerts
          ADD CONSTRAINT rt_alerts_pkey
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
