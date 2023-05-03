import { Command } from "cliffy/command/mod.ts";
import { departures, map, notifications, routes } from "./commands.ts";

new Command()
    .name("mvg")
    .version("0.1.0")
    .description("Command line interface for MVG services")
    .command("n notifications", notifications)
    .command("d departures", departures)
    .command("r routes", routes)
    .command("m map", map)
    .parse(Deno.args);
