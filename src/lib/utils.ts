import { transit_realtime } from "gtfs-realtime-bindings";
import { Readable } from "node:stream";
import type { PendingQuery, Sql } from "postgres";
import * as tmp from "tmp-promise";
import unzipper from "unzipper";

export const unzipToTmp = async (file: Bun.BunFile) => {
  const { path, cleanup } = await tmp.dir({
    unsafeCleanup: true,
  });

  try {
    const directory = await unzipper.Open.custom({
      stream: (offset, length) => {
        const blob =
          length != null
            ? file.slice(offset, offset + length)
            : file.slice(offset);

        return Readable.from(blob.stream());
      },
      size: async () => file.size,
    });

    await directory.extract({
      path,
    });
  } catch (error) {
    await cleanup();
    throw error;
  }

  return { path, cleanup };
};

export const decodeGtfsRt = async (file: Bun.BunFile) => {
  const buff = await file.arrayBuffer();
  const feed = transit_realtime.FeedMessage.decode(new Uint8Array(buff));

  return transit_realtime.FeedMessage.toObject(feed, {
    enums: String,
    longs: Number,
    defaults: false,
  });
};

export const concatSql = (
  sql: Sql,
  fragments: PendingQuery<any>[],
  separator: PendingQuery<any> = sql`, `,
) =>
  fragments.reduce(
    (acc, frg, idx) => (idx === 0 ? frg : sql`${acc}${separator}${frg}`),
    sql<any>``,
  );
