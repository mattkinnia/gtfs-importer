import { Table, type Col } from "@/lib/table";

export class StopTimes extends Table {
  override name = "stop_times";
  override cols: Col[] = [
    {
      name: "trip_id",
      type: "TEXT",
      loader: ({ row }) => row.trip_id,
    },
    {
      name: "arrival_time",
      type: "INTERVAL",
      loader: ({ row }) => row.arrival_time,
    },
    {
      name: "departure_time",
      type: "INTERVAL",
      loader: ({ row }) => row.departure_time,
    },
    {
      name: "stop_id",
      type: "TEXT",
      loader: ({ row }) => row.stop_id,
    },
    {
      name: "location_group_id",
      type: "TEXT",
      loader: ({ row }) => row.location_group_id,
    },
    {
      name: "location_id",
      type: "TEXT",
      loader: ({ row }) => row.location_id,
    },
    {
      name: "stop_sequence",
      type: "INTEGER",
      loader: ({ row }) => row.stop_sequence,
    },
    {
      name: "stop_headsign",
      type: "TEXT",
      loader: ({ row }) => row.stop_headsign,
    },
    {
      name: "start_pickup_drop_off_window",
      type: "INTERVAL",
      loader: ({ row }) => row.start_pickup_drop_off_window,
    },
    {
      name: "end_pickup_drop_off_window",
      type: "INTERVAL",
      loader: ({ row }) => row.end_pickup_drop_off_window,
    },
    {
      name: "pickup_type",
      type: "INTEGER",
      loader: ({ row }) => (!row.pickup_type ? "0" : row.pickup_type),
    },
    {
      name: "drop_off_type",
      type: "INTEGER",
      loader: ({ row }) => (!row.drop_off_type ? "0" : row.drop_off_type),
    },
    {
      name: "continuous_pickup",
      type: "INTEGER",
      loader: ({ row }) => row.continuous_pickup,
    },
    {
      name: "continuous_drop_off",
      type: "INTEGER",
      loader: ({ row }) => row.continuous_drop_off,
    },
    {
      name: "shape_dist_traveled",
      type: "DOUBLE PRECISION",
      loader: ({ row }) => row.shape_dist_traveled,
    },
    {
      name: "timepoint",
      type: "INTEGER",
      loader: ({ row }) => row.timepoint,
    },
    {
      name: "pickup_booking_rule_id",
      type: "TEXT",
      loader: ({ row }) => row.pickup_booking_rule_id,
    },
    {
      name: "drop_off_booking_rule_id",
      type: "TEXT",
      loader: ({ row }) => row.drop_off_booking_rule_id,
    },
  ];
}
