import { Command } from "cliffy/command/mod.ts"
import { Table } from "cliffy/table/mod.ts"
import { colors } from "cliffy/ansi/colors.ts"

import { getNotifications } from "./api.ts"



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

function prepareNotifications(nots: Notifications[]) {
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


const table = notificationsTable()

const notifications = await getNotifications()

const not = prepareNotifications(notifications)

const not_filtered = not.filter(n => n.lines.includes("U1"))

for (let n of not_filtered) {
    table.push([n.lines, n.duration, `${colors.bold(n.title)}\n\n${n.details}`])
}

table.render()
