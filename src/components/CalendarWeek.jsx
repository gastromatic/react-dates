import React from 'react';
import PropTypes from 'prop-types';
import { forbidExtraProps, or, childrenOfType, number } from 'airbnb-prop-types';

import CalendarDay from './CalendarDay';
import CustomizableCalendarDay from './CustomizableCalendarDay';

const propTypes = forbidExtraProps({
  children: or([childrenOfType('*'), childrenOfType(CalendarDay), childrenOfType(CustomizableCalendarDay)]).isRequired,
});

export default function CalendarWeek({ children }) {
  return <tr>{children}</tr>;
}

CalendarWeek.propTypes = propTypes;
