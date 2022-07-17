import { DateTime } from 'luxon';

import { BadRequestError } from '@infrastructure/errors/bad-request.error';

const dateTransformer = (value: string | Date) => {
  if (!value) {
    return null;
  } else if (value instanceof Date) {
    return DateTime.fromJSDate(value as Date)
      .toUTC(0)
      .toISO({});
    // return DateTime.fromJSDate(value as Date).toFormat('yyyy-LL-dd HH:mm')
  } else if (typeof value === 'string') {
    const result = DateTime.fromISO(value as string).toJSDate();
    if (!result) {
      throw new BadRequestError('date string is not of iso format:' + value);
    }
    return result;
    // return DateTime.fromFormat(value as string, 'yyyy-LL-dd HH:mm').toJSDate()
  } else {
    return null;
  }
};

export default dateTransformer;
