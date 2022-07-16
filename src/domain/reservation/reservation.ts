import 'reflect-metadata';

import { classToPlain, Transform, Type } from 'class-transformer';
import { MinLength } from 'class-validator';

import { ContactInfo } from '@domain/reservation/contact-info';
import { ReservationStatus } from '@domain/reservation/reservation-status';
import { ReservationTable } from '@domain/reservation/reservation-table';
import dateTransformer from '@domain/shared/date.transformer';

class Reservation {
  @MinLength(1)
  name: string;

  @Type(() => ContactInfo)
  contactInfo: ContactInfo;

  @Transform(dateTransformer)
  expectedArriveTime: Date;

  @Type(() => ReservationTable)
  table: ReservationTable;

  status: ReservationStatus = ReservationStatus.Pending;

  _id: string;

  _rev: string;

  userId: string;

  constructor(
    userId: string,
    name: string,
    contactInfo: ContactInfo,
    expectedArriveTime: Date,
    table: ReservationTable,
    status: ReservationStatus = ReservationStatus.Pending
  ) {
    this.userId = userId;
    this.name = name;
    this.contactInfo = contactInfo;
    this.expectedArriveTime = expectedArriveTime;
    this.table = table;
    this.status = status;
  }

  toJson() {
    return classToPlain(this);
  }

  // static fromJson(json: any) {
  //   return plainToClass(Reservation, json);
  // }
}

export { Reservation };
