const API_URL = "https://www.mvg.de/api/fahrinfo/";

export interface Station {
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

export async function getStation(stationSearch: string): Promise<Station> {
    const query = stationSearch.replace(/ /g, "%20");
    const res: Response = await fetch(`${API_URL}location/query?q=${query}`);
    const obj = await res.json();
    return obj.locations[0];
}
