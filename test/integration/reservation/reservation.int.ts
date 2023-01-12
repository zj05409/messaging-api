import { CreateReservationResponse, ReservationCreateUseCase } from '@application/reservation';
import { ContactInfo } from '@domain/reservation/contact-info';
import { Reservation } from '@domain/reservation/reservation';
import { ReservationStatus } from '@domain/reservation/reservation-status';
import { ReservationTable } from '@domain/reservation/reservation-table';
import { TablePosition } from '@domain/reservation/table-position';
import { ReservationDao } from '@test/integration/reservation/dao/reservation.dao';

describe('Testing create reservation use case', () => {
  it('should return not null reservation object', () => {
    const reservation = new Reservation(
      '1',
      'Jacob',
      new ContactInfo('13988866666', 'jacob@sunmail.com'),
      new Date('2022-10-01T06:00:00.000Z'),
      new ReservationTable(4, 2, TablePosition.Lobby)
    );
    const reservationCreateUsecase = new ReservationCreateUseCase(new ReservationDao());
    return expect(reservationCreateUsecase.execute(reservation)).resolves.toEqual(
      new CreateReservationResponse(
        'id1',
        'rev1',
        '1',
        'Jacob',
        new ContactInfo('13988866666', 'jacob@sunmail.com'),
        new Date('2022-10-01T06:00:00.000Z'),
        new ReservationTable(4, 2, TablePosition.Lobby),
        ReservationStatus.Pending
      )
    );
  });
});
