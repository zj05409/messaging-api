// import 'reflect-metadata';

import { classToPlain, plainToClass } from 'class-transformer';

class GetReservationRequest {
  id: string;

  userId: string;

  // constructor(name: string, contactInfo: ContactInfo, expectedArriveTime: Date, table: ReservationTable) {
  //   this.name = name;
  //   this.contactInfo = contactInfo;
  //   this.expectedArriveTime = expectedArriveTime;
  //   this.table = table;
  // }

  static fromJson(json: any) {
    return plainToClass(GetReservationRequest, json);
  }

  toJson() {
    return classToPlain(this);
  }
}

export { GetReservationRequest };
