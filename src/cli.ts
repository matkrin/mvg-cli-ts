import { Table } from "cliffy/table/mod.ts";
import { colors } from "cliffy/ansi/colors.ts";

import { getStation, getDepartures, getNotifications, getRoutes } from "./api/mod.ts";
import type { Notification } from "./api/mod.ts";

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

function notificationsTable(): Table {
	return new Table()
		.header([
			colors.bold("LINES"),
			colors.bold("DURATION"),
			colors.bold("DETAILS"),
		])
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
	const table = notificationsTable();
	const notifications = await getNotifications();
	let nots = prepareNotifications(notifications);

	nots = filter ? nots.filter((n) => n.lines.includes(filter)) : nots;

	for (let n of nots) {
		table.push([
			n.lines.toString(),
			n.duration,
			`${colors.bold(n.title)}\n\n${n.details}`,
		]);
	}

	table.render();
}

function departuresTable() {
	return new Table()
		.header([
			colors.bold("DEPARTURE TIME"),
			colors.bold("LINE"),
			colors.bold("DESTINATION"),
			colors.bold("DELAY"),
			colors.bold("INFO"),
		])
		.maxColWidth(80)
		.border(true);
}

async function renderDepartures(stationName: string) {
    const station = await getStation(stationName);
    const deps = await getDepartures(station);

    const depTable = departuresTable();
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

function routesTable() {
	return new Table()
		.header([
			colors.bold("TIME"),
			colors.bold("IN"),
			colors.bold("DURATION"),
			colors.bold("LINES"),
			colors.bold("DELAY"),
			colors.bold("INFO"),
		])
		.maxColWidth(80)
		.border(true);
}

async function prepareRoutes(startStation: string, endStation: string) {
    const fromStation = await getStation(startStation)
    const toStation = await getStation(endStation)
    const connections = await getRoutes(fromStation, toStation)
    console.log(connections[0].connectionPartList)
    return connections.map(c => {
        const duration = (c.arrival.getTime() - c.departure.getTime()) / 60000
    })
}

// renderDepartures("garching")
// renderNotifications()
prepareRoutes("Hauptbahnhof", "ostbahnhof")
