export class RawTemp {
    metadata: {
        stations: {
            id: string;
            location:{
                latitude: number;
                longitude: number;
            }
        }[];
    };
    items: {
        readings: {
            station_id: string;
            value: number;
        }[];
    }[]
}