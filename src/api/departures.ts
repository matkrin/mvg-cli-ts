import { Station } from "./station.ts";

const API_URL = "https://www.mvg.de/api/fahrinfo/";

type ServingLine = {
    destination: string;
    sev: boolean;
    network: string;
    product: string;
    lineNumber: string;
    divaId: string;
};

export type Departure = {
    departureTime: Date;
    product: string;
    label: string;
    destination: string;
    live: boolean;
    delay?: number;
    cancelled: boolean;
    lineBackgroundColor: string;
    departureId: string;
    sev: boolean;
    platform: string;
    stopPositionNumber: number;
    infoMessages: string[];
};

export async function getDepartures(
    station: Station,
): Promise<Departure[]> {
    const res: Response = await fetch(`${API_URL}departure/${station.id}`);
    const data = await res.json();

    return data.departures.map((x: Departure) => {
        x.departureTime = new Date(x.departureTime);
        return x;
    });
}
