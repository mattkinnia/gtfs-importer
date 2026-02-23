import { Table, type Col, type ScheduleCtx as Ctx } from "@/lib/table";

export class FeedInfo extends Table<Ctx> {
  override name = "feed_info";
  override cols: Col<Ctx>[] = [
    {
      name: "_import_id",
      type: "TEXT",
      loader: ({ ctx }) => ctx.opts.id,
    },
    {
      name: "feed_publisher_name",
      type: "TEXT",
      loader: ({ row }) => row.feed_publisher_name,
    },
    {
      name: "feed_publisher_url",
      type: "TEXT",
      loader: ({ row }) => row.feed_publisher_url,
    },
    {
      name: "feed_lang",
      type: "TEXT",
      loader: ({ row }) => row.feed_lang,
    },
    {
      name: "default_lang",
      type: "TEXT",
      loader: ({ row }) => row.default_lang,
    },
    {
      name: "feed_start_date",
      type: "DATE",
      loader: ({ row }) => row.feed_start_date,
    },
    {
      name: "feed_end_date",
      type: "DATE",
      loader: ({ row }) => row.feed_end_date,
    },
    {
      name: "feed_version",
      type: "TEXT",
      loader: ({ row }) => row.feed_version,
    },
    {
      name: "feed_contact_email",
      type: "TEXT",
      loader: ({ row }) => row.feed_contact_email,
    },
    {
      name: "feed_contact_url",
      type: "TEXT",
      loader: ({ row }) => row.feed_contact_url,
    },
  ];
}
