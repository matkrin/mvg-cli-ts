import { Station } from "./station.ts";

const API_URL = "https://www.mvg.de/api/fahrinfo/";

export type Connection = {
    zoomNoticeFrom: boolean;
    zoomNoticeTo: boolean;
    zoomNoticeFromEscalator: boolean;
    zoomNoticeToEscalator: boolean;
    zoomNoticeFromElevator: boolean;
    zoomNoticeToElevator: boolean;
    from: Station;
    to: Station;
    departure: Date;
    arrival: Date;
    connectionPartList: ConnectionPart[];
    efaTicketIds: string[];
    serverId: number;
    ringFrom: number;
    ringTo: number;
    sapTicketMappingDtos?: SapTicketMappingDtos[];
    oldTarif: boolean;
};

export type ConnectionPart = {
    stops?: Stop[];
    from: Station;
    to: Station;
    path: LocationLongLat[];
    pathDescription: PathDescription[];
    interchangePath: InterchangePath[];
    departure: Date;
    arrival: Date;
    delay?: number;
    arrDelay?: number;
    cancelled: boolean;
    product?: string;
    label?: string;
    network?: string;
    connectionPartType: string;
    serverId?: string;
    destination?: string;
    lineDirection?: string;
    sev: boolean;
    zoomNoticeDeparture: boolean;
    zoomNoticeArrival: boolean;
    zoomNoticeDepartureEscalator: boolean;
    zoomNoticeArrivalEscalator: boolean;
    zoomNoticeDepartureElevator: boolean;
    zoomNoticeArrivalElevator: boolean;
    departurePlatform?: string;
    departureStopPositionNumber: number;
    arrivalPlatform: string;
    arrivalStopPositionNumber: number;
    noChangingRequired: boolean;
    fromId?: string;
    departureId?: string;
    infoMessages?: string[];
    notifications?: Array<ConnectionPartNotification>;
    occupancy?: string;
};

type Stop = {
    location: Station;
    time: Date;
    delay?: number;
    arrDelay?: number;
    cancelled: boolean;
};

type LocationLongLat = {
    type: "location";
    latitude: "string";
    longitude: "string";
};

type ConnectionPartNotification = {
    title: string;
    description: string;
    publication: Date;
    validFrom: Date;
    validTo: Date;
    id: string;
    type: string;
    /* lines: Array<any>; */
    /* eventTypes: Array<any>; */
};

type PathDescription = {
    from: number;
    to: number;
    level: number;
};

type InterchangePath = {
    type: "location";
    latitude: number;
    longitude: number;
};

type SapTicketMappingDtos = {
    sap_id: string;
    sap_name: string;
    sap_price: string;
    display_title_de: string;
    display_title_en: string;
    display_subtitle_de: string;
    display_subtitle_en: string;
    efa_id: string;
    type_name: string;
    available_atm: boolean;
    available_mobile_atm: boolean;
    available_app: boolean;
    ticket_aggregation_group: string;
    tarif_level: string;
    zones: string;
};

export type GetRoutesOptions = {
    epochTime?: Date;
    arrival?: boolean;
    sapTicket?: boolean;
    includeUbahn?: boolean;
    includeBus?: boolean;
    includeTram?: boolean;
    includeSBahn?: boolean;
    includeTaxi?: boolean;
};

export async function getRoutes(
    startStation: Station,
    endStation: Station,
    options?: GetRoutesOptions,
): Promise<Connection[]> {
    const opts = Object.assign(
        {
            epochTime: new Date(),
            arrival: false,
            sapTicket: true,
            includeUbahn: true,
            includeBus: true,
            includeTram: true,
            includeSBahn: true,
            includeTaxi: false,
        },
        options,
    );

    // MVG uses colons in the Station.id, so no URL encoding possible
    const url = `
        ${API_URL}routing/?fromStation=${startStation.id}
        &toStation=${endStation.id}
        &time=${opts.epochTime!.valueOf()}
        &arrival=${opts.arrival}
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
        x.departure = new Date(x.departure);
        x.arrival = new Date(x.arrival);
        return x;
    });
}
