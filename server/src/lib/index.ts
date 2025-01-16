import { Months } from '@prisma/client'; // Adjust import based on your setup

export const getMonthName = (index: number): string | undefined => {
  const months: Record<keyof typeof Months, string> = {
    JANUARY: 'January',
    FEBRUARY: 'February',
    MARCH: 'March',
    APRIL: 'April',
    MAY: 'May',
    JUNE: 'June',
    JULY: 'July',
    AUGUST: 'August',
    SEPTEMBER: 'September',
    OCTOBER: 'October',
    NOVEMBER: 'November',
    DECEMBER: 'December',
  };

  const monthKeys = Object.keys(months) as Array<keyof typeof Months>;
  return months[monthKeys[index]];
};
