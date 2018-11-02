export class RawPsi{
    region_metadata: {
        name:string;
        label_location:{
            latitude:number;
            longitude:number;
        }
    }[];
    items:{
        readings: {
            psi_twenty_four_hourly:{
                west:number;
                east:number;
                central:number;
                south:number;
                north:number;
            }
        }
    }[];
}