import { format, parseISO, parse } from 'date-fns';
import { enIN } from 'date-fns/locale';

export const formatDateToIST = (date) => {
  if (!date) return 'Invalid Date';
  try {
    const parsedDate = date instanceof Date ? date : new Date(date);
    if (isNaN(parsedDate)) throw new Error('Invalid date value');
    return format(parsedDate, 'EEEE, MMMM d, yyyy', { locale: enIN });
  } catch (error) {
    console.error('Error formatting date:', error, date);
    return 'Invalid Date';
  }
};

export const formatTimeToIST = (time) => {
  if (!time) return 'Invalid Time';
  try {
    const parsedTime = time instanceof Date ? time : new Date(time);
    if (isNaN(parsedTime)) throw new Error('Invalid time value');
    return format(parsedTime, 'hh:mm a', { locale: enIN });
  } catch (error) {
    console.error('Error formatting time:', error, time);
    return 'Invalid Time';
  }
};





export function formatDateToMMM_D_YYYY(date) {
  if (!date) return 'N/A';
  try {
    const parsedDate =
      typeof date === 'string' && date.includes('T') // ISO string
        ? parseISO(date)
        : parse(date, 'EEEE, MMMM d, yyyy', new Date()); // Preformatted string

    return format(parsedDate, 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error, date);
    return 'Invalid Date';
  }
}
