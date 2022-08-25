# mvg-cli

Command line interface for services of the Münchner Verkehrsgesellschaft.

There are three subcommands:

- `n` or `notifications` : Shows the notifications for the lines, provided 
    as argument(s). Given no argument, all notifications are shown. 
- `d` or `departures`: Shows all departures from the station that is 
    provided as an argument.
- `r` or `routes`: Excepts two arguments, the starting and the 
    destination station. As optional argument `-t` or `--time`, the departure 
    time can be specified in the format `hh:mm`. If the `-a` or `--arrival` 
    flag is additionally set, this time specifies the arrival time instead.
