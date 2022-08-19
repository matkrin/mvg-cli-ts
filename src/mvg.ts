import { Command } from "cliffy/command/mod.ts";
import {
    renderDepartures,
    renderNotifications,
    renderRoutes,
} from "./tables.ts";

const notifications = new Command()
    .description(
        "Show notifications for specific lines or all notifications if no arguments are given.",
    )
    .arguments("[lines...]")
    .action(async (_, lines) => await renderNotifications(lines));

const departures = new Command()
    .description("Show Departures")
    .arguments("<stationName>")
    .action(async (_, stationName) => await renderDepartures(stationName));

const routes = new Command()
    .description("Show Routes")
    .arguments("<fromStation> <toStation>")
    .option("-t, --time <time>", "Specify a time for the departure or arrival if -a")
    .option("-a, --arrival [arrival:boolean]", "If set, --time specifies the arrival time", { default: false, depends: ["time"] })
    .action(
        async ({time, arrival}, fromStation, toStation) => {
            const newTime = new Date();
            if (time) {
                const [hours, minutes] = time.split(":").map(x => parseInt(x));
                newTime.setHours(hours)
                newTime.setMinutes(minutes)
            }
            await renderRoutes(fromStation, toStation, {epochTime: newTime, arrival: arrival})
        }
    );

new Command()
    .name("mvg")
    .version("0.1.0")
    .description("Command line interface for MVG services")
    .command("n notifications", notifications)
    .command("d departures", departures)
    .command("r routes", routes)
    .parse(Deno.args);
