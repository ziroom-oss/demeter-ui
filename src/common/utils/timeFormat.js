import dayjs from 'dayjs';

export function dateFormatFromTableTime(value) {
  return dayjs(value).format('YYYY-MM-DD HH:mm');
}
