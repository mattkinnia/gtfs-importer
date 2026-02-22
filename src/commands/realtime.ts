import { runImportTask } from "@/lib/realtime";
import meow from "meow";
import postgres from "postgres";

export const realtimeCommand = async (argv: string[]) => {
  const cli = meow(
    `
    Usage
      $ gtfs-importer realtime [options] <path>

    Options
      --schema,       -s  PostgreSQL database schema.
      --delete-stale, -d  Delete stale database rows (keep the latest rows only).

    Examples
      $ gtfs-importer realtime --schema gtfs path/to/realtime.pb
    `,
    {
      importMeta: import.meta,
      argv,
      flags: {
        schema: {
          type: "string",
          shortFlag: "s",
          isRequired: true,
        },
        deleteStale: {
          type: "boolean",
          shortFlag: "d",
          default: false,
        },
      },
    },
  );

  const path = cli.input[0];

  if (!path) {
    cli.showHelp(1);
    return;
  }

  const file = Bun.file(path);

  if (!(await file.exists())) {
    throw new Error("File does not exist");
  }

  console.info(`Importing to '${cli.flags.schema}'...`);

  const sql = postgres();

  try {
    await sql.begin(async (tx) => {
      await runImportTask(tx, {
        path: path,
        opts: {
          schema: cli.flags.schema,
          deleteStale: cli.flags.deleteStale,
        },
      });
    });
  } finally {
    await sql.end();
  }

  console.info("✓ Done");
};
