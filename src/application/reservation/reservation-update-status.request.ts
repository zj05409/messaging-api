// import 'reflect-metadata';

import { classToPlain, plainToClass } from 'class-transformer';

import { ReservationStatus } from '@domain/reservation/reservation-status';

class UpdateReservationStatusRequest {
  _id: string;

  userId: string;

  status: ReservationStatus;

  // constructor(name: string, contactInfo: ContactInfo, expectedArriveTime: Date, table: ReservationTable) {
  //   this.name = name;
  //   this.contactInfo = contactInfo;
  //   this.expectedArriveTime = expectedArriveTime;
  //   this.table = table;
  // }

  static fromJson(json: any) {
    return plainToClass(UpdateReservationStatusRequest, json);
  }

  toJson() {
    return classToPlain(this);
  }
}

export { UpdateReservationStatusRequest };
