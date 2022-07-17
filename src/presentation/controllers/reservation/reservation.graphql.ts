import { gql } from 'apollo-server-express';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';

import { CreateReservationRequest } from '@application/reservation/reservation-create.request';
import { UpdateReservationRequest } from '@application/reservation/reservation-update.request';
import { Token } from '@application/token';
import { ReservationStatus } from '@domain/reservation/reservation-status';
import { LOGGER } from '@domain/shared';
import { Role } from '@domain/user/role';
import { UnauthorizedError } from '@infrastructure/errors';
import { DiContainer } from '@infrastructure/shared/di/di-container';
import { ReservationController } from '@presentation/controllers/reservation';

const ReservationFragment = `
        _id: String
        _rev: String
        userId: String
        name: String!
        expectedArriveTime: String!
    `;
const ContactInfoFragment = `
        email: String
        tel: String!
    `;
const ReservationTableFragment = `
        personCount: Int!
        babyCount: Int!
        position: String!
    `;

const checkHasRole = (context: { currentUser: Token }, ...roles: Role[]) => {
  if (!context.currentUser || roles.every(role => !context.currentUser.roles?.includes(role))) {
    throw new UnauthorizedError();
  }
};
const checkIsGuest = (context: { currentUser: Token }) => {
  return checkHasRole(context, Role.Guest);
};
// const _checkIsEmployee = (context: { currentUser: Token }) => {
//   return checkHasRole(context, Role.Employee);
// }
const checkIsEmployeeOrGuest = (context: { currentUser: Token }) => {
  return checkHasRole(context, Role.Employee, Role.Guest);
};

const controller = () => {
  const reservationController: ReservationController = DiContainer.diContainer.resolve(
    'reservationController'
  ) as ReservationController;
  return reservationController;
};

const typeDefinitions = gql`
  enum ReservationStatus {
    Pending
    Canceled
    Completed
  }

  type ContactInfo {
    ${ContactInfoFragment}
  }
  input ContactInfoInput {
    ${ContactInfoFragment}
  }

  type ReservationTable {
    ${ReservationTableFragment}
  }
  input ReservationTableInput {
    ${ReservationTableFragment}
  }
  type Reservation {
      ${ReservationFragment}
      contactInfo: ContactInfo!
      table: ReservationTable!
      status: String!
  }
  input ReservationInput {
      ${ReservationFragment}
      contactInfo: ContactInfoInput!
      table: ReservationTableInput!
  }
  extend type Mutation {
    createReservation(
      reservation: ReservationInput!
    ): Reservation!
    updateReservation(
      reservation: ReservationInput!
    ): Reservation!
    updateReservationStatus(
      id: String!
      status: String!
    ): Reservation!
  }
  extend type Query {
    getReservation(
      id: String!
    ): Reservation
    listAllReservation: [Reservation!]!
  }
`;
const resolvers = {
  // Date: dateScalar,
  Query: {
    getReservation: async (_: any, arguments_: { id: string }, context: { currentUser: Token }) => {
      try {
        checkIsEmployeeOrGuest(context);
        const reservationController = controller();
        return await reservationController.getReservation(arguments_.id, context.currentUser);
      } finally {
        LOGGER.info('GetReservation:' + arguments_.id);
      }
    },
    listAllReservation: async (_: any, _arguments: any, context: { currentUser: Token }) => {
      try {
        checkIsEmployeeOrGuest(context);
        const reservationController = controller();
        return await reservationController.listReservation(context.currentUser);
      } finally {
        LOGGER.info('ListAllReservation:');
      }
    }
  },
  Mutation: {
    createReservation: async (_: any, arguments_: { reservation: any }, context: { currentUser: Token }) => {
      checkIsGuest(context);
      const reservationController = controller();
      try {
        const reservationParsed = plainToClass(CreateReservationRequest, arguments_.reservation);
        await validateOrReject(reservationParsed);
        return await reservationController.createReservation(reservationParsed, context.currentUser);
      } finally {
        LOGGER.info('CreateReservation:' + JSON.stringify(arguments_.reservation));
      }
    },
    updateReservation: async (_: any, arguments_: { reservation: any }, context: { currentUser: Token }) => {
      checkIsEmployeeOrGuest(context);
      const reservationController = controller();
      try {
        const reservationParsed: UpdateReservationRequest = plainToClass(
          UpdateReservationRequest,
          arguments_.reservation
        );
        if (!reservationParsed._id) {
          return null;
        }
        await validateOrReject(reservationParsed);
        return await reservationController.updateReservation(
          reservationParsed._id,
          reservationParsed,
          context.currentUser
        );
      } finally {
        LOGGER.info('UpdateReservationStatus:' + JSON.stringify(arguments_.reservation));
      }
    },
    updateReservationStatus: async (
      _: any,
      arguments_: { id: string; status: ReservationStatus },
      context: { currentUser: Token }
    ) => {
      checkIsEmployeeOrGuest(context);
      const reservationController = controller();
      try {
        return await reservationController.updateReservationStatus(
          arguments_.id,
          arguments_.status,
          context.currentUser
        );
      } finally {
        LOGGER.info('UpdateReservationStatus:' + arguments_.id + ',' + arguments_.status);
      }
    }
  }
};

export { resolvers, typeDefinitions };
