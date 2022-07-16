// import 'reflect-metadata';

import { classToPlain, Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNotEmptyObject, MinLength, ValidateNested } from 'class-validator';

import { ContactInfo } from '@domain/reservation/contact-info';
import { ReservationTable } from '@domain/reservation/reservation-table';
import dateTransformer from '@domain/shared/date.transformer';

class UpdateReservationRequest {
  @MinLength(2)
  name: string;

  @Type(() => ContactInfo)
  @IsNotEmptyObject()
  @ValidateNested()
  contactInfo: ContactInfo;

  @Transform(dateTransformer)
  @IsNotEmpty()
  expectedArriveTime: Date;

  @Type(() => ReservationTable)
  @IsNotEmptyObject()
  @ValidateNested()
  table: ReservationTable;

  // constructor(name: string, contactInfo: ContactInfo, expectedArriveTime: Date, table: ReservationTable) {
  //   this.name = name;
  //   this.contactInfo = contactInfo;
  //   this.expectedArriveTime = expectedArriveTime;
  //   this.table = table;
  // }

  _id: string;

  userId: string;

  toJson() {
    return classToPlain(this);
  }

  // static fromJson(json: any) {
  //   return plainToClass(UpdateReservationRequest, json);
  // }
}

export { UpdateReservationRequest };
