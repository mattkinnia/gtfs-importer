import { Table, type Col, type ScheduleCtx as Ctx } from "@/lib/table";

export class Translations extends Table<Ctx> {
  override name = "translations";
  override cols: Col<Ctx>[] = [
    {
      name: "table_name",
      type: "TEXT",
      loader: ({ row }) => row.table_name,
    },
    {
      name: "field_name",
      type: "TEXT",
      loader: ({ row }) => row.field_name,
    },
    {
      name: "language",
      type: "TEXT",
      loader: ({ row }) => row.language,
    },
    {
      name: "translation",
      type: "TEXT",
      loader: ({ row }) => row.translation,
    },
    {
      name: "record_id",
      type: "TEXT",
      loader: ({ row }) => row.record_id,
    },
    {
      name: "record_sub_id",
      type: "TEXT",
      loader: ({ row }) => row.record_sub_id,
    },
    {
      name: "field_value",
      type: "TEXT",
      loader: ({ row }) => row.field_value,
    },
  ];
}
