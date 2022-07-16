import { plainToClass } from 'class-transformer';

import { ContactInfo } from '@domain/reservation/contact-info';
import { Reservation } from '@domain/reservation/reservation';
import { ReservationStatus } from '@domain/reservation/reservation-status';
import { ReservationTable } from '@domain/reservation/reservation-table';
import { TablePosition } from '@domain/reservation/table-position';

const reservationJson = {
  userId: '1',
  name: 'Jacob',
  contactInfo: { tel: '13988866666', email: 'jacob@sunmail.com' },
  expectedArriveTime: '2022-10-01T06:00:00.000Z',
  table: {
    personCount: 4,
    babyCount: 2,
    position: 'Lobby'
  }
};
const reservationResultJson = {
  ...reservationJson,
  status: ReservationStatus.Pending
};
const reservation = new Reservation(
  '1',
  'Jacob',
  new ContactInfo('13988866666', 'jacob@sunmail.com'),
  new Date('2022-10-01T06:00:00.000Z'),
  new ReservationTable(4, 2, TablePosition.Lobby)
);

describe('Testing Reservation generation', () => {
  it('should return a valid Reservation from json data', () => {
    return expect(plainToClass(Reservation, reservationJson)).toEqual(reservation);
  });
});
describe('Testing Reservation parsing', () => {
  it('should return valid json data from a Reservation', () => {
    return expect(reservation.toJson()).toEqual(reservationResultJson);
  });
});
