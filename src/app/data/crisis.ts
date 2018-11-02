export class Crisis{
    id: number;
    name:string;
    mobile_number:string;
    street_name:string;
    description:string;
    injured_people_num:number;
    status:string;
    create_date_time:string;
    crisis_type:number;
    assistance:number[];
    datetime?:Date;
    type?:string;
    location?:[number, number];
}

export class CrisisType{
    id:number;
    crisis_type:string;
}
