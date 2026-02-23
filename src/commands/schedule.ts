import { runImportTask } from "@/lib/schedule";
import { unzipToTmp } from "@/lib/utils";
import meow from "meow";
import postgres from "postgres";

export const scheduleCommand = async (argv: string[]) => {
  const cli = meow(
    `
    Usage
      $ gtfs-importer schedule [options] <path>

    Options
      --schema,  -s  PostgreSQL database schema.
      --id,      -i  Import ID.

    Examples
      $ gtfs-importer schedule --schema gtfs --id 1 path/to/gtfs.zip
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

  const tmp = await unzipToTmp(file);
  const sql = postgres();

  try {
    await sql.begin(async (tx) => {
      await runImportTask(tx, {
        path: tmp.path,
        opts: {
          ...cli.flags,
        },
      });
    });
  } finally {
    await tmp.cleanup();
    await sql.end();
  }

  console.info("✓ Done");
};
