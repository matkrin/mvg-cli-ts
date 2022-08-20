import { Table } from "cliffy/table/mod.ts";
import { colors } from "cliffy/ansi/colors.ts";

import {
    getDepartures,
    getNotifications,
    getRoutes,
    getStation,
} from "./api/mod.ts";
import type {
    Connection,
    ConnectionPart,
    GetRoutesOptions,
    Notification,
} from "./api/mod.ts";
import {parseHTML, lineColor} from "./utils.ts"


function newTable(...columns: string[]) {
    const columnHeadings = columns.map((c) => colors.bold(c));
    return new Table().header(columnHeadings).maxColWidth(80).border(true);
}

function prepareNotifications(nots: Notification[]) {
    return nots.map((not) => {
        const lines = [...new Set(not.lines.map((l) => l.name))];
        const details = parseHTML(not.htmlText);
        const title = not.title;
        const from = not.activeDuration.fromDate.toLocaleDateString("de-DE");
        const to = not.activeDuration.toDate.toLocaleDateString("de-DE");
        const duration = `${from} - ${to}`;

        return { lines, details, title, duration };
    });
}

export async function renderNotifications(filter: string[] = []) {
    const notifications = await getNotifications();
    let nots = prepareNotifications(notifications);

    nots = filter.length != 0
        ? nots.filter((n) =>
            filter.some((f) => n.lines.includes(f.toUpperCase()))
        )
        : nots;

    const table = newTable("LINES", "DURATION", "DETAILS");
    nots.forEach((n) => {
        table.push([
            n.lines.toString(),
            n.duration,
            `${colors.bold(n.title)}\n\n${n.details}`,
        ]);
    });

    table.render();
}

export async function renderDepartures(stationName: string) {
    const station = await getStation(stationName);
    const deps = await getDepartures(station);

    const depTable = newTable(
        "DEPARTURE TIME",
        "IN",
        "LINE",
        "DESTINATION",
        "DELAY",
        "INFO",
    );

    for (let d of deps) {
        const timeDelta = Math.round(
            (d.departureTime.getTime() - new Date().getTime()) / 60000,
        );
        depTable.push([
            d.departureTime.toLocaleString("de-DE"),
            timeDelta,
            d.label,
            d.destination,
            d.delay,
            d.infoMessages.toString(),
        ]);
    }
    depTable.render();
}

function prepareInfo(cpList: ConnectionPart[]): string[] {
    const info = cpList.map((cp) => {
        if (cp.notifications != undefined) {
            return cp.notifications.map((n) => `${cp.label}: ${n.title}`).join(
                "\n",
            );
        } else if (cp.infoMessages != undefined) {
            return cp.infoMessages!.join("\n");
        } else {
            return "";
        }
    });
    return info.filter((i) => i != "");
}

function prepareLines(cpList: ConnectionPart[]): string[] {
    const lines: Set<string> = new Set();
    cpList.forEach((cp) =>
        cp.connectionPartType === "FOOTWAY"
            ? lines.add("walk")
            : lines.add(cp.label)
    );
    return [...lines].map(l => lineColor(l));
}

function prepareDelay(cpList: ConnectionPart[]): string[] {
    return cpList.map((cp) => {
        if (cp.delay != undefined) {
            return cp.delay.toString();
        } else {
            return "-";
        }
    });
}

async function prepareRoutes(connections: Connection[]) {
    return connections.map((c) => {
        const fromName = c.from.name;
        const toName = c.to.name;
        const depTime = c.departure.toLocaleTimeString("de-DE", {
            timeStyle: "short",
        });
        const arrivalTime = c.arrival.toLocaleTimeString("de-DE", {
            timeStyle: "short",
        });
        const timeDelta = Math.round(
            (c.departure.getTime() - new Date().getTime()) / 60000,
        );
        const duration = (c.arrival.getTime() - c.departure.getTime()) / 60000;
        const lines = prepareLines(c.connectionPartList);
        const delay = prepareDelay(c.connectionPartList);
        const info = prepareInfo(c.connectionPartList);

        return {
            fromName,
            toName,
            depTime,
            arrivalTime,
            timeDelta,
            duration,
            lines,
            delay,
            info,
        };
    });
}

export async function renderRoutes(
    startStation: string,
    endStation: string,
    options: GetRoutesOptions,
) {
    const opts = Object.assign(
        {
            epochTime: new Date(),
            arrival: false,
            sapTicket: true,
            includeUbahn: true,
            includeBus: true,
            includeTram: true,
            includeSBahn: true,
            includeTaxi: false,
        },
        options,
    );
    const fromStation = await getStation(startStation);
    const toStation = await getStation(endStation);
    const connections = await getRoutes(fromStation, toStation, opts);
    const routes = await prepareRoutes(connections);

    console.log(
        `\n  Routes for ${colors.bold(connections[0].from.name)}, ${
            colors.italic(
                connections[0].from.place,
            )
        } ➜ ${colors.bold(connections[0].to.name)}, ${
            colors.italic(
                connections[0].to.place,
            )
        }
        `,
    );
    const rTable = newTable(
        "TIME",
        "IN",
        "DURATION",
        "LINES",
        "DELAYS",
        "INFO",
    );
    for (let r of routes) {
        rTable.push([
            `${r.depTime} - ${r.arrivalTime}`,
            r.timeDelta.toString(),
            r.duration.toString(),
            r.lines.join("\n"),
            r.delay.join("\n"),
            r.info.join("\n"),
        ]);
    }
    rTable.render();
}
