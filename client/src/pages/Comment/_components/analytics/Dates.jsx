import { getDate } from '../../utils/getDate';

export const Dates = ({ next, last }) => {
  const lastUpdatedLocalTime = getDate(last);
  const nextUpdatedLocalTime = getDate(next);
  return (
    <>
      <p>Last update - {lastUpdatedLocalTime}</p>
      <p>Next update - {nextUpdatedLocalTime}</p>
    </>
  );
};
