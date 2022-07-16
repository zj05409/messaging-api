import { ContactInfo } from '@domain/reservation/contact-info';
import { Reservation } from '@domain/reservation/reservation';
import { ReservationStatus } from '@domain/reservation/reservation-status';
import { ReservationTable } from '@domain/reservation/reservation-table';

class UpdateReservationResponse extends Reservation {
  constructor(
    _id: string,
    _rev: string,
    userId: string,
    name: string,
    contactInfo: ContactInfo,
    expectedArriveTime: Date,
    table: ReservationTable,
    status: ReservationStatus
  ) {
    super(userId, name, contactInfo, expectedArriveTime, table, status);
    this._id = _id;
    this._rev = _rev;
  }

  public static fromDomainModel(reservation: Reservation): UpdateReservationResponse {
    return new UpdateReservationResponse(
      reservation._id,
      reservation._rev,
      reservation.userId,
      reservation.name,
      reservation.contactInfo,
      reservation.expectedArriveTime,
      reservation.table,
      reservation.status
    );
  }
}

export { UpdateReservationResponse };
