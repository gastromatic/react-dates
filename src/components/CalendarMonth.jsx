/* eslint react/no-array-index-key: 0 */

import React from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import { forbidExtraProps, mutuallyExclusiveProps, nonNegativeInteger } from 'airbnb-prop-types';
import { css, withStyles, withStylesPropTypes } from 'react-with-styles';
import moment from 'moment';

import { CalendarDayPhrases } from '../defaultPhrases';
import getPhrasePropTypes from '../utils/getPhrasePropTypes';

import CalendarWeek from './CalendarWeek';
import CalendarDay from './CalendarDay';

import calculateDimension from '../utils/calculateDimension';
import getCalendarMonthWeeks from '../utils/getCalendarMonthWeeks';
import isSameDay from '../utils/isSameDay';
import toISODateString from '../utils/toISODateString';

import ModifiersShape from '../shapes/ModifiersShape';
import ScrollableOrientationShape from '../shapes/ScrollableOrientationShape';
import DayOfWeekShape from '../shapes/DayOfWeekShape';


import {
  HORIZONTAL_ORIENTATION,
  VERTICAL_SCROLLABLE,
  DAY_SIZE,
} from '../constants';

const propTypes = forbidExtraProps({
  ...withStylesPropTypes,
  month: momentPropTypes.momentObj,
  horizontalMonthPadding: nonNegativeInteger,
  isVisible: PropTypes.bool,
  enableOutsideDays: PropTypes.bool,
  modifiers: PropTypes.objectOf(ModifiersShape),
  orientation: ScrollableOrientationShape,
  daySize: nonNegativeInteger,
  onDayClick: PropTypes.func,
  onDayMouseEnter: PropTypes.func,
  onDayMouseLeave: PropTypes.func,
  onMonthSelect: PropTypes.func,
  onYearSelect: PropTypes.func,
  renderMonthText: mutuallyExclusiveProps(PropTypes.func, 'renderMonthText', 'renderMonthElement'),
  renderCalendarDay: PropTypes.func,
  renderDayContents: PropTypes.func,
  renderMonthElement: mutuallyExclusiveProps(PropTypes.func, 'renderMonthText', 'renderMonthElement'),
  firstDayOfWeek: DayOfWeekShape,
  setMonthTitleHeight: PropTypes.func,
  verticalBorderSpacing: nonNegativeInteger,

  focusedDate: momentPropTypes.momentObj, // indicates focusable day
  isFocused: PropTypes.bool, // indicates whether or not to move focus to focusable day

  // i18n
  monthFormat: PropTypes.string,
  phrases: PropTypes.shape(getPhrasePropTypes(CalendarDayPhrases)),
  dayAriaLabelFormat: PropTypes.string,
  onDatesChange: PropTypes.func,
  isDayBlocked: PropTypes.func,
  isOutsideRange: PropTypes.func,
});

const defaultProps = {
  month: moment(),
  horizontalMonthPadding: 13,
  isVisible: true,
  enableOutsideDays: false,
  modifiers: {},
  orientation: HORIZONTAL_ORIENTATION,
  daySize: DAY_SIZE,
  onDayClick() {},
  onDayMouseEnter() {},
  onDayMouseLeave() {},
  onMonthSelect() {},
  onYearSelect() {},
  renderMonthText: null,
  renderCalendarDay: props => (<CalendarDay {...props} />),
  renderDayContents: null,
  renderMonthElement: null,
  firstDayOfWeek: null,
  setMonthTitleHeight: null,

  focusedDate: null,
  isFocused: false,

  // i18n
  monthFormat: 'MMMM YYYY', // english locale
  phrases: CalendarDayPhrases,
  dayAriaLabelFormat: undefined,
  verticalBorderSpacing: undefined,
};

