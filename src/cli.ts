import { Command } from "cliffy/command/mod.ts"
import { Table } from "cliffy/table/mod.ts"
import { colors } from "cliffy/ansi/colors.ts"

import { getStation } from "./api.ts"
import { getNotifications } from "./api.ts"
import type { Notification } from "./api.ts"
import { getDepartures } from "./api.ts"



function parseHTML(html: string) {
    return html
        .replaceAll('&Auml;', 'Ä')
        .replaceAll('&auml;', 'ä')
        .replaceAll('&Ouml;', 'Ö')
        .replaceAll('&ouml;', 'ö')
        .replaceAll('&Uuml;', 'Ü')
        .replaceAll('&uuml;', 'ü')
        .replaceAll('&auml;', 'ä')
        .replaceAll('&szlig;', 'ß')
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        .replaceAll('&nbsp;', ' ')
        .replace(/<\/*div>|/g, '')
        .replace(/<\/*strong>/g, '')
        .replace(/<\/*em>/g, '')
        .replace(/<\/*br\s*\/*>/g, '')
        .replace(/<\/li>/g, '')
        .replace(/<\/*ul>/g, '\n')
        .replace(/<li>/g, '- ')
        .replace(/<\/?a.*?>/g, '')
}

function notificationsTable() {
    return new Table()
        .header([
            colors.bold("LINES"),
            colors.bold("DURATION"),
            colors.bold("DETAILS"),
        ])
        .maxColWidth(80)
        .border(true)
}

function prepareNotifications(nots: Notification[]) {
    return nots.map(not => {
        const info = {}
        info.lines = [...new Set(not.lines.map(l => l.name))]
        info.details = parseHTML(not.htmlText)
        info.title = not.title

        const from = new Date(not.activeDuration.fromDate)
            .toLocaleDateString('de-DE')
        const to = new Date(not.activeDuration.toDate)
            .toLocaleDateString('de-DE')
        info.duration = `${from} - ${to}`

        return info
    })
}

async function renderNotifications() {
    const table = notificationsTable()
    const notifications = await getNotifications()
    const not = prepareNotifications(notifications)

    const not_filtered = not.filter(n => n.lines.includes("U1"))

    for (let n of not_filtered) {
        table.push([n.lines, n.duration, `${colors.bold(n.title)}\n\n${n.details}`])
    }

    table.render()
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
        .border(true)
}


const station = await getStation("Garching")
const res = await getDepartures(station)
const deps = res.departures.map(x => {
    x.departureTime = new Date(x.departureTime).toLocaleString('de-DE')
    return x
})


const depTable = departuresTable()
for (let d of deps) {
    depTable.push([d.departureTime, d.label, d.destination, d.delay, d.infoMessages.toString()])
}
depTable.render()
