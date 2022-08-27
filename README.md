# mvg-cli

Command line interface for services of the Münchner Verkehrsgesellschaft.

## Installation

[Deno](https://deno.land) is required to run the program.
Then, you can install it from the projects root directory with:

```bash
$ deno install --allow-net --allow-run -n mvg src/main.ts
```

This installs the `mvg` command, as long as `~/.deno/bin` is added to your
`$PATH`.


## Usage

To use the mvg-cli, type `mvg` followed by a subcommand:

- `n` or `notifications` : Shows the notifications for the lines, provided 
    as argument(s). Given no argument, all notifications are shown. 
- `d` or `departures`: Shows all departures from the station that is 
    provided as an argument.
- `r` or `routes`: Excepts two arguments, the starting and the 
    destination station. As optional argument `-t` or `--time`, the departure 
    time can be specified in the format `hh:mm`. If the `-a` or `--arrival` 
    flag is additionally set, this time specifies the arrival time instead.
- `m` or `map`: By default the city map for MVG-lines gets opened in the default
    browser. With one of the additional flags `-r` / `--region`, `-t` / `--tram`
    or `-n` / `--night`, those maps get opened, respectively.

For help use
```bash
$ mvg -h
```
