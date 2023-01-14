import { DateTime } from 'luxon';

import { BadRequestError } from '@infrastructure/errors/bad-request.error';

const dateTransformer = (value: string | Date) => {
  if (!value) {
    return null;
  } else if (value instanceof Date) {
    return DateTime.fromJSDate(value as Date)
      .toUTC(0)
      .toISO({});
  } else if (typeof value === 'string') {
    const result = DateTime.fromISO(value as string).toJSDate();
    if (!result) {
      throw new BadRequestError('date string is not of iso format:' + value);
    }
    return result;
  } else {
    return null;
  }
};

export default dateTransformer;
