const API_URL = "https://www.mvg.de/api/fahrinfo/";

async function getStation(stationSearch: string): Promise<Station> {
	const query = stationSearch.replace(/ /g, "%20");
	const res: Response = await fetch(`${API_URL}location/query?q=${query}`);
	const obj = await res.json();
	return obj.locations[0];
}

async function getDepartures(station: Station) {
	const res: Response = await fetch(`${API_URL}departure/${station.id}`);
	return res.json();
}

interface getRouteOptions {
	epochTime?: Date;
    arrival?: boolean
	sapTicket?: boolean;
    includeUbahn?: boolean
    includeBus?: boolean
    includeTram?: boolean
    includeSBahn?: boolean
	includeTaxi?: boolean;
}

async function getRoute(startStation: Station, endStation: Station, options: getRouteOptions) {
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

	// mvg uses colons in the Station.id, so no URL encoding possible
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
	console.log(url);

	const res = await fetch(url);
	return res.json();
}

async function getNotifications(): Promise<Notification[]> {
    const res = await fetch("https://www.mvg.de/api/ems/tickers")
    return res.json()
}


async function test_route() {
	const station1 = await getStation("Garching-Forsch");
	const station2 = await getStation("Munchen-Hauptbahnhof");
	// console.log(await getDepartures(station1))

	// const time = new Date("July 5, 2022 23:24:00");
	const route = await getRoute(station1, station2, {
		// epochTime: time,
		sapTicket: true,
		includeTaxi: false,
	});
	console.log(route);
}
// test_route();


interface Lines {
	tram: string[];
	nachttream: string[];
	sbahn: string[];
	ubahn: string[];
	bus: string[];
	nachtbus: string[];
	otherlines: string[];
}

interface Address {
	type: "address";
	latitude: number; //48.262668,
	longitude: number; //11.669852,
	place: string; //"Garching (b München)",
	street: string; //"P+R Garching Forschungszentrum",
	poi: boolean; //true
}


interface ServingLine {
	destination: string; //"Klinikum Großhadern",
	sev: boolean; //false,
	network: string; //"swm",
	product: string; //"UBAHN",
	lineNumber: string; //"U6",
	divaId: string; //"010U6"
}

interface Departure {
	departureTime: number; //1657041360000,
	product: string; //"UBAHN",
	label: string; //"U6",
	destination: string; //"Klinikum Großhadern",
	live: boolean; //false,
	delay: number; //0,
	cancelled: boolean; //false,
	lineBackgroundColor: string; //"#0472b3",
	departureId: string; //"fedaf47e04a15f6b14c3393848fcfb2d#1657041360000#de:09184:460",
	sev: boolean; //false,
	platform: string; //"Gleis 2",
	stopPositionNumber: number; //0,
	infoMessages: string; //[]
}

interface Station {
	type: "station";
	latitude: number; //48.12805,
	longitude: number; // 11.60365,
	id: string; //"de:09162:5",
	divaId: number; //5,
	place: string; //"München",
	name: string; //"Ostbahnhof München",
	hasLiveData: boolean; //false,
	hasZoomData: boolean; //true,
	products: string[]; //[ "TRAM", "UBAHN", "SBAHN", "BAHN" ],
	efaLon?: 11.73145;
	efaLat?: 48.15115;
	link: string; //"OB",
	tariffZones: string; //"m",
	occupancy: string; //"UNKNOWN",
	lines: Lines;
}

interface Connection {
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
	connectionPartList: object[]; //[ [Object], [Object], [Object] ],
	efaTicketIds: string[]; //[
	serverId: number; //890465705227281700,
	ringFrom: number; //0,
	ringTo: number; //0,
	sapTicketMappingDtos: object[]; //[
	oldTarif: boolean; //false
}

interface Notification {
    id: string
    type: string
    title: string
    text: string
    htmlText: string
    lines: NotificationLines[]
    incidents: string[]
    links: string[]
    downloadLinks: DownloadLink[]
    incidentDuration: Duration[]
    activeDuration: Duration
    modificationDate: Date
}

interface NotificationLines {
    id: string
    name: string
    typeOfTransport: string
    stations: NotificationStation[]
    direction: string
}

interface NotificationStation {
    id: string
    name: string
}

interface Duration {
    fromDate: Date
    toDate: Date
}

interface DownloadLink {
    id: string
    name: string
    mimeType: string
}
