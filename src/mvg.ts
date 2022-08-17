import { Command } from "cliffy/command/mod.ts";
import { renderDepartures, renderNotifications, renderRoutes } from "./cli.ts";

const notifications = new Command()
    .description("Show Notifications")
    .action(async () => await renderNotifications());

const departures = new Command()
    .description("Show Departures")
    .arguments("<stationName>")
    .action(async (_, stationName) => await renderDepartures(stationName));

const routes = new Command()
    .description("Show Routes")
    .arguments("<fromStation> <toStation>")
    .action(async (_, fromStation, toStation) =>
        await renderRoutes(fromStation, toStation)
    );

new Command()
    .name("mvg")
    .version("0.1.0")
    .description("Command line interface for MVG services")
    .command("n notifications", notifications)
    .command("d departures", departures)
    .command("r routes", routes)
    .parse(Deno.args);
