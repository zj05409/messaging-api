import { IReservationDao } from '@/persistence/reservation/reservation.dao';
import { UpdateReservationResponse } from '@application/reservation/reservation-update.response';
import { UpdateReservationStatusRequest } from '@application/reservation/reservation-update-status.request';
import { BaseUseCase } from '@application/shared/base.usecase';
import { ReservationStatus } from '@domain/reservation/reservation-status';
import { ForbiddenError } from '@infrastructure/errors';

class ReservationUpdateStatusUseCase
  implements BaseUseCase<UpdateReservationStatusRequest, Promise<UpdateReservationResponse>>
{
  private reservationDao: IReservationDao;

  constructor(reservationDao: IReservationDao) {
    this.reservationDao = reservationDao;
  }

  async execute(request: UpdateReservationStatusRequest): Promise<UpdateReservationResponse> {
    const reservation = await this.reservationDao.getReservation(request._id);
    if (request.userId && reservation.userId !== request.userId) {
      throw new ForbiddenError();
    }
    if (
      request.userId &&
      (reservation.status !== ReservationStatus.Pending || request.status !== ReservationStatus.Canceled)
    ) {
      throw new ForbiddenError();
    }
    if (
      !request.userId &&
      (reservation.status !== ReservationStatus.Pending ||
        ![ReservationStatus.Canceled, ReservationStatus.Completed].includes(request.status))
    ) {
      throw new ForbiddenError();
    }
    reservation.status = request.status;
    return this.reservationDao.createOrReplaceReservation(reservation);
  }
}

export { ReservationUpdateStatusUseCase };
