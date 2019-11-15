/* eslint react/no-array-index-key: 0 */

import React from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import { forbidExtraProps, mutuallyExclusiveProps, nonNegativeInteger } from 'airbnb-prop-types';
import { withStyles, withStylesPropTypes } from 'react-with-styles';
import moment from 'moment';

import { CalendarDayPhrases } from '../defaultPhrases';
import getPhrasePropTypes from '../utils/getPhrasePropTypes';

import CalendarWeek from './CalendarWeek';
import CalendarDay from './CalendarDay';

import calculateDimension from '../utils/calculateDimension';
import getCalendarMonthWeeks from '../utils/getCalendarMonthWeeks';
import isSameDay from '../utils/isSameDay';
import toISODateString from '../utils/toISODateString';
import getOtrTimeRange from '../utils/getOtrTimeRange';

import ModifiersShape from '../shapes/ModifiersShape';
import ScrollableOrientationShape from '../shapes/ScrollableOrientationShape';
import DayOfWeekShape from '../shapes/DayOfWeekShape';

import noflip from '../utils/noflip';


import {
  HORIZONTAL_ORIENTATION,
  VERTICAL_SCROLLABLE,
  DAY_SIZE,
  START_DATE,
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
  errorMessage: PropTypes.string,
  showAllCaptions: PropTypes.bool,
  monthIndex: PropTypes.number,
  endDate: momentPropTypes.momentObj,
  startDate: momentPropTypes.momentObj,
  missingWeeks: PropTypes.object,
  onFocusChange: PropTypes.func,
  caption: PropTypes.string.isRequired,
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
  renderCalendarDay: (props) => (<CalendarDay {...props} />),
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
    this.getLastInvalidWeek = this.getLastInvalidWeek.bind(this);
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
    const { onDatesChange, onFocusChange } = this.props;
    let newStartDate = startDate.clone();

    if (this.isBlocked(startDate) && this.isBlocked(endDate)) {
      return;
    }
    for (var m = moment(startDate).clone(); m.diff(endDate, 'days') <= 0; m.add(1, 'days')) {
      if (!this.isBlocked(m)) {
        newStartDate = m.clone();
        break;
      }
    }

    onDatesChange({ startDate: newStartDate, endDate });
    onFocusChange(START_DATE);
  }

  getLastInvalidWeek(startDate, endDate) {
    const { weeks } = this.state;
    let lastInvalidWeek = null;
    const { startDate: otrStartDate, endDate: otrEndDate } = getOtrTimeRange(startDate);

    weeks.forEach((week, i) => {
      week.forEach((day) => {
        if (day.isBetween(startDate, endDate, 'days') && !day.isBetween(otrStartDate, otrEndDate, 'days')) {
          lastInvalidWeek = i;
        }
      });
    });
    return lastInvalidWeek;
  }

  render() {
    const {
      css,
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
      errorMessage,
      showAllCaptions,
      monthIndex,
      startDate,
      endDate,
      missingWeeks,
      caption,
    } = this.props;

    const { weeks } = this.state;
    const monthTitle = renderMonthText ? renderMonthText(month) : month.format(monthFormat);

    const currentMonth = month.clone();
    const verticalScrollable = orientation === VERTICAL_SCROLLABLE;

    let lastInvalidWeek = this.getLastInvalidWeek(startDate, endDate);

    const lastPeriodMonth = endDate && currentMonth && endDate.month() === currentMonth.month();

    const isFirstDay = currentMonth.clone().startOf('month').isoWeekday() === 1;
    const firstWeekIndex = currentMonth.clone().startOf('month').add(isFirstDay ? 0 : 1, 'weeks').isoWeek();
    const lastWeekIndex = currentMonth.clone().endOf('month').isoWeek();
    const activePeriod = `${caption} ${currentMonth.month() + 1} (KW ${firstWeekIndex} - KW ${lastWeekIndex})`;


    const currentMonthIndex = currentMonth.month();
    const year = currentMonth.year();
    const startWeekMonth = startDate && startDate.clone().startOf('isoWeek').month();

    const displayCaption = showAllCaptions || (!showAllCaptions && !startDate && monthIndex === 1)
      || (startDate && ((startDate.month() === currentMonthIndex && startDate.year() === year && currentMonthIndex === startWeekMonth)
        || (startDate.month() === (currentMonthIndex + 1) && startDate.year() === year && startWeekMonth === startDate.clone().subtract(1, 'month').month())
      ));

    let startWeek = null;
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
            <div {...css(styles.DayPicker_activePeriod)} style={{ opacity: displayCaption ? 1 : 0 }} aria-hidden="true" role="presentation">{activePeriod}</div>
          )}
        </div>

        <table
          {...css(
            !verticalBorderSpacing && styles.CalendarMonth_table,
            displayCaption && styles.OP_selected,
            verticalBorderSpacing && styles.CalendarMonth_verticalSpacing,
            verticalBorderSpacing && { borderSpacing: `0px ${verticalBorderSpacing}px` },
          )}
          role="presentation"
        >
          <tbody>
            {weeks.map((week, i) => {
              let res = !(i === 0 && Number(week[0] && week[0].date()) > 7) ? (
                [<CalendarWeek key={i}>
                  <td className={`${styles.CalendarMonth_weekNumber} ${week[0] && missingWeeks && missingWeeks[`${week[0] && week[0].year()}${week[0] && week[0].isoWeek()}`] ? 'missingWeek' : ''}`} onClick={() => { this.setWeek({ startDate: week[0], endDate: week[6] }); }}>
                    {i === 0 && Number(week[0] && week[0].date()) > 7
                      ? ''
                      : `${week[0] && week[0].isoWeek()}`}
                  </td>
                  {week.map((day, dayOfWeek) => renderCalendarDay({
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
                    monthIndex,
                  }))}
                  <td className={styles.CalendarMonth_month}>
                    {(i === 0 && Number(week[0] && week[0].date()) < 8) || (startWeek === null && monthIndex === 1) ? <div>{monthTitle}</div> : ''}
                    {i === weeks.length - 1 && Number(week[6] && week[6].date()) < 7
                      ? <div>{month
                        .clone()
                        .add(1, 'month')
                        .format(monthFormat)}
                        <div className="divider"></div>
                      </div>
                      : ''}
                  </td>
                </CalendarWeek>,
                  lastInvalidWeek === i && lastPeriodMonth && errorMessage ? (
                    <CalendarWeek key={`${i}_error`}>
                      <td className={styles.CalendarMonth_invalidWeek} />
                      <td
                        colSpan={7}
                        {...css(
                          styles.CalendarMonth_errorPeriod,
                        )}
                      >
                        {errorMessage}
                      </td>
                      <td />
                    </CalendarWeek>
                  ) : null,
                ]) : null
                startWeek = res ? i : null;
              return res;
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

CalendarMonth.propTypes = propTypes;
CalendarMonth.defaultProps = defaultProps;

export default withStyles(({
  reactDates: {
    color, font, spacing, zIndex,
  },
}) => ({
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
  },
  DayPicker_activePeriod: {
    fontSize: 10,
    color: color.placeholderText,
    zIndex: zIndex + 2,
    textAlign: noflip('left'),
  },
  OP_selected: {
  },
  CalendarMonth_month: {
    padding: '5px 5px 5px 10px',
    textAlign: 'left'
  },
  CalendarMonth_weekNumber: {
    padding: 5
  },
  CalendarMonth_invalidWeek: {
    width: 10
  }
}), { pureComponent: typeof React.PureComponent !== 'undefined' })(CalendarMonth);
