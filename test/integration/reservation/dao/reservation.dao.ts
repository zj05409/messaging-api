// import { LOGGER } from '@domain/shared';
// import {PersistenceError} from "@/persistence/shared/persistence.error";
import { IReservationDao } from '@/persistence/reservation/reservation.dao';
import { Reservation } from '@domain/reservation/reservation';
import { ForbiddenError } from '@infrastructure/errors';

class ReservationDao implements IReservationDao {
  private sequence = 0;

  private reservations: Reservation[] = [];

  async listReservation(user_id: string | null): Promise<Reservation[]> {
    return user_id ? this.reservations.filter(r => r.userId === user_id) : this.reservations;
  }

  async getReservation(id: string): Promise<Reservation> {
    const result = this.reservations.find(r => r._id === id);
    if (result) {
      return result;
    } else {
      throw new ForbiddenError();
    }
  }

  async createOrReplaceReservation(reservation: Reservation): Promise<Reservation> {
    this.reservations.push(reservation);
    this.sequence += 1;
    reservation._id = 'id' + this.sequence;
    reservation._rev = 'rev' + this.sequence;
    return reservation;
  }
}

export { ReservationDao };
