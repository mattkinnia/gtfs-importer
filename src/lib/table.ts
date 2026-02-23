import { concatSql } from "@/lib/utils";
import { parse, stringify, transform } from "csv";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import type { Sql } from "postgres";

export type RealtimeOpts = {
  schema: string;
  id: string;
};

export type ScheduleOpts = {
  schema: string;
  id: string;
};

export type ImportOpts =
  | { mode: "realtime"; opts: RealtimeOpts }
  | { mode: "schedule"; opts: ScheduleOpts };

export type Ctx = ImportOpts & {
  path: string;
};

export type RealtimeCtx = Extract<Ctx, { mode: "realtime" }>;
export type ScheduleCtx = Extract<Ctx, { mode: "schedule" }>;

export type Row = Record<string, any>;

export type Col<CtxT extends Ctx = Ctx> = {
  name: string;
  type: string;
  loader: ({
    row,
    ctx,
  }: {
    row: Row;
    ctx: CtxT;
  }) => string | number | null | undefined;
};

export abstract class Table<CtxT extends Ctx = Ctx> {
  abstract readonly name: string;
  abstract readonly cols: readonly Col<CtxT>[];

  async create(sql: Sql, ctx: CtxT) {
    const cols = this.cols.map(
      (col) => sql`${sql(col.name)} ${sql.unsafe(col.type)}`,
    );

    await sql`
      CREATE TABLE IF NOT EXISTS ${sql(ctx.opts.schema)}.${sql(this.name)} (${concatSql(sql, cols)});
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS ${sql(`${this.name}_import_id_idx`)}
      ON ${sql(ctx.opts.schema)}.${sql(this.name)} (_import_id);
    `;

    await this._afterCreate(sql, ctx);
  }

  async import(sql: Sql, ctx: CtxT & { file: Bun.BunFile }) {
    await sql`
      DELETE FROM ${sql(ctx.opts.schema)}.${sql(this.name)}
      WHERE _import_id = ${ctx.opts.id};
    `;

    const reader = Readable.from(this._source(ctx.file));

    const writer = await sql`
      COPY ${sql(ctx.opts.schema)}.${sql(this.name)} (${concatSql(
        sql,
        this.cols.map((col) => sql`${sql(col.name)}`),
      )})
      FROM stdin WITH (FORMAT csv, NULL '')
    `.writable();

    await pipeline(
      reader,
      transform((row: Row) => this.cols.map((col) => col.loader({ row, ctx }))),
      stringify(),
      writer,
    );

    await this._afterImport(sql, ctx);
  }

  protected async *_source(file: Bun.BunFile): AsyncIterable<Row> {
    const parser = Readable.from(file.stream()).pipe(
      parse({ bom: true, columns: true }),
    );

    for await (const row of parser) {
      yield row as Row;
    }
  }

  protected async _afterCreate(sql: Sql, ctx: CtxT) {
    // Default no-op
  }

  protected async _afterImport(sql: Sql, ctx: CtxT) {
    // Default no-op
  }
}
