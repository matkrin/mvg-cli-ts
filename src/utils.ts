import { colors } from "cliffy/ansi/colors.ts";

export function parseHTML(html: string) {
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

function ubahnColor(uLine: string): string {
    switch (uLine) {
        case "U1":
            return colors.bold.bgRgb8(` ${uLine} `, 22);
        case "U2":
            return colors.bold.bgRgb8(` ${uLine} `, 124);
        case "U3":
            return colors.bold.bgRgb8(` ${uLine} `, 166);
        case "U4":
            return colors.bold.bgRgb8(` ${uLine} `, 30);
        case "U5":
            return colors.bold.bgRgb8(` ${uLine} `, 94);
        case "U6":
            return colors.bold.bgRgb8(` ${uLine} `, 20);
        case "U7":
            return (
                colors.bold.bgRgb8(` ${uLine[0]}`, 22) +
                colors.bold.bgRgb8(`${uLine[1]} `, 124)
            );
        case "U8":
            return (
                colors.bold.bgRgb8(` ${uLine[0]}`, 124) +
                colors.bold.bgRgb8(`${uLine[1]} `, 166)
            );
        default:
            return uLine;
    }
}

function sbahnColor(sLine: string): string {
    switch (sLine) {
        case "S1":
            return colors.bold.bgRgb8(` ${sLine} `, 73);
        case "S2":
            return colors.bold.bgRgb8(` ${sLine} `, 34);
        case "S3":
            return colors.bold.bgRgb8(` ${sLine} `, 53);
        case "S4":
            return colors.bold.bgRgb8(` ${sLine} `, 196);
        case "S6":
            return colors.bold.bgRgb8(` ${sLine} `, 29);
        case "S7":
            return colors.bold.bgRgb8(` ${sLine} `, 204);
        case "S8":
            return colors.rgb8(colors.bold.bgRgb8(` ${sLine} `, 233), 226);
        case "S20":
            return colors.bold.bgRgb8(` ${sLine} `, 203);
        default:
            return sLine;
    }
}

export function lineColor(line: string): string {
    if (line.startsWith("U")) {
        return ubahnColor(line);
    } else if (line.startsWith("S")) {
        return sbahnColor(line);
    } else {
        return line;
    }
}
