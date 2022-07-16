import { StatusCodes } from 'http-status-codes';
import {
  Authorized,
  Body,
  BodyParam,
  CurrentUser,
  Get,
  HttpCode,
  JsonController,
  Param,
  Post,
  Put,
  UseBefore
} from 'routing-controllers';

import { CreateReservationRequest } from '@application/reservation/reservation-create.request';
import { CreateReservationResponse } from '@application/reservation/reservation-create.response';
import { ReservationCreateUseCase } from '@application/reservation/reservation-create.usecase';
import { GetReservationRequest } from '@application/reservation/reservation-get.request';
import { ReservationGetUseCase } from '@application/reservation/reservation-get.usecase';
import { ListReservationRequest } from '@application/reservation/reservation-list.request';
import { ReservationListUseCase } from '@application/reservation/reservation-list.usecase';
import { UpdateReservationRequest } from '@application/reservation/reservation-update.request';
import { ReservationUpdateUseCase } from '@application/reservation/reservation-update.usecase';
import { UpdateReservationStatusRequest } from '@application/reservation/reservation-update-status.request';
import { ReservationUpdateStatusUseCase } from '@application/reservation/reservation-update-status.usecase';
import { Token } from '@application/token';
import { Reservation } from '@domain/reservation/reservation';
import { ReservationStatus } from '@domain/reservation/reservation-status';
import { LOGGER } from '@domain/shared';
import { Role } from '@domain/user/role';
import { AuthenticationMiddleware } from '@presentation/middlewares';
// import {Reservation} from "@domain/reservation/reservation";

@JsonController('/reservation')
class ReservationController {
  private reservationListUseCase: ReservationListUseCase;

  private reservationGetUseCase: ReservationGetUseCase;

  private reservationCreateUseCase: ReservationCreateUseCase;

  private reservationUpdateUseCase: ReservationUpdateUseCase;

  private reservationUpdateStatusUseCase: ReservationUpdateStatusUseCase;

  constructor(
    reservationListUseCase: ReservationListUseCase,
    reservationGetUseCase: ReservationGetUseCase,
    reservationCreateUseCase: ReservationCreateUseCase,
    reservationUpdateUseCase: ReservationUpdateUseCase,
    reservationUpdateStatusUseCase: ReservationUpdateStatusUseCase
  ) {
    this.reservationListUseCase = reservationListUseCase;
    this.reservationGetUseCase = reservationGetUseCase;
    this.reservationCreateUseCase = reservationCreateUseCase;
    this.reservationUpdateUseCase = reservationUpdateUseCase;
    this.reservationUpdateStatusUseCase = reservationUpdateStatusUseCase;
  }

  @Get('/:id')
  @UseBefore(AuthenticationMiddleware)
  @Authorized(['Guest', 'Employee'])
  @HttpCode(StatusCodes.OK)
  async getReservation(@Param('id') id: string, @CurrentUser() user?: Token): Promise<CreateReservationResponse> {
    // console.log(reservation);
    const request = new GetReservationRequest();
    request.id = id;
    if (user && !user.roles?.includes(Role.Employee)) {
      request.userId = user?.userId;
    }
    try {
      return await this.reservationGetUseCase.execute(request);
    } catch (error) {
      LOGGER.error(error);
      throw error;
    }
    // return Promise.resolve(new CreateReservationResponse('id1'));//
  }

  @Get()
  @UseBefore(AuthenticationMiddleware)
  @Authorized(['Guest', 'Employee'])
  @HttpCode(StatusCodes.OK)
  async listReservation(@CurrentUser() user?: Token): Promise<Reservation[]> {
    // console.log(reservation);
    const request = new ListReservationRequest();
    if (user && !user.roles?.includes(Role.Employee)) {
      request.userId = user?.userId;
    }
    try {
      return await this.reservationListUseCase.execute(request);
    } catch (error) {
      LOGGER.error(error);
      throw error;
    }
    // return Promise.resolve(new CreateReservationResponse('id1'));//
  }

  @Post()
  @UseBefore(AuthenticationMiddleware)
  @Authorized('Guest')
  @HttpCode(StatusCodes.OK)
  async createReservation(
    @Body({ validate: true }) request: CreateReservationRequest,
    @CurrentUser() user?: Token
  ): Promise<CreateReservationResponse> {
    // console.log(reservation);
    if (user) {
      request.userId = user.username;
    }
    try {
      return await this.reservationCreateUseCase.execute(request);
    } catch (error) {
      LOGGER.error(error);
      throw error;
    }
    // return Promise.resolve(new CreateReservationResponse('id1'));//
  }

  @Put('/:id')
  @UseBefore(AuthenticationMiddleware)
  @Authorized(['Guest', 'Employee'])
  @HttpCode(StatusCodes.OK)
  async updateReservation(
    @Param('id') id: string,
    @Body({ validate: true }) request: UpdateReservationRequest,
    @CurrentUser() user?: Token
  ): Promise<CreateReservationResponse> {
    // console.log(reservation);
    request._id = id;
    if (user && !user.roles?.includes(Role.Employee)) {
      request.userId = user?.userId;
    }
    try {
      return await this.reservationUpdateUseCase.execute(request);
    } catch (error) {
      LOGGER.error(error);
      throw error;
    }
    // return Promise.resolve(new CreateReservationResponse('id1'));//
  }

  @Put('/:id/status')
  @UseBefore(AuthenticationMiddleware)
  @Authorized(['Guest', 'Employee'])
  @HttpCode(StatusCodes.OK)
  async updateReservationStatus(
    @Param('id') id: string,
    @BodyParam('status') status: ReservationStatus,
    @CurrentUser() user?: Token
  ): Promise<Reservation> {
    // console.log(reservation);
    const request = new UpdateReservationStatusRequest();
    request._id = id;
    request.status = status;
    if (user && !user.roles?.includes(Role.Employee)) {
      request.userId = user?.userId;
    }
    try {
      return await this.reservationUpdateStatusUseCase.execute(request);
    } catch (error) {
      LOGGER.error(error);
      throw error;
    }
  }
}

export { ReservationController };
