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
  sapTicket?: boolean;
  includeTaxi?: boolean;
}

async function getRoute(
  startStation: Station,
  endStation: Station,
  options: getRouteOptions = {
    epochTime: new Date(),
    sapTicket: true,
    includeTaxi: false,
  },
) {
  const { epochTime, sapTicket, includeTaxi } = options;
  // mvg uses colons in the Station.id, so no URL encoding possible
  const url = `
    ${API_URL}routing/?fromStation=${startStation.id}
    &toStation=${endStation.id}
    &time=${epochTime!.valueOf()}
    &sapTickets=${sapTicket}
    &transportTypeCallTaxi=${includeTaxi}
  `.replace(/\s+/g, "");

  const res = await fetch(url);
  new Date("July 5, 2022 23:24:00");
  return res.json();
}

// const station = await getStation('Feldkirchen')
// console.log(await getDepartures(station))

const station1 = await getStation("Feldkirchen");
const station2 = await getStation("Munchen Hauptbahnhof");
// console.log(await getDepartures(station1))

const time = new Date("July 5, 2022 23:24:00");
const route = await getRoute(station1, station2, {
  epochTime: time,
  sapTicket: true,
  includeTaxi: false,
});
console.log(route);

/////////////////////////////////////////
//  curl "https://www.mvg.de/api/fahrinfo/location/query?q=Muenchen"
//
// Returns locations: Station[] and sometimes with Address
// But is's like a universal seach, so first result matches best for query
// {
//   locations: [
//     {
//       type: "station",
//       latitude: 48.24942,
//       longitude: 11.652506,
//       id: "de:09184:490",
//       divaId: 490,
//       place: "Garching (b München)",
//       name: "Garching",
//       hasLiveData: false,
//       hasZoomData: true,
//       products: [ "BUS", "UBAHN" ],
//       tariffZones: "1|2",
//       occupancy: "UNKNOWN",
//       lines: {
//         tram: [Array],
//         nachttram: [Array],
//         sbahn: [Array],
//         ubahn: [Array],
//         bus: [Array],
//         nachtbus: [Array],
//         otherlines: [Array]
//       }
//     },
//   ...,
// {
//   type: "address",
//   latitude: 48.262668,
//   longitude: 11.669852,
//   place: "Garching (b München)",
//   street: "P+R Garching Forschungszentrum",
//   poi: true
// },

// interface Station {
//   type: "station";
//   latitude: number; //48.12805,
//   longitude: number; // 11.60365,
//   id: string; //"de:09162:5",
//   divaId: number; //5,
//   place: string; //"München",
//   name: string; //"Ostbahnhof München",
//   hasLiveData: boolean; //false,
//   hasZoomData: boolean; //true,
//   products: string[]; //[ "TRAM", "UBAHN", "SBAHN", "BAHN" ],
//   link: string; //"OB",
//   tariffZones: string; //"m",
//   occupancy: string; //"UNKNOWN",
//   lines: Lines;
// }

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

//////////////////////////////////////////////////////////////////////////////////
// Garching Forschunszentrum: string "de:09184:460"
// const res_dep: Response = await fetch("https://www.mvg.de/api/fahrinfo/departure/de:09184:460");
// const deps = await res_dep.json()
// console.log(deps)

// returns Array of ServingLine[] + Departure[]
// servingLines: [
//   {
//     destination: "Klinikum Großhadern",
//     sev: false,
//     network: "swm",
//     product: "UBAHN",
//     lineNumber: "U6",
//     divaId: "010U6"
//   },
// ...
// departures: [
//   {
//     departureTime: 1657041360000,
//     product: "UBAHN",
//     label: "U6",
//     destination: "Klinikum Großhadern",
//     live: false,
//     delay: 0,
//     cancelled: false,
//     lineBackgroundColor: "#0472b3",
//     departureId: "fedaf47e04a15f6b14c3393848fcfb2d#1657041360000#de:09184:460",
//     sev: false,
//     platform: "Gleis 2",
//     stopPositionNumber: 0,
//     infoMessages: []
//   },

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

///////////////////////////////////////////////////////////////////////////////////////////////////
// getRoute returns:
// {
//   connectionList: [
//     {
//       zoomNoticeFrom: false,
//       zoomNoticeTo: false,
//       zoomNoticeFromEscalator: false,
//       zoomNoticeToEscalator: false,
//       zoomNoticeFromElevator: false,
//       zoomNoticeToElevator: false,
//       from: {
//         type: "station",
//         latitude: 48.15115,
//         longitude: 11.73145,
//         id: "de:09184:2110",
//         divaId: 2110,
//         place: "Feldkirchen (b München)",
//         name: "Feldkirchen",
//         hasLiveData: false,
//         hasZoomData: false,
//         products: [Array],
//         efaLon: 11.73145,
//         efaLat: 48.15115,
//         link: "MMFK",
//         tariffZones: "m|1",
//         occupancy: "UNKNOWN",
//         lines: [Object]
//       },
//       to: {
//         type: "station",
//         latitude: 48.14029,
//         longitude: 11.5596,
//         id: "de:09162:100",
//         divaId: 100,
//         place: "München",
//         name: "München Hbf.",
//         hasLiveData: false,
//         hasZoomData: false,
//         products: [Array],
//         efaLon: 11.5596,
//         efaLat: 48.14029,
//         link: "HU",
//         tariffZones: "m",
//         occupancy: "UNKNOWN",
//         lines: [Object]
//       },
//       departure: 1657052820000,
//       arrival: 1657054680000,
//       connectionPartList: [ [Object], [Object], [Object] ],
//       efaTicketIds: [
//         "EINE-M0",       "EINK",      "STK-E-2",   "STK-K-1",
//         "STKU21-2",      "TKS-M0",    "TKG-M0",    "TKK",
//         "TKF",           "ICW-M0",    "ICM-M0",    "ICMA-M0",
//         "ICJA-M0",       "IC9-M0",    "IC9MA-M0",  "IC9JA-M0",
//         "IC65-M0",       "IC65MA-M0", "IC65JA-M0", "AT1W-M0",
//         "AT1M-M0",       "AT2W-M0",   "AT2M-M0",   "APC1-M0",
//         "APC2-M0",       "ICS-M0",    "BOBS",      "BOBG",
//         "BT-21",         "BT-22",     "BT-23",     "BT-24",
//         "BT-25",         "BT-11",     "BT-12",     "BT-13",
//         "BT-14",         "BT-15",     "BTN-21",    "BTN-22",
//         "BTN-23",        "BTN-24",    "BTN-25",    "BTN-11",
//         "BTN-12",        "BTN-13",    "BTN-14",    "BTN-15",
//         "neuneuro",      "AIRS",      "AIRG",      "BOB_MVV_P-TSR",
//         "BOB_MVV_S-TSR", "SLTG-TSR",  "SLTK-TSR",  "SLTE-TSR"
//       ],
//       serverId: 890465705227281700,
//       ringFrom: 0,
//       ringTo: 0,
//       sapTicketMappingDtos: [
//         [Object], [Object], [Object],
//         [Object], [Object], [Object],
//         [Object], [Object], [Object],
//         [Object], [Object], [Object],
//         [Object], [Object], [Object],
//         [Object], [Object], [Object],
//         [Object], [Object], [Object],
//         [Object], [Object]
//       ],
//       oldTarif: false
//     },
//     {
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
