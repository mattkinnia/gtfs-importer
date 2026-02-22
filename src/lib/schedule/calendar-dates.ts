import { Table, type Col, type ScheduleCtx as Ctx } from "@/lib/table";

export class CalendarDates extends Table<Ctx> {
  override name = "calendar_dates";
  override cols: Col<Ctx>[] = [
    {
      name: "service_id",
      type: "TEXT",
      loader: ({ row }) => row.service_id,
    },
    {
      name: "date",
      type: "DATE",
      loader: ({ row }) => row.date,
    },
    {
      name: "exception_type",
      type: "INTEGER",
      loader: ({ row }) => row.exception_type,
    },
  ];
}
