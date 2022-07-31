import { Table } from "cliffy/table/mod.ts";
import { colors } from "cliffy/ansi/colors.ts";

import { getStation, getDepartures, getNotifications, getRoutes } from "./api/mod.ts";
import type { Notification, Connection, ConnectionPart } from "./api/mod.ts";

function parseHTML(html: string) {
	return html
		.replaceAll("&Auml;", "Ä")
		.replaceAll("&auml;", "ä")
		.replaceAll("&Ouml;", "Ö")
		.replaceAll("&ouml;", "ö")
		.replaceAll("&Uuml;", "Ü")
		.replaceAll("&uuml;", "ü")
		.replaceAll("&auml;", "ä")
		.replaceAll("&szlig;", "ß")
		.replaceAll("&lt;", "<")
		.replaceAll("&gt;", ">")
		.replaceAll("&nbsp;", " ")
		.replace(/<\/*div>|/g, "")
		.replace(/<\/*strong>/g, "")
		.replace(/<\/*em>/g, "")
		.replace(/<\/*br\s*\/*>/g, "")
		.replace(/<\/li>/g, "")
		.replace(/<\/*ul>/g, "\n")
		.replace(/<li>/g, "- ")
		.replace(/<\/?a.*?>/g, "");
}

function newTable(...columns: string[]) {
    const columnHeadings = columns.map(c => colors.bold(c))
    return new Table()
		.header(columnHeadings)
		.maxColWidth(80)
		.border(true);
}

function prepareNotifications(nots: Notification[]) {
	return nots.map((not) => {
		const lines = [...new Set(not.lines.map((l) => l.name))];
		const details = parseHTML(not.htmlText);
		const title = not.title;

		const from = not.activeDuration.fromDate.toLocaleDateString("de-DE");
		const to = not.activeDuration.toDate.toLocaleDateString("de-DE");
		const duration = `${from} - ${to}`;

		return {lines, details, title, duration};
	});
}

async function renderNotifications(filter: string = '') {
	const notifications = await getNotifications();
	let nots = prepareNotifications(notifications);

	nots = filter ? nots.filter((n) => n.lines.includes(filter)) : nots;

	const table = newTable("LINES", "DURATION", "DETAILS");
	for (let n of nots) {
		table.push([
			n.lines.toString(),
			n.duration,
			`${colors.bold(n.title)}\n\n${n.details}`,
		]);
	}

	table.render();
}


async function renderDepartures(stationName: string) {
    const station = await getStation(stationName);
    const deps = await getDepartures(station);

    const depTable = newTable("DEPARTURE TIME", "LINE", "DESTINATION", "DELAY", "INFO");
    for (let d of deps) {
        depTable.push([
            d.departureTime.toLocaleString("de-DE"),
            d.label,
            d.destination,
            d.delay,
            d.infoMessages.toString(),
        ]);
    }
    depTable.render();
}


async function prepareRoutes(connections: Connection[]) {
    return connections.map(c => {
        const fromName = c.from.name
        const toName = c.to.name
        const depTime = c.departure.toLocaleTimeString("de-DE", {timeStyle: 'short'})
        const arrivalTime = c.arrival.toLocaleTimeString("de-DE", {timeStyle: 'short'})
        const timeDelta = Math.round((c.departure.getTime() - new Date().getTime()) / 60000)
        const duration = (c.arrival.getTime() - c.departure.getTime()) / 60000
        const lines = new Set()
        c.connectionPartList.map(cp => {
            lines.add(cp.label)
        })
        const info = prepareInfo(c.connectionPartList)
        return {fromName, toName, depTime, arrivalTime, timeDelta, duration, lines, info}
    })
}

function prepareInfo(cpList: ConnectionPart[]): string[] {
    const info = cpList.map(cp => {
        if (cp.notifications) {
            return cp.notifications.map(n => `${cp.label}: ${n.title}`).join('\n')
        }
        return cp.infoMessages!.join('\n')
    })
    return info
}

async function renderRoutes(startStation: string, endStation: string) {
    const fromStation = await getStation(startStation)
    const toStation = await getStation(endStation)
    const connections = await getRoutes(fromStation, toStation)
    const routes = await prepareRoutes(connections)

    console.log(`\n  Routes for ${connections[0].from.name} - ${connections[0].to.name}`)

    const rTable = newTable("TIME", "IN", "DURATION", "LINES", "DELAY" , "INFO")
    for (let r of routes) {
        rTable.push([
            `${r.depTime} - ${r.arrivalTime}`,
            r.timeDelta.toString(),
            r.duration.toString(),
            [...r.lines].join(', '),
            "del",
            [...r.info].join('\n'),
        ]) 
    }
    rTable.render()
}

// renderDepartures("garching")
// renderNotifications()
// prepareRoutes("Hauptbahnhof", "ostbahnhof")
renderRoutes("hbf", "ostbahnhof")
