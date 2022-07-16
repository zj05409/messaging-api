import { IsEnum, Min } from 'class-validator';

import { TablePosition } from '@domain/reservation/table-position';

class ReservationTable {
  @Min(1)
  personCount = 1;

  @Min(0)
  babyCount = 0;

  // position: 'Lobby'|'PrivateRoom' = 'Lobby'
  @IsEnum(TablePosition)
  position: TablePosition = TablePosition.Lobby;

  constructor(personCount: number, babyCount: number, position: TablePosition) {
    this.personCount = personCount;
    this.babyCount = babyCount;
    this.position = position;
  }
}

export { ReservationTable };
