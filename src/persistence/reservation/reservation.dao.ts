import { DatabaseScope, DocumentScope, ServerScope } from 'nano';

import { PersistenceError } from '@/persistence/shared/persistence.error';
import { Reservation } from '@domain/reservation/reservation';
import { LOGGER } from '@domain/shared';
// import {classToPlain} from "class-transformer";

interface IReservationDao {
  listReservation(user_id: string | null): Promise<Reservation[]>;
  getReservation(id: string): Promise<Reservation>;
  createOrReplaceReservation(reservation: Reservation): Promise<Reservation>;
}
class ReservationDao implements IReservationDao {
  private db: DatabaseScope;

  private repo: DocumentScope<Reservation> | null;

  constructor(repo: ServerScope) {
    // let nano: ServerScope = <ServerScope>Nano('http://localhost:5984');
    this.db = repo.db;
    // this.db.destroy('reservation').then(()=>{
    //   this.db.create('reservation')
    // }).then(()=> {
    //   this.repo = this.db.use('reservation');
    // }).catch(()=>{
    //   this.repo = this.db.use('reservation');
    // })
  }

  async listReservation(user_id: string | null = null): Promise<Reservation[]> {
    try {
      if (!this.repo) {
        await this.initDb();
      }
      this.repo = this.db.use('reservation');
      const result = await this.repo.find({
        selector: user_id
          ? {
              userId: { $eq: user_id }
            }
          : {}
      });
      // if (!response.ok) {
      //   throw new PersistenceError();
      // }
      // return Reservation.fromJson(response);
      return result.docs;
    } catch (error) {
      LOGGER.error(error);
      throw new PersistenceError();
    } finally {
      this.repo = null;
    }
  }

  async getReservation(id: string): Promise<Reservation> {
    try {
      if (!this.repo) {
        await this.initDb();
      }
      this.repo = this.db.use('reservation');
      // if (!response.ok) {
      //   throw new PersistenceError();
      // }
      // return Reservation.fromJson(response);
      return await this.repo.get(id);
    } catch (error) {
      LOGGER.error(error);
      throw new PersistenceError();
    } finally {
      this.repo = null;
    }
  }

  async createOrReplaceReservation(reservation: Reservation): Promise<Reservation> {
    try {
      if (!this.repo) {
        await this.initDb();
      }
      this.repo = this.db.use('reservation');
      const response = await this.repo.insert(reservation);
      if (!response.ok) {
        throw new PersistenceError();
      }
      reservation._id = response.id;
      reservation._rev = response.rev;
      return reservation;
    } catch (error) {
      LOGGER.error(error);
      throw new PersistenceError();
    } finally {
      this.repo = null;
    }
  }

  private async initDb() {
    if (!this.repo) {
      // this.repo = this.db.use('reservation');
      // if(this.repo) {
      //   return;
      // }
      try {
        const databaseList = await this.db.list();
        if (!databaseList.includes('reservation')) {
          await this.db.create('reservation');
        }
      } catch (error) {
        LOGGER.error(error);
      }
    }
  }
}

export { IReservationDao, ReservationDao };
