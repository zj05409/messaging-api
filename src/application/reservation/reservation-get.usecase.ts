import { IReservationDao } from '@/persistence/reservation/reservation.dao';
import { GetReservationRequest } from '@application/reservation/reservation-get.request';
import { BaseUseCase } from '@application/shared/base.usecase';
import { Reservation } from '@domain/reservation/reservation';
import { ForbiddenError } from '@infrastructure/errors';

class ReservationGetUseCase implements BaseUseCase<GetReservationRequest, Promise<Reservation>> {
  private reservationDao: IReservationDao;

  constructor(reservationDao: IReservationDao) {
    this.reservationDao = reservationDao;
  }

  async execute(request: GetReservationRequest): Promise<Reservation> {
    const reservation = await this.reservationDao.getReservation(request.id);
    if (!reservation || (request.userId && reservation.userId !== request.userId)) {
      throw new ForbiddenError();
    }
    return reservation;
  }
}

export { ReservationGetUseCase };
