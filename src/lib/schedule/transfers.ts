import { Table, type Col, type ScheduleCtx as Ctx } from "@/lib/table";

export class Transfers extends Table<Ctx> {
  override name = "transfers";
  override cols: Col<Ctx>[] = [
    {
      name: "from_stop_id",
      type: "TEXT",
      loader: ({ row }) => row.from_stop_id,
    },
    {
      name: "to_stop_id",
      type: "TEXT",
      loader: ({ row }) => row.to_stop_id,
    },
    {
      name: "from_route_id",
      type: "TEXT",
      loader: ({ row }) => row.from_route_id,
    },
    {
      name: "to_route_id",
      type: "TEXT",
      loader: ({ row }) => row.to_route_id,
    },
    {
      name: "from_trip_id",
      type: "TEXT",
      loader: ({ row }) => row.from_trip_id,
    },
    {
      name: "to_trip_id",
      type: "TEXT",
      loader: ({ row }) => row.to_trip_id,
    },
    {
      name: "transfer_type",
      type: "INTEGER",
      loader: ({ row }) => (!row.transfer_type ? "0" : row.transfer_type),
    },
    {
      name: "min_transfer_time",
      type: "INTEGER",
      loader: ({ row }) => row.min_transfer_time,
    },
  ];
}
