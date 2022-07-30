## Search Station

curl "https://www.mvg.de/api/fahrinfo/location/query?q=<Search Term>"
curl "https://www.mvg.de/api/fahrinfo/location/query?q=Garching-Forsch"

Returns locations object: Array<Station | Address>
It's like a universal search, so first result matches best for query

```json
// Station
{
  locations: [
    {
      type: "station",
      latitude: 48.24942,
      longitude: 11.652506,
      id: "de:09184:490",
      divaId: 490,
      place: "Garching (b München)",
      name: "Garching",
      hasLiveData: false,
      hasZoomData: true,
      products: [ "BUS", "UBAHN" ],
      tariffZones: "1|2",
      occupancy: "UNKNOWN",
      lines: {
        tram: [Array],
        nachttram: [Array],
        sbahn: [Array],
        ubahn: [Array],
        bus: [Array],
        nachtbus: [Array],
        otherlines: [Array]
      }
    },
  ...,
// Address
    {
      type: "address",
      latitude: 48.262668,
      longitude: 11.669852,
      place: "Garching (b München)",
      street: "P+R Garching Forschungszentrum",
      poi: true
    },
```


## Departures

Garching Forschungszentrum: string "de:09184:460"

curl "https://www.mvg.de/api/fahrinfo/departure/<Station.Id>"
curl "https://www.mvg.de/api/fahrinfo/departure/de:09184:460"

returns servingLines: Array<Destination> and departures: Array<Departure>

```json
servingLines: [
  {
    destination: "Klinikum Großhadern",
    sev: false,
    network: "swm",
    product: "UBAHN",
    lineNumber: "U6",
    divaId: "010U6"
  },
...
departures: [
  {
    departureTime: 1657041360000,
    product: "UBAHN",
    label: "U6",
    destination: "Klinikum Großhadern",
    live: false,
    delay: 0,
    cancelled: false,
    lineBackgroundColor: "#0472b3",
    departureId: "fedaf47e04a15f6b14c3393848fcfb2d#1657041360000#de:09184:460",
    sev: false,
    platform: "Gleis 2",
    stopPositionNumber: 0,
    infoMessages: []
  },
```


## Routes

curl "https://www.mvg.de/api/fahrinfo/routing/?fromStation=<ID of start Station: string>
&toStation=<ID of end Station: string>
&transportTypeUnderground=<include UBahn in search: bool>
&transportTypeBus=<include Bus insearch: bool>
&transportTypeTram=<include Tram in search: bool>
&transportTypeSBahn=<include Sbahn in search: bool>
&time=<time for route in epoch: number, e.g. 1657436820000>
&arrival=<if true, time specifies the arrival time, if false departure time>
&sapTickets=true
&transportTypeCallTaxi=true

curl "https://www.mvg.de/api/fahrinfo/routing/?fromStation=de:09162:6\
&toStation=de:09162:5\ 
&transportTypeUnderground=true\
&transportTypeBus=false\
&transportTypeTram=false\
&transportTypeSBahn=false\
&time=1657436820000\
&arrival=true\
&sapTickets=true\
&transportTypeCallTaxi=true"

returns connectionList
```json
{
  connectionList: [
    {
      zoomNoticeFrom: false,
      zoomNoticeTo: false,
      zoomNoticeFromEscalator: false,
      zoomNoticeToEscalator: false,
      zoomNoticeFromElevator: false,
      zoomNoticeToElevator: false,
      from: {
        type: "station",
        latitude: 48.15115,
        longitude: 11.73145,
        id: "de:09184:2110",
        divaId: 2110,
        place: "Feldkirchen (b München)",
        name: "Feldkirchen",
        hasLiveData: false,
        hasZoomData: false,
        products: [Array],
        efaLon: 11.73145,
        efaLat: 48.15115,
        link: "MMFK",
        tariffZones: "m|1",
        occupancy: "UNKNOWN",
        lines: [Object]
      },
      to: {
        type: "station",
        latitude: 48.14029,
        longitude: 11.5596,
        id: "de:09162:100",
        divaId: 100,
        place: "München",
        name: "München Hbf.",
        hasLiveData: false,
        hasZoomData: false,
        products: [Array],
        efaLon: 11.5596,
        efaLat: 48.14029,
        link: "HU",
        tariffZones: "m",
        occupancy: "UNKNOWN",
        lines: [Object]
      },
      departure: 1657052820000,
      arrival: 1657054680000,
      connectionPartList: [ [Object], [Object], [Object] ],

            connectionPartList: [
              {
                stops: [Array],
                from: [Object],
                to: [Object],
                path: [Array],
                pathDescription: [Array],
                interchangePath: [Array],
                departure: 1659177540000,
                arrival: 1659178020000,
                delay: 1,
                arrDelay: 1,
                cancelled: false,
                product: "SBAHN",
                label: "S4",
                network: "ddb",
                connectionPartType: "TRANSPORTATION",
                serverId: "695905917693354617 - 1",
                destination: "Trudering",
                lineDirection: "FORWARD",
                sev: false,
                zoomNoticeDeparture: false,
                zoomNoticeArrival: false,
                zoomNoticeDepartureEscalator: false,
                zoomNoticeArrivalEscalator: false,
                zoomNoticeDepartureElevator: false,
                zoomNoticeArrivalElevator: false,
                departurePlatform: "1",
                departureStopPositionNumber: 0,
                arrivalPlatform: "5",
                arrivalStopPositionNumber: 0,
                noChangingRequired: false,
                fromId: "de:09162:6",
                departureId: "d606e257f20d68a313f86fe231780a49#1659177540000#de:09162:6",
                infoMessages: [Array],
                occupancy: "UNKNOWN"
              }
            ],

      efaTicketIds: [
        "EINE-M0",       "EINK",      "STK-E-2",   "STK-K-1",
        "STKU21-2",      "TKS-M0",    "TKG-M0",    "TKK",
        "TKF",           "ICW-M0",    "ICM-M0",    "ICMA-M0",
        "ICJA-M0",       "IC9-M0",    "IC9MA-M0",  "IC9JA-M0",
        "IC65-M0",       "IC65MA-M0", "IC65JA-M0", "AT1W-M0",
        "AT1M-M0",       "AT2W-M0",   "AT2M-M0",   "APC1-M0",
        "APC2-M0",       "ICS-M0",    "BOBS",      "BOBG",
        "BT-21",         "BT-22",     "BT-23",     "BT-24",
        "BT-25",         "BT-11",     "BT-12",     "BT-13",
        "BT-14",         "BT-15",     "BTN-21",    "BTN-22",
        "BTN-23",        "BTN-24",    "BTN-25",    "BTN-11",
        "BTN-12",        "BTN-13",    "BTN-14",    "BTN-15",
        "neuneuro",      "AIRS",      "AIRG",      "BOB_MVV_P-TSR",
        "BOB_MVV_S-TSR", "SLTG-TSR",  "SLTK-TSR",  "SLTE-TSR"
      ],
      serverId: 890465705227281700,
      ringFrom: 0,
      ringTo: 0,
      sapTicketMappingDtos: [
        [Object], [Object], [Object],
        [Object], [Object], [Object],
        [Object], [Object], [Object],
        [Object], [Object], [Object],
        [Object], [Object], [Object],
        [Object], [Object], [Object],
        [Object], [Object], [Object],
        [Object], [Object]
      ],
      oldTarif: false
    },
    {
```

also possible for addresses:
https://www.mvg.de/api/fahrinfo/routing/
?fromLatitude=48.268808
&fromLongitude=11.669717
&toLatitude=48.126964
&toLongitude=11.618127
//&transportTypeSBahn=false
&time=1657957517298
&sapTickets=true
&transportTypeCallTaxi=true

get latitude and longitude from address search:
https://www.mvg.de/api/fahrinfo/location/queryWeb?q=Lichtenbergstrasse&limit=10

## Notifications

### Short

curl "https://www.mvg.de/api/ems/slim""

```json
[
   {
      "id" : "f8820cba-02c0-4f26-8124-770ed451b073",
      "title" : "Bus 132 - BeeintrÃ¤chtigungen wegen einer Veranstaltung"
   },
   {
      "id" : "f92a4e91-9694-4a97-a6c5-0545abc58ad6",
      "title" : "U1,U2 - EinschrÃ¤nkungen wegen Instandhaltungsarbeiten"
   },
   {
      "id" : "d770da1e-0173-4fb3-a3a5-243621c1bdc0",
      "title" : "U4,U5 - Kein Halt am Karlsplatz (Stachus) wegen Fahrtreppenerneuerung"
   },
   {
      "id" : "e8072801-c0b9-4a30-bc52-a99bf03aa0c8",
      "title" : "U3,U6 - EinschrÃ¤nkungen wegen Bauarbeiten am Sendlinger Tor"
   }
]
```

### Long

curl "https://www.mvg.de/api/ems/tickers"

returns Array<Notification>




curl "https://www.mvg.de/.rest/zdm/mvgStationGlobalIds"


