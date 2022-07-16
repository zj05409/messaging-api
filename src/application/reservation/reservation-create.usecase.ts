import { IReservationDao } from '@/persistence/reservation/reservation.dao';
import { CreateReservationRequest } from '@application/reservation/reservation-create.request';
import { BaseUseCase } from '@application/shared/base.usecase';
import { Reservation } from '@domain/reservation/reservation';
import { ReservationStatus } from '@domain/reservation/reservation-status';

import { CreateReservationResponse } from './reservation-create.response';

class ReservationCreateUseCase implements BaseUseCase<CreateReservationRequest, Promise<CreateReservationResponse>> {
  private reservationDao: IReservationDao;

  constructor(reservationDao: IReservationDao) {
    this.reservationDao = reservationDao;
  }

  async execute(request: CreateReservationRequest): Promise<CreateReservationResponse> {
    const result = await this.reservationDao.createOrReplaceReservation(
      new Reservation(
        request.userId,
        request.name,
        request.contactInfo,
        request.expectedArriveTime,
        request.table,
        ReservationStatus.Pending
      )
    );
    return CreateReservationResponse.fromDomainModel(result);
  }
}

export { ReservationCreateUseCase };
