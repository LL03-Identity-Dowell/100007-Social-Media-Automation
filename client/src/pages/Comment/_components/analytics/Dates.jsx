import { getDate } from '../../utils/getDate';

export const Date = ({ next, last }) => {
  const lastDate = getDate(last);
  const nextDate = getDate(next);
  return (
    <>
      <p>Last update - {lastDate}</p>
      <p>Next update - {nextDate}</p>
    </>
  );
};
