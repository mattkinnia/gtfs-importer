import type { RealtimeCtx as Ctx } from "@/lib/table";
import type { Sql } from "postgres";

// Tables
import { Alerts } from "./alerts";
import { AlertsInformedEntities } from "./alerts_informed-entities";
import { TripUpdates } from "./trip-updates";
import { TripUpdatesStopTimeUpdates } from "./trip-updates_stop-time-updates";
import { VehiclePositions } from "./vehicle-positions";

const tables = [
  {
    impl: new Alerts(),
  },
  {
    impl: new AlertsInformedEntities(),
  },
  {
    impl: new TripUpdates(),
  },
  {
    impl: new TripUpdatesStopTimeUpdates(),
  },
  {
    impl: new VehiclePositions(),
  },
] as const;

type Importable = (typeof tables)[number];

export const runImportTask = async (sql: Sql, cmd: Omit<Ctx, "mode">) => {
  const ctx: Ctx = { ...cmd, mode: "realtime" };

  await sql`CREATE SCHEMA IF NOT EXISTS ${sql(ctx.opts.schema)}`;

  const file = Bun.file(ctx.path);

  const phases = [
    async (table: Importable) => {
      await table.impl.create(sql, ctx);
    },
    async (table: Importable) => {
      await table.impl.import(sql, { ...ctx, file });
    },
  ];

  const runPhase = async (phase: (table: Importable) => Promise<void>) => {
    for (const table of tables) {
      await phase(table);
    }
  };

  for (const phase of phases) {
    await runPhase(phase);
  }
};
