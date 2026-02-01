import { Table, type Col, type Ctx } from "@/lib/table";
import type { Sql } from "postgres";

export class Shapes extends Table {
  override name = "shapes";
  override cols: Col[] = [
    {
      name: "shape_id",
      type: "TEXT",
      loader: ({ row }) => row.shape_id,
    },
    {
      name: "shape_pt_lat",
      type: "DOUBLE PRECISION",
      loader: ({ row }) => row.shape_pt_lat,
    },
    {
      name: "shape_pt_lon",
      type: "DOUBLE PRECISION",
      loader: ({ row }) => row.shape_pt_lon,
    },
    {
      name: "shape_pt_sequence",
      type: "INTEGER",
      loader: ({ row }) => row.shape_pt_sequence,
    },
    {
      name: "shape_dist_traveled",
      type: "DOUBLE PRECISION",
      loader: ({ row }) => row.shape_dist_traveled,
    },
  ];

  protected override async _afterCreate(sql: Sql, ctx: Ctx): Promise<void> {
    await sql`
      ALTER TABLE ${sql(ctx.opts.schema)}.shapes
      ADD COLUMN IF NOT EXISTS shape_pt POINT GENERATED ALWAYS AS (
        POINT(shape_pt_lon, shape_pt_lat)
      ) STORED;
    `;
  }
}
