import { Marker } from "leaflet";

export class CustomMarker extends Marker{
    id:number;

    constructor(options, id:number){
        super(options);
        this.id = id;
    }
}