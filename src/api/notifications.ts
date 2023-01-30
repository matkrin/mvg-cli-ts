export type Notification = {
    id: string;
    type: string;
    title: string;
    text: string;
    htmlText: string;
    lines: NotificationLines[];
    incidents: string[];
    links: string[];
    downloadLinks: DownloadLink[];
    incidentDuration: Duration[];
    activeDuration: Duration;
    modificationDate: Date;
}

type NotificationLines = {
    id: string;
    name: string;
    typeOfTransport: string;
    stations: NotificationStation[];
    direction: string;
}

type NotificationStation = {
    id: string;
    name: string;
}

type Duration = {
    fromDate: Date;
    toDate?: Date;
}

type DownloadLink = {
    id: string;
    name: string;
    mimeType: string;
}

export async function getNotifications(): Promise<Notification[]> {
    const res = await fetch("https://www.mvg.de/api/ems/tickers");
    const data = await res.json();
    return data.map((x: Notification) => {
        x.incidentDuration.map((y: Duration) => {
            y.fromDate = new Date(y.fromDate);
            y.toDate = new Date(y.toDate!);
            return y;
        });
        x.activeDuration.fromDate = new Date(x.activeDuration.fromDate);
        x.activeDuration.toDate = new Date(x.activeDuration.toDate!);
        x.modificationDate = new Date(x.modificationDate);
        return x;
    });
}
