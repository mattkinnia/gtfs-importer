import { runImportTask } from "@/lib/realtime";
import meow from "meow";
import postgres from "postgres";

export const realtimeCommand = async (argv: string[]) => {
  const cli = meow(
    `
    Usage
      $ gtfs-importer realtime [options] <path>

    Options
      --schema,  -s  PostgreSQL database schema.
      --id,      -i  Import ID.

    Examples
      $ gtfs-importer realtime --schema gtfs --id 1 path/to/realtime.pb
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
        id: {
          type: "string",
          shortFlag: "i",
          isRequired: true,
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
          ...cli.flags,
        },
      });
    });
  } finally {
    await sql.end();
  }

  console.info("✓ Done");
};
