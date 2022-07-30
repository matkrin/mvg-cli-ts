import { Station } from "./station.ts"

const API_URL = "https://www.mvg.de/api/fahrinfo/";


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

	const res = await fetch(url);
	const data = await res.json();
    return data.connectionList.map((x: Connection) => {
        x.departure = new Date(x.departure)
        x.arrival = new Date(x.arrival)
        return x
    })
}