class CalendarMonth extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      weeks: getCalendarMonthWeeks(
        props.month,
        props.enableOutsideDays,
        props.firstDayOfWeek == null ? moment.localeData().firstDayOfWeek() : props.firstDayOfWeek,
      ),
    };

    this.setCaptionRef = this.setCaptionRef.bind(this);
    this.setMonthTitleHeight = this.setMonthTitleHeight.bind(this);
    this.isBlocked = this.isBlocked.bind(this);
    this.setWeek = this.setWeek.bind(this);
  }

  componentDidMount() {
    this.setMonthTitleHeightTimeout = setTimeout(this.setMonthTitleHeight, 0);
  }

  componentWillReceiveProps(nextProps) {
    const { month, enableOutsideDays, firstDayOfWeek } = nextProps;
    const {
      month: prevMonth,
      enableOutsideDays: prevEnableOutsideDays,
      firstDayOfWeek: prevFirstDayOfWeek,
    } = this.props;
    if (
      !month.isSame(prevMonth)
      || enableOutsideDays !== prevEnableOutsideDays
      || firstDayOfWeek !== prevFirstDayOfWeek
    ) {
      this.setState({
        weeks: getCalendarMonthWeeks(
          month,
          enableOutsideDays,
          firstDayOfWeek == null ? moment.localeData().firstDayOfWeek() : firstDayOfWeek,
        ),
      });
    }
  }

  componentWillUnmount() {
    if (this.setMonthTitleHeightTimeout) {
      clearTimeout(this.setMonthTitleHeightTimeout);
    }
  }

  setMonthTitleHeight() {
    const { setMonthTitleHeight } = this.props;
    if (setMonthTitleHeight) {
      const captionHeight = calculateDimension(this.captionRef, 'height', true, true);
      setMonthTitleHeight(captionHeight);
    }
  }

  setCaptionRef(ref) {
    this.captionRef = ref;
  }

  isBlocked(day) {
    const { isDayBlocked, isOutsideRange } = this.props;
    return isDayBlocked(day) || isOutsideRange(day);
  }

  setWeek({ startDate, endDate }) {
    const { onDatesChange } = this.props;
    if (this.isBlocked(startDate) || this.isBlocked(endDate)) {
      return;
    }
    onDatesChange({startDate, endDate});
  }

  render() {
    const {
      dayAriaLabelFormat,
      daySize,
      focusedDate,
      horizontalMonthPadding,
      isFocused,
      isVisible,
      modifiers,
      month,
      monthFormat,
      onDayClick,
      onDayMouseEnter,
      onDayMouseLeave,
      onMonthSelect,
      onYearSelect,
      orientation,
      phrases,
      renderCalendarDay,
      renderDayContents,
      renderMonthElement,
      renderMonthText,
      styles,
      verticalBorderSpacing,
      onDatesChange,
    } = this.props;

    const { weeks } = this.state;
    const monthTitle = renderMonthText ? renderMonthText(month) : month.format(monthFormat);

    const currentMonth = month.clone();
    const verticalScrollable = orientation === VERTICAL_SCROLLABLE;

    let lastInvalidWeek = null;

    weeks.forEach((week, i) => {
      week.forEach(day => {
        if (day && modifiers && modifiers[toISODateString(day)]
          && (modifiers[toISODateString(day)].has('invalid-span') || modifiers[toISODateString(day)].has('selected-invalid-end'))) {
          lastInvalidWeek = i;
        }
      })
    })

    return (
      <div
        {...css(
          styles.CalendarMonth,
          { padding: `0 ${horizontalMonthPadding}px` },
        )}
        data-visible={isVisible}
      >
        <div
          ref={this.setCaptionRef}
          {...css(
            styles.CalendarMonth_caption,
            verticalScrollable && styles.CalendarMonth_caption__verticalScrollable,
          )}
        >
          {renderMonthElement ? (
            renderMonthElement({
              month,
              onMonthSelect,
              onYearSelect,
              isVisible,
            })
          ) : (
            <strong>{/* {monthTitle} */}</strong>
          )}
        </div>

        <table
          {...css(
            !verticalBorderSpacing && styles.CalendarMonth_table,
            verticalBorderSpacing && styles.CalendarMonth_verticalSpacing,
            verticalBorderSpacing && { borderSpacing: `0px ${verticalBorderSpacing}px` },
          )}
          role="presentation"
        >
          <tbody>
            {weeks.map((week, i) =>
              !(i === 0 && Number(week[0] && week[0].date()) > 7) ? (
                [<CalendarWeek key={i}>
                  <td style={{ padding: 5 }} onClick={() => {this.setWeek({startDate: week[0], endDate: week[6]})}}>
                    {i === 0 && Number(week[0] && week[0].date()) > 7
                      ? ''
                      : `${week[0] && week[0].week()}`}
                  </td>
                  {week.map((day, dayOfWeek) =>
                    renderCalendarDay({
                      key: dayOfWeek,
                      day,
                      daySize,
                      isOutsideDay: !day || day.month() !== month.month(),
                      tabIndex: isVisible && isSameDay(day, focusedDate) ? 0 : -1,
                      isFocused,
                      onDayMouseEnter,
                      onDayMouseLeave,
                      onDayClick,
                      renderDayContents,
                      phrases,
                      modifiers: modifiers[toISODateString(day)],
                      ariaLabelFormat: dayAriaLabelFormat,
                      currentMonth,
                    }),
                  )}
                  <td style={{ padding: 5, textAlign: 'left' }}>
                    {i === 0 && Number(week[0] && week[0].date()) < 8 ? monthTitle : ''}
                    {i === weeks.length - 1 && Number(week[6] && week[6].date()) < 7
                      ? month
                          .clone()
                          .add(1, 'month')
                          .format(monthFormat)
                      : ''}
                  </td>
                </CalendarWeek>,
                  lastInvalidWeek === i ? <CalendarWeek key={`${i}_error`}>
                  <td></td>
                  <td
                    colSpan={7}
                    {...css(
                      styles.CalendarMonth_errorPeriod,
                    )}
                  >Error message placeholder</td>
                  <td></td>
                </CalendarWeek> : null
              ]) : null,
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

CalendarMonth.propTypes = propTypes;
CalendarMonth.defaultProps = defaultProps;

export default withStyles(({ reactDates: { color, font, spacing } }) => ({
  CalendarMonth: {
    background: color.background,
    textAlign: 'center',
    verticalAlign: 'top',
    userSelect: 'none',
  },

  CalendarMonth_table: {
    borderCollapse: 'collapse',
    borderSpacing: 0,
  },

  CalendarMonth_verticalSpacing: {
    borderCollapse: 'separate',
  },

  CalendarMonth_caption: {
    color: color.text,
    fontSize: font.captionSize,
    textAlign: 'center',
    paddingTop: spacing.captionPaddingTop,
    paddingBottom: spacing.captionPaddingBottom,
    captionSide: 'initial',
  },

  CalendarMonth_caption__verticalScrollable: {
    paddingTop: 12,
    paddingBottom: 7,
  },
  CalendarMonth_errorPeriod: {
    background: '#FF6D6D',
    color: '#fff',
    padding: '5px 10px',
    textAlign: 'left',
  }
}), { pureComponent: typeof React.PureComponent !== 'undefined' })(CalendarMonth);
