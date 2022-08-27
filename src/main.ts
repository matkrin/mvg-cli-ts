import { Command } from "cliffy/command/mod.ts";
import { notifications, departures, routes } from "./commands.ts"


new Command()
    .name("mvg")
    .version("0.1.0")
    .description("Command line interface for MVG services")
    .command("n notifications", notifications)
    .command("d departures", departures)
    .command("r routes", routes)
    .parse(Deno.args);
