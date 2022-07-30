import { Station } from "./station.ts"

const API_URL = "https://www.mvg.de/api/fahrinfo/";


interface ServingLine {
	destination: string; //"Klinikum Großhadern",
	sev: boolean; //false,
	network: string; //"swm",
	product: string; //"UBAHN",
	lineNumber: string; //"U6",
	divaId: string; //"010U6"
}

interface Departure {
	departureTime: Date; // gets fetch as epoch number e.g. 1657041360000,
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

export async function getDepartures(
	station: Station,
): Promise<Departure[]> {
	const res: Response = await fetch(`${API_URL}departure/${station.id}`);
    const data = await res.json()

	return data.departures.map((x: Departure) => {
        x.departureTime = new Date(x.departureTime)
        return x
    });
}
