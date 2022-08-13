import { Command } from "cliffy/command/mod.ts";
import { renderDepartures, renderNotifications, renderRoutes } from "./cli.ts";

new Command()
    .name("mvg")
    .version("0.1.0")
    .description("Command line interface for MVG services")
    .command("n notifications", "Show Notifications")
    .action(async () => await renderNotifications())
    .command("d departures", "Show Departures")
    .arguments("<stationName>")
    .action(async (_, stationName) => await renderDepartures(stationName))
    .command("r routes", "Show Routes")
    .arguments("<fromStation> <toStation>")
    .action(async (_, fromStation, toStation) =>
        await renderRoutes(fromStation, toStation)
    )
    .parse(Deno.args);
