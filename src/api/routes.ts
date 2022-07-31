import { Station } from "./station.ts"

const API_URL = "https://www.mvg.de/api/fahrinfo/";


export interface Connection {
	zoomNoticeFrom: boolean; //false,
	zoomNoticeTo: boolean; //false,
	zoomNoticeFromEscalator: boolean; //false,
	zoomNoticeToEscalator: boolean; //false,
	zoomNoticeFromElevator: boolean; //false,
	zoomNoticeToElevator: boolean; //false,
	from: Station; //{
	to: Station; //{
	departure: Date; //1657052820000,
	arrival: Date; //1657054680000,
	connectionPartList: ConnectionPart[]; //[ [Object], [Object], [Object] ],
	efaTicketIds: string[]; //[
	serverId: number; //890465705227281700,
	ringFrom: number; //0,
	ringTo: number; //0,
	sapTicketMappingDtos: object[]; //[
	oldTarif: boolean; //false
}

export interface ConnectionPart {
    stops: Stop[]
    from: Station
    to: Station
    path: LocationLongLat[]
    pathDescription: Array<any> //[ ],
    interchangePath: Array<any> //[ ],
    departure: Date  //1659256140000,
    arrival: Date  //1659256620000,
    delay: number  //2,
    arrDelay: number  //2,
    cancelled: boolean  //false,
    product: string  //"SBAHN",
    label: string  //"S6",
    network: string  //"ddb",
    connectionPartType: string  //"TRANSPORTATION",
    serverId: string  //"670745925620865625 - 1",
    destination: string  //"Grafing Bahnhof",
    lineDirection: string  //"FORWARD",
    sev: boolean  //false,
    zoomNoticeDeparture: boolean  //false,
    zoomNoticeArrival: boolean  //false,
    zoomNoticeDepartureEscalator: boolean  //false,
    zoomNoticeArrivalEscalator: boolean  //false,
    zoomNoticeDepartureElevator: boolean   //false,
    zoomNoticeArrivalElevator: boolean //false,
    departurePlatform: string  //"1",
    departureStopPositionNumber: number  //0,
    arrivalPlatform: string   //"5",
    arrivalStopPositionNumber: number  //0,
    noChangingRequired: boolean  //false,
    fromId: string   //"de:09162:6",
    departureId: string   //"a852a6bc2d81ab243184f18a09111648#1659256140000#de:09162:6",
    infoMessages?: string[]  //[ "Linie S6: Maskenpflicht nach gesetzl. Regelung; wir empfehlen eine FFP2-Maske", "Linie S6: Fahrradmitnahme begrenzt möglich", "Linie S6: Bei Fahrradmitnahme Sperrzeiten beachten", "Linie S6: nur 2. Kl.", "Verspätung eines vorausfahrenden Zuges" ],
    notifications?: Array<ConnectionPartNotification>
    occupancy: string  //"UNKNOWN"
}

interface Stop {
    location: Station
    time: Date
    delay: number
    arrDelay: number
    cancelled: boolean
}

interface LocationLongLat {
    type: "location"
    latitude: "string"
    longitude: "string"
}

interface ConnectionPartNotification {
        title: string  //"Kein Halt am Karlsplatz (Stachus) wegen Fahrtreppenerneuerung",
        description: string //"Liebe Fahrgäste,<br>&nbsp;<br>wegen einer <strong>Fahrtreppenerneuerung</strong> am Karlsplatz (Stachus)<br>von Mittwoch,<strong> 08. Juni 2022</strong> <strong>mit vsl. Mittwoch, 03. August 2022</strong>,<br>fahren die Züge der Linie U4 und U5 in beiden Fahrtrichtungen<br>am Karlsplatz (Stachus) ohne Halt durch.<br>Um den Karlsplatz (Stachus) zu erreichen, nutzen Sie bitte ab Hauptbahnhof die S-Bahnen sowie die Tramlinien 16, 17, 18, 19, 20 und 21 oder den kurzen Fußweg (ca. 350 Meter) entlang der Schützen- bzw. Bayerstraße nutzen.<br>&nbsp;<br>Weitere Informationen erhalten Sie unter <a href=\"https://www.mvg.de/betriebsaenderungen/2022-06-08-fahrtreppen-stachus.html\" rel=\"nofollow\">mvg.de/karlsplatz</a>.<br><br>Wir bitten um Verständnis.<br>&nbsp;<br>Ihre MVG",
        publication: Date //1654159951000,
        validFrom: Date //1654567200000,
        validTo: Date //1659486600000,
        id: string //"504869115",
        type: string //"INCIDENT",
        lines: Array<any>
        eventTypes: Array<any> //[ ]
}

interface getRoutesOptions {
	epochTime?: Date;
	arrival?: boolean;
	sapTicket?: boolean;
	includeUbahn?: boolean;
	includeBus?: boolean;
	includeTram?: boolean;
	includeSBahn?: boolean;
	includeTaxi?: boolean;
}

export async function getRoutes(
	startStation: Station,
	endStation: Station,
	options?: getRoutesOptions,
): Promise<Connection[]> {
	const opts = Object.assign({
		epochTime: new Date(),
		arrival: false,
		sapTicket: true,
		includeUbahn: true,
		includeBus: true,
		includeTram: true,
		includeSBahn: true,
		includeTaxi: false,
	}, options);

	// MVG uses colons in the Station.id, so no URL encoding possible
	const url = `
        ${API_URL}routing/?fromStation=${startStation.id}
        &toStation=${endStation.id}
        &time=${opts.epochTime!.valueOf()}
        &sapTickets=${opts.sapTicket}
        &transportTypeUnderground=${opts.includeUbahn}
        &transportTypeBus=${opts.includeBus}
        &transportTypeTram=${opts.includeTram}
        &transportTypeSBahn=${opts.includeSBahn}
        &transportTypeCallTaxi=${opts.includeTaxi}
    `.replace(/\s+/g, "");

	const res = await fetch(url);
	const data = await res.json();
    return data.connectionList.map((x: Connection) => {
        x.departure = new Date(x.departure)
        x.arrival = new Date(x.arrival)
        return x
    })
}
