const API_URL = "https://www.mvg.de/api/fahrinfo/";

export type Station = {
    type: "station";
    latitude: number;
    longitude: number;
    id: string;
    divaId: number;
    place: string;
    name: string;
    hasLiveData: boolean;
    hasZoomData: boolean;
    products: string[];
    efaLon?: 11.73145;
    efaLat?: 48.15115;
    link?: string;
    tariffZones?: string;
    occupancy: string;
    lines: Lines;
}

type Lines = {
    tram: string[];
    nachttram: string[];
    sbahn: string[];
    ubahn: string[];
    bus: string[];
    nachtbus: string[];
    otherlines: string[];
}

type Address = {
    type: "address";
    latitude: number; 
    longitude: number; 
    place: string; 
    street: string; 
    poi: boolean; 
}

export async function getStation(stationSearch: string): Promise<Station> {
    const query = stationSearch.replace(/ /g, "%20");
    const res: Response = await fetch(`${API_URL}location/query?q=${query}`);
    const obj = await res.json();
    return obj.locations[0];
}
