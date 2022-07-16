import { IReservationDao } from '@/persistence/reservation/reservation.dao';
import { UpdateReservationRequest } from '@application/reservation/reservation-update.request';
import { UpdateReservationResponse } from '@application/reservation/reservation-update.response';
import { BaseUseCase } from '@application/shared/base.usecase';
import { ForbiddenError } from '@infrastructure/errors';

class ReservationUpdateUseCase implements BaseUseCase<UpdateReservationRequest, Promise<UpdateReservationResponse>> {
  private reservationDao: IReservationDao;

  constructor(reservationDao: IReservationDao) {
    this.reservationDao = reservationDao;
  }

  async execute(request: UpdateReservationRequest): Promise<UpdateReservationResponse> {
    const reservation = await this.reservationDao.getReservation(request._id);
    if (request.userId && reservation.userId !== request.userId) {
      throw new ForbiddenError();
    }
    reservation.name = request.name || reservation.name;
    reservation.contactInfo = request.contactInfo || reservation.contactInfo;
    reservation.expectedArriveTime = request.expectedArriveTime || reservation.expectedArriveTime;
    reservation.table = request.table || reservation.table;
    const result = await this.reservationDao.createOrReplaceReservation(reservation);
    return UpdateReservationResponse.fromDomainModel(result);
  }
}

export { ReservationUpdateUseCase };
