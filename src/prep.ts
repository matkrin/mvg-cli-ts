import { lineColor, parseHTML } from "./utils.ts";
import type {
    Connection,
    ConnectionPart,
    Departure,
    Notification,
} from "./api/mod.ts";

export interface PreparedNotification {
    lines: string[];
    details: string;
    title: string;
    duration: string;
}

function filterNotsForLines(nots: PreparedNotification[], filter: string[]) {
    const filtered = nots.filter((n) =>
        filter.some((f) => n.lines.includes(f.toUpperCase()))
    );
    return filtered;
}

function colorNots(nots: PreparedNotification[]) {
    for (const n of nots) {
        n.lines = n.lines.map((l) => lineColor(l));
    }
    return nots;
}

export function prepareNotifications(
    nots: Notification[],
    filterForLines?: string[],
) {
    let notifications = nots.map((not) => {
        const lines = [...new Set(not.lines.map((l) => l.name))];
        const details = parseHTML(not.htmlText);
        const title = not.title;
        const from = not.activeDuration.fromDate.toLocaleDateString("de-DE");
        let to = "";
        if (not.activeDuration.toDate) {
            to = not.activeDuration.toDate.toLocaleDateString("de-DE");
        }
        const duration = `${from} - ${to}`;

        return { lines, details, title, duration };
    });
    if (filterForLines) {
        notifications = filterNotsForLines(notifications, filterForLines);
    }
    return colorNots(notifications);
}

export function prepareDepartures(departures: Departure[]) {
    for (const d of departures) {
        d.label = lineColor(d.label);
    }
    return departures;
}

export interface PreparedRoute {
    fromName: string;
    toName: string;
    fromPlace: string;
    toPlace: string;
    depTime: string;
    arrivalTime: string;
    timeDelta: number;
    duration: number;
    lines: string[];
    delay: string[];
    info: string[];
}

function prepareInfo(cpList: ConnectionPart[]): string[] {
    const info = cpList.map((cp) => {
        if (cp.notifications !== undefined) {
            return cp.notifications.map((n) => `${cp.label}: ${n.title}`).join(
                "\n",
            );
        } else if (cp.infoMessages !== undefined) {
            return cp.infoMessages!.join("\n");
        } else {
            return "";
        }
    });
    return info.filter((i) => i !== "");
}

function prepareLines(cpList: ConnectionPart[]): string[] {
    const lines: Set<string> = new Set();
    cpList.forEach((cp) =>
        cp.connectionPartType === "FOOTWAY"
            ? lines.add("walk")
            : lines.add(cp.label ? cp.label : "")
    );
    return [...lines].map((l) => lineColor(l));
}

function prepareDelay(cpList: ConnectionPart[]): string[] {
    return cpList.map((cp) => {
        if (cp.delay !== undefined) {
            return cp.delay.toString();
        } else {
            return "-";
        }
    });
}

export function prepareRoutes(connections: Connection[]) {
    return connections.map((c) => {
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
            fromName: c.from.name,
            toName: c.to.name,
            fromPlace: c.from.place,
            toPlace: c.to.place,
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
