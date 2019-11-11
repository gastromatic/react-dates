/**
 * @param   {Moment}                                            startDate
 * @returns {{endDate: *, startDate: *}}
 */
export default function getOtrTimeRange(startDate) {
  const monthDate = startDate.clone().startOf('week').startOf('month');
  return {
    startDate: monthDate.clone().startOf('week'),
    endDate: monthDate.clone().endOf('month').endOf('week').startOf('day'),
  };
}
