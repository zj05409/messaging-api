import { IReservationDao } from '@/persistence/reservation/reservation.dao';
import { ListReservationRequest } from '@application/reservation/reservation-list.request';
import { BaseUseCase } from '@application/shared/base.usecase';
import { Reservation } from '@domain/reservation/reservation';

class ReservationListUseCase implements BaseUseCase<ListReservationRequest, Promise<Reservation[]>> {
  private reservationDao: IReservationDao;

  constructor(reservationDao: IReservationDao) {
    this.reservationDao = reservationDao;
  }

  async execute(request: ListReservationRequest): Promise<Reservation[]> {
    return this.reservationDao.listReservation(request.userId);
  }
}

export { ReservationListUseCase };
