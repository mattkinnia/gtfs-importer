# `gtfs-importer`

A command-line utility for importing [GTFS](https://gtfs.org) feeds into [PostgreSQL](https://postgresql.org).

## Getting Started

### Compile from Source

### Install

Requires [Bun](https://bun.sh) 1.3.5+.

```bash
bun install
```

### Build

```bash
bun run build
```

A compiled binary is written to `dist/gtfs-importer`.

## Commands

### `realtime`

Import a [GTFS Realtime](https://gtfs.org/documentation/realtime/reference) feed.

```bash
Usage
  $ gtfs-importer realtime [options] <path>

Options
  --schema, -s  PostgreSQL database schema (default: public).

Examples
  $ gtfs-importer realtime --schema gtfs path/to/realtime.pb
```

The following GTFS Realtime entities are supported:

- `TripUpdate`
- `VehiclePosition`
- `Alert`

### `schedule`

Import a [GTFS Schedule](https://gtfs.org/documentation/schedule/reference) feed.

```bash
Usage
  $ gtfs-importer schedule [options] <path>

Options
  --schema, -s  PostgreSQL database schema (default: public).

Examples
  $ gtfs-importer schedule --schema gtfs path/to/gtfs.zip
```

The following GTFS Schedule files are supported:

- `agency.txt`
- `attributions.txt`
- `calendar.txt`
- `calendar_dates.txt`
- `feed_info.txt`
- `frequencies.txt`
- `levels.txt`
- `pathways.txt`
- `routes.txt`
- `shapes.txt`
- `stop_times.txt`
- `stops.txt`
- `transfers.txt`
- `translations.txt`
- `trips.txt`

## PostgreSQL

`gtfs-importer` works with standard PostgreSQL, so it can connect to an existing database without custom drivers or extensions.

### Connecting

PostgreSQL connections are configured using the standard `PG*` environment variables. This makes `gtfs-importer` compatible with common PostgreSQL tooling and setups.

## S3-compatible Storage

`gtfs-importer` can import feeds directly from S3-compatible storage (such as AWS S3, Cloudflare R2 and more).

S3-compatible storage providers are configured using the standard `S3*` environment variables. When the environment variables are set, you can use `s3://` prefixed paths.

### Examples

```bash
$ gtfs-importer realtime --schema gtfs s3://path/to/realtime.pb
```
```bash
$ gtfs-importer schedule --schema gtfs s3://path/to/gtfs.zip
```

## GTFS Validation

`gtfs-importer` does not validate feeds against the GTFS specification. Data is imported on an **as-is** basis.

It is strongly recommended that feeds are validated prior to import using an external GTFS validation tool, such as the [Canonical GTFS Schedule Validator](https://github.com/MobilityData/gtfs-validator).
