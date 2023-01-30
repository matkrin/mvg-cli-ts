import { Table } from "cliffy/table/mod.ts";
import { colors } from "cliffy/ansi/colors.ts";
import type { Departure } from "./api/mod.ts";
import type { PreparedNotification, PreparedRoute } from "./prep.ts";

function newTable(...columns: string[]) {
    const columnHeadings = columns.map((c) => colors.bold(c));
    return new Table().header(columnHeadings).maxColWidth(80).border(true);
}

export function notificationsTable(
    notifications: PreparedNotification[],
) {
    const table = newTable("LINES", "DURATION", "DETAILS");

    notifications.forEach((n) => {
        table.push([
            n.lines.toString(),
            n.duration,
            `${colors.bold(n.title)}\n\n${n.details}`,
        ]);
    });

    return table;
}

export function departuresTable(departures: Departure[]) {
    const table = newTable(
        "DEPARTURE TIME",
        "IN",
        "LINE",
        "DESTINATION",
        "DELAY",
        "INFO",
    );

    for (const d of departures) {
        const timeDelta = Math.round(
            (d.departureTime.getTime() - new Date().getTime()) / 60000,
        );
        table.push([
            d.departureTime.toLocaleString("de-DE"),
            timeDelta,
            d.label,
            d.destination,
            d.delay ? d.delay : "-",
            d.infoMessages.toString(),
        ]);
    }
    return table;
}

export function routesTable(routes: PreparedRoute[]) {
    const table = newTable("TIME", "IN", "DURATION", "LINES", "DELAYS", "INFO");
    for (const r of routes) {
        table.push([
            `${r.depTime} - ${r.arrivalTime}`,
            r.timeDelta.toString(),
            r.duration.toString(),
            r.lines.join("\n"),
            r.delay.join("\n"),
            r.info.join("\n"),
        ]);
    }
    return table;
}
