import { Command } from "cliffy/command/mod.ts";
import { colors } from "cliffy/ansi/colors.ts";
import Spinner from "cli_spinners/mod.ts";
import {
    getDepartures,
    getNotifications,
    getRoutes,
    getStation,
} from "./api/mod.ts";
import {
    prepareDepartures,
    prepareNotifications,
    prepareRoutes,
} from "./prep.ts";
import { departuresTable, notificationsTable, routesTable } from "./tables.ts";

export const notifications = new Command()
    .description(
        "Show notifications for specific lines or all notifications if no arguments are given.",
    )
    .arguments("[lines...]")
    .option(
        "-f, --filter <filter...>",
        "Filter for specific lines",
    )
    .action(async (_, lines) => {
        const spinner = Spinner.getInstance();
        spinner.start("Fetching Notifications...");
        const notifications = await getNotifications();
        spinner.stop();

        let nots;
        if (lines) {
            nots = prepareNotifications(notifications, lines);
        } else {
            nots = prepareNotifications(notifications);
        }

        if (nots.length === 0) {
            console.log("\n  No notifications");
        } else {
            const nTable = await notificationsTable(nots);

            console.log("\n  Notifications\n");
            nTable.render();
        }
    });

export const departures = new Command()
    .description("Show Departures")
    .arguments("<stationName>")
    .action(async (_, stationName) => {
        const spinner = Spinner.getInstance();
        spinner.start("Fetching Departures...");

        const station = await getStation(stationName);
        let departures = await getDepartures(station);

        spinner.stop();
        departures = prepareDepartures(departures);

        const dTable = await departuresTable(departures);

        console.log(`\n  Departures for ${colors.bold(station.name)}\n`);
        dTable.render();
    });

export const routes = new Command()
    .description("Show Routes")
    .arguments("<fromStation> <toStation>")
    .option(
        "-t, --time <time>",
        "Specify a time for the departure or arrival if -a",
    )
    .option(
        "-a, --arrival [arrival:boolean]",
        "If set, --time specifies the arrival time",
        { default: false, depends: ["time"] },
    )
    .action(async ({ time, arrival }, fromStation, toStation) => {
        const newTime = new Date();
        if (time) {
            const [hours, minutes] = time.split(":").map((x) => parseInt(x));
            newTime.setHours(hours);
            newTime.setMinutes(minutes);
        }

        const spinner = Spinner.getInstance();
        spinner.start("Fetching Routes...");
        const connections = await getRoutes(
            await getStation(fromStation),
            await getStation(toStation),
            { epochTime: newTime, arrival: arrival },
        );
        const routes = await prepareRoutes(connections);
        const rTable = await routesTable(routes);
        spinner.setText("Success");
        spinner.stop();

        console.log(
            `\n  Routes for ${colors.bold(routes[0].fromName)}, ${
                colors.italic(routes[0].fromPlace)
            } ➜ ${colors.bold(routes[0].toName)}, ${
                colors.italic(routes[0].toPlace)
            }
            `,
        );
        rTable.render();
    });

async function showMap(link: string) {
    const os = Deno.build.os
    let util;
    if (os === 'linux') {
        util = "xdg-open" 
    } else if (os === 'darwin') {
        util = "open"
    } else {
        util = "start"
    }
    const p = Deno.run({cmd: [util, link]})
    await p.status()
}

export const map = new Command()
    .description("Show Map in Browser")
    .option("-r, --region [region]", "Show the regional map")
    .option("-t, --tram [tram]", "Show the tram map")
    .option("-n, --night [night]", "Show the map for night lines")
    .action(({region, tram, night}) => {
        console.log(region)
        if (region) {
            showMap("https://www.mvg.de/dam/jcr:88249232-e41c-417b-b976-1945c5ade867/netz-tarifplan.pdf")
        } else if (tram) {
            showMap("https://www.mvg.de/dam/jcr:1164570c-cc5f-4b6d-a007-e99c32b00905/tramnetz.pdf")
        } else if (night) {
            showMap("https://www.mvg.de/dam/jcr:fe99cd93-ef1c-483c-a715-f421da96382b/nachtliniennetz.pdf")
        } else {
            showMap("https://www.mvg.de/dam/jcr:88249232-e41c-417b-b976-1945c5ade867/netz-tarifplan.pdf")
        }
    })
