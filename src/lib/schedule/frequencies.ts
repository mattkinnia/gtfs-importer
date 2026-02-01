import { Table, type Col } from "@/lib/table";

export class Frequencies extends Table {
  override name = "frequencies";
  override cols: Col[] = [
    {
      name: "trip_id",
      type: "TEXT",
      loader: ({ row }) => row.trip_id,
    },
    {
      name: "start_time",
      type: "INTERVAL",
      loader: ({ row }) => row.start_time,
    },
    {
      name: "end_time",
      type: "INTERVAL",
      loader: ({ row }) => row.end_time,
    },
    {
      name: "headway_secs",
      type: "INTEGER",
      loader: ({ row }) => row.headway_secs,
    },
    {
      name: "exact_times",
      type: "INTEGER",
      loader: ({ row }) => (!row.exact_times ? "0" : row.exact_times),
    },
  ];
}
