import { realtimeCommand } from "@/commands/realtime";
import { scheduleCommand } from "@/commands/schedule";
import meow from "meow";

const cli = meow(
  `
  Usage
    $ gtfs-importer <command> [options]

  Commands
    realtime  Import a GTFS realtime feed
    schedule  Import a GTFS schedule feed

  Examples
    $ gtfs-importer realtime --schema gtfs path/to/realtime.pb
    $ gtfs-importer schedule --schema gtfs path/to/gtfs.zip
  `,
  {
    importMeta: import.meta,
  },
);

const rawArgv = process.argv.slice(2);
const command = rawArgv[0];

switch (command) {
  case "realtime":
    await realtimeCommand(rawArgv.slice(1));
    break;

  case "schedule":
    await scheduleCommand(rawArgv.slice(1));
    break;

  default:
    cli.showHelp(0);
    break;
}
