import type { Ctx } from "@/lib/table";
import type { Sql } from "postgres";
import { join } from "node:path";

// Tables
import { Agency } from "./agency";
import { Attributions } from "./attributions";
import { Calendar } from "./calendar";
import { CalendarDates } from "./calendar-dates";
import { FeedInfo } from "./feed-info";
import { Frequencies } from "./frequencies";
import { Levels } from "./levels";
import { Pathways } from "./pathways";
import { Routes } from "./routes";
import { Shapes } from "./shapes";
import { StopTimes } from "./stop-times";
import { Stops } from "./stops";
import { Transfers } from "./transfers";
import { Translations } from "./translations";
import { Trips } from "./trips";

const tables = [
  {
    file: "agency.txt",
    impl: new Agency(),
  },
  {
    file: "attributions.txt",
    impl: new Attributions(),
  },
  {
    file: "calendar.txt",
    impl: new Calendar(),
  },
  {
    file: "calendar_dates.txt",
    impl: new CalendarDates(),
  },
  {
    file: "feed_info.txt",
    impl: new FeedInfo(),
  },
  {
    file: "frequencies.txt",
    impl: new Frequencies(),
  },
  {
    file: "levels.txt",
    impl: new Levels(),
  },
  {
    file: "pathways.txt",
    impl: new Pathways(),
  },
  {
    file: "routes.txt",
    impl: new Routes(),
  },
  {
    file: "shapes.txt",
    impl: new Shapes(),
  },
  {
    file: "stop_times.txt",
    impl: new StopTimes(),
  },
  {
    file: "stops.txt",
    impl: new Stops(),
  },
  {
    file: "transfers.txt",
    impl: new Transfers(),
  },
  {
    file: "translations.txt",
    impl: new Translations(),
  },
  {
    file: "trips.txt",
    impl: new Trips(),
  },
] as const;

type Importable = (typeof tables)[number];

export const runImportTask = async (sql: Sql, ctx: Ctx) => {
  await sql`CREATE SCHEMA IF NOT EXISTS ${sql(ctx.opts.schema)}`;

  const phases = [
    async (table: Importable) => {
      await table.impl.create(sql, ctx);
    },
    async (table: Importable) => {
      const file = Bun.file(join(ctx.path, table.file));

      if (!(await file.exists())) {
        return;
      }

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
