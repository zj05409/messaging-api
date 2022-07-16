// import 'reflect-metadata';

import { classToPlain, Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNotEmptyObject, MinLength, ValidateNested } from 'class-validator';

import { ContactInfo } from '@domain/reservation/contact-info';
import { ReservationTable } from '@domain/reservation/reservation-table';
import dateTransformer from '@domain/shared/date.transformer';

class CreateReservationRequest {
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

  userId: string;

  toJson() {
    return classToPlain(this);
  }

  // static fromJson(json: any) {
  //   return plainToClass(CreateReservationRequest, json);
  // }
}

export { CreateReservationRequest };
