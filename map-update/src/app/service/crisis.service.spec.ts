import { CrisisService } from "./crisis.service";
import { CrisisType, Crisis } from "../data/crisis";
import { of } from "rxjs";

let httpClientSpy:{get: jasmine.Spy}
let dataService:CrisisService;

describe('DataService', () => {
  beforeEach(() =>{
    httpClientSpy = jasmine.createSpyObj('HttpClient',['get']);
    dataService = new CrisisService(<any>httpClientSpy);
  });

  it('should return expected crisis type (http client called once)',()=>{
    const expectedType:CrisisType[] = [{"id":1,"crisis_type":"Fire"}];

    httpClientSpy.get.and.returnValue(of(expectedType));
    dataService.getCrisisType().subscribe(
      types => expect(types).toEqual(expectedType,'exptected types'),
      fail
    );
    expect(httpClientSpy.get.calls.count()).toBe(1,'one call');
  });

  it('should return expected crisis reprots',()=>{
    const expectedCrisis: Crisis[] = [
      {
          "id": 20,
          "name": "May",
          "mobile_number": "82019374",
          "street_name": "NTU Banyan Hall",
          "description": "heart attack",
          "injured_people_num": 1,
          "status": "U",
          "create_date_time": "2018-11-06T00:41:45.191978+08:00",
          "crisis_type": 3,
          "assistance": [
              '3'
          ]
      }
    ];
    httpClientSpy.get.and.returnValue(of(expectedCrisis));
    dataService.getCrisis().subscribe(
      crisis => expect(crisis).toEqual(expectedCrisis,'expected crisis'),
      fail
    )
  })


});
