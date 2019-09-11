"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _enzymeShallowEqual = _interopRequireDefault(require("enzyme-shallow-equal"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactMomentProptypes = _interopRequireDefault(require("react-moment-proptypes"));

var _airbnbPropTypes = require("airbnb-prop-types");

var _reactWithStyles = require("react-with-styles");

var _moment = _interopRequireDefault(require("moment"));

var _defaultPhrases = require("../defaultPhrases");

var _getPhrasePropTypes = _interopRequireDefault(require("../utils/getPhrasePropTypes"));

var _CalendarWeek = _interopRequireDefault(require("./CalendarWeek"));

var _CalendarDay = _interopRequireDefault(require("./CalendarDay"));

var _calculateDimension = _interopRequireDefault(require("../utils/calculateDimension"));

var _getCalendarMonthWeeks = _interopRequireDefault(require("../utils/getCalendarMonthWeeks"));

var _isSameDay = _interopRequireDefault(require("../utils/isSameDay"));

var _toISODateString = _interopRequireDefault(require("../utils/toISODateString"));

var _ModifiersShape = _interopRequireDefault(require("../shapes/ModifiersShape"));

var _ScrollableOrientationShape = _interopRequireDefault(require("../shapes/ScrollableOrientationShape"));

var _DayOfWeekShape = _interopRequireDefault(require("../shapes/DayOfWeekShape"));

var _noflip = _interopRequireDefault(require("../utils/noflip"));

var _constants = require("../constants");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var propTypes = process.env.NODE_ENV !== "production" ? (0, _airbnbPropTypes.forbidExtraProps)(_objectSpread({}, _reactWithStyles.withStylesPropTypes, {
  month: _reactMomentProptypes["default"].momentObj,
  horizontalMonthPadding: _airbnbPropTypes.nonNegativeInteger,
  isVisible: _propTypes["default"].bool,
  enableOutsideDays: _propTypes["default"].bool,
  modifiers: _propTypes["default"].objectOf(_ModifiersShape["default"]),
  orientation: _ScrollableOrientationShape["default"],
  daySize: _airbnbPropTypes.nonNegativeInteger,
  onDayClick: _propTypes["default"].func,
  onDayMouseEnter: _propTypes["default"].func,
  onDayMouseLeave: _propTypes["default"].func,
  onMonthSelect: _propTypes["default"].func,
  onYearSelect: _propTypes["default"].func,
  renderMonthText: (0, _airbnbPropTypes.mutuallyExclusiveProps)(_propTypes["default"].func, 'renderMonthText', 'renderMonthElement'),
  renderCalendarDay: _propTypes["default"].func,
  renderDayContents: _propTypes["default"].func,
  renderMonthElement: (0, _airbnbPropTypes.mutuallyExclusiveProps)(_propTypes["default"].func, 'renderMonthText', 'renderMonthElement'),
  firstDayOfWeek: _DayOfWeekShape["default"],
  setMonthTitleHeight: _propTypes["default"].func,
  verticalBorderSpacing: _airbnbPropTypes.nonNegativeInteger,
  focusedDate: _reactMomentProptypes["default"].momentObj,
  // indicates focusable day
  isFocused: _propTypes["default"].bool,
  // indicates whether or not to move focus to focusable day
  // i18n
  monthFormat: _propTypes["default"].string,
  phrases: _propTypes["default"].shape((0, _getPhrasePropTypes["default"])(_defaultPhrases.CalendarDayPhrases)),
  dayAriaLabelFormat: _propTypes["default"].string,
  onDatesChange: _propTypes["default"].func,
  isDayBlocked: _propTypes["default"].func,
  isOutsideRange: _propTypes["default"].func,
  errorMessage: _propTypes["default"].string,
  showAllCaptions: _propTypes["default"].bool,
  monthIndex: _propTypes["default"].number,
  endDate: _reactMomentProptypes["default"].momentObj,
  startDate: _reactMomentProptypes["default"].momentObj,
  missingWeeks: _propTypes["default"].object,
  onFocusChange: _propTypes["default"].func
})) : {};
var defaultProps = {
  month: (0, _moment["default"])(),
  horizontalMonthPadding: 13,
  isVisible: true,
  enableOutsideDays: false,
  modifiers: {},
  orientation: _constants.HORIZONTAL_ORIENTATION,
  daySize: _constants.DAY_SIZE,
  onDayClick: function onDayClick() {},
  onDayMouseEnter: function onDayMouseEnter() {},
  onDayMouseLeave: function onDayMouseLeave() {},
  onMonthSelect: function onMonthSelect() {},
  onYearSelect: function onYearSelect() {},
  renderMonthText: null,
  renderCalendarDay: function renderCalendarDay(props) {
    return _react["default"].createElement(_CalendarDay["default"], props);
  },
  renderDayContents: null,
  renderMonthElement: null,
  firstDayOfWeek: null,
  setMonthTitleHeight: null,
  focusedDate: null,
  isFocused: false,
  // i18n
  monthFormat: 'MMMM YYYY',
  // english locale
  phrases: _defaultPhrases.CalendarDayPhrases,
  dayAriaLabelFormat: undefined,
  verticalBorderSpacing: undefined
};

var CalendarMonth =
/*#__PURE__*/
function (_ref) {
  (0, _inheritsLoose2["default"])(CalendarMonth, _ref);
  var _proto = CalendarMonth.prototype;

  _proto[!_react["default"].PureComponent && "shouldComponentUpdate"] = function (nextProps, nextState) {
    return !(0, _enzymeShallowEqual["default"])(this.props, nextProps) || !(0, _enzymeShallowEqual["default"])(this.state, nextState);
  };

  function CalendarMonth(props) {
    var _this;

    _this = _ref.call(this, props) || this;
    _this.state = {
      weeks: (0, _getCalendarMonthWeeks["default"])(props.month, props.enableOutsideDays, props.firstDayOfWeek == null ? _moment["default"].localeData().firstDayOfWeek() : props.firstDayOfWeek)
    };
    _this.setCaptionRef = _this.setCaptionRef.bind((0, _assertThisInitialized2["default"])(_this));
    _this.setMonthTitleHeight = _this.setMonthTitleHeight.bind((0, _assertThisInitialized2["default"])(_this));
    _this.isBlocked = _this.isBlocked.bind((0, _assertThisInitialized2["default"])(_this));
    _this.setWeek = _this.setWeek.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  _proto.componentDidMount = function componentDidMount() {
    this.setMonthTitleHeightTimeout = setTimeout(this.setMonthTitleHeight, 0);
  };

  _proto.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var month = nextProps.month,
        enableOutsideDays = nextProps.enableOutsideDays,
        firstDayOfWeek = nextProps.firstDayOfWeek;
    var _this$props = this.props,
        prevMonth = _this$props.month,
        prevEnableOutsideDays = _this$props.enableOutsideDays,
        prevFirstDayOfWeek = _this$props.firstDayOfWeek;

    if (!month.isSame(prevMonth) || enableOutsideDays !== prevEnableOutsideDays || firstDayOfWeek !== prevFirstDayOfWeek) {
      this.setState({
        weeks: (0, _getCalendarMonthWeeks["default"])(month, enableOutsideDays, firstDayOfWeek == null ? _moment["default"].localeData().firstDayOfWeek() : firstDayOfWeek)
      });
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    if (this.setMonthTitleHeightTimeout) {
      clearTimeout(this.setMonthTitleHeightTimeout);
    }
  };

  _proto.setMonthTitleHeight = function setMonthTitleHeight() {
    var setMonthTitleHeight = this.props.setMonthTitleHeight;

    if (setMonthTitleHeight) {
      var captionHeight = (0, _calculateDimension["default"])(this.captionRef, 'height', true, true);
      setMonthTitleHeight(captionHeight);
    }
  };

  _proto.setCaptionRef = function setCaptionRef(ref) {
    this.captionRef = ref;
  };

  _proto.isBlocked = function isBlocked(day) {
    var _this$props2 = this.props,
        isDayBlocked = _this$props2.isDayBlocked,
        isOutsideRange = _this$props2.isOutsideRange;
    return isDayBlocked(day) || isOutsideRange(day);
  };

  _proto.setWeek = function setWeek(_ref2) {
    var startDate = _ref2.startDate,
        endDate = _ref2.endDate;
    var _this$props3 = this.props,
        onDatesChange = _this$props3.onDatesChange,
        onFocusChange = _this$props3.onFocusChange;
    var newStartDate = startDate.clone();

    if (this.isBlocked(startDate) && this.isBlocked(endDate)) {
      return;
    }

    for (var m = (0, _moment["default"])(startDate).clone(); m.diff(endDate, 'days') <= 0; m.add(1, 'days')) {
      if (!this.isBlocked(m)) {
        newStartDate = m.clone();
        break;
      }
    }

    onDatesChange({
      startDate: newStartDate,
      endDate: endDate
    });
    onFocusChange(_constants.START_DATE);
  };

  _proto.render = function render() {
    var _this2 = this;

    var _this$props4 = this.props,
        dayAriaLabelFormat = _this$props4.dayAriaLabelFormat,
        daySize = _this$props4.daySize,
        focusedDate = _this$props4.focusedDate,
        horizontalMonthPadding = _this$props4.horizontalMonthPadding,
        isFocused = _this$props4.isFocused,
        isVisible = _this$props4.isVisible,
        modifiers = _this$props4.modifiers,
        month = _this$props4.month,
        monthFormat = _this$props4.monthFormat,
        onDayClick = _this$props4.onDayClick,
        onDayMouseEnter = _this$props4.onDayMouseEnter,
        onDayMouseLeave = _this$props4.onDayMouseLeave,
        onMonthSelect = _this$props4.onMonthSelect,
        onYearSelect = _this$props4.onYearSelect,
        orientation = _this$props4.orientation,
        phrases = _this$props4.phrases,
        renderCalendarDay = _this$props4.renderCalendarDay,
        renderDayContents = _this$props4.renderDayContents,
        renderMonthElement = _this$props4.renderMonthElement,
        renderMonthText = _this$props4.renderMonthText,
        styles = _this$props4.styles,
        verticalBorderSpacing = _this$props4.verticalBorderSpacing,
        errorMessage = _this$props4.errorMessage,
        showAllCaptions = _this$props4.showAllCaptions,
        monthIndex = _this$props4.monthIndex,
        startDate = _this$props4.startDate,
        endDate = _this$props4.endDate,
        missingWeeks = _this$props4.missingWeeks;
    var weeks = this.state.weeks;
    var monthTitle = renderMonthText ? renderMonthText(month) : month.format(monthFormat);
    var currentMonth = month.clone();
    var verticalScrollable = orientation === _constants.VERTICAL_SCROLLABLE;
    var lastInvalidWeek = null;
    weeks.forEach(function (week, i) {
      week.forEach(function (day) {
        if (day && modifiers && modifiers[(0, _toISODateString["default"])(day)] && (modifiers[(0, _toISODateString["default"])(day)].has('invalid-span') || modifiers[(0, _toISODateString["default"])(day)].has('selected-invalid-end'))) {
          lastInvalidWeek = i;
        }
      });
    });
    var lastPeriodMonth = endDate && currentMonth && endDate.month() === currentMonth.month();
    var isFirstDay = currentMonth.clone().startOf('month').startOf('isoWeek').isSame(currentMonth.clone().startOf('month'));
    var firstWeekIndex = currentMonth.clone().startOf('month').startOf('isoWeek').isoWeek() + (isFirstDay ? 0 : 1);
    var lastWeekIndex = currentMonth.clone().endOf('month').endOf('isoWeek').isoWeek();
    var activePeriod = "Optimierungszeitraum ".concat(currentMonth.month() + 1, " (KW ").concat(firstWeekIndex, " - KW ").concat(lastWeekIndex, ")");
    var displayCaption = showAllCaptions || !showAllCaptions && !startDate && monthIndex === 1 || startDate && startDate.month() === currentMonth.month();
    var startWeek = null;
    return _react["default"].createElement("div", (0, _extends2["default"])({}, (0, _reactWithStyles.css)(styles.CalendarMonth, {
      padding: "0 ".concat(horizontalMonthPadding, "px")
    }), {
      "data-visible": isVisible
    }), _react["default"].createElement("div", (0, _extends2["default"])({
      ref: this.setCaptionRef
    }, (0, _reactWithStyles.css)(styles.CalendarMonth_caption, verticalScrollable && styles.CalendarMonth_caption__verticalScrollable)), renderMonthElement ? renderMonthElement({
      month: month,
      onMonthSelect: onMonthSelect,
      onYearSelect: onYearSelect,
      isVisible: isVisible
    }) : displayCaption && _react["default"].createElement("div", (0, _extends2["default"])({}, (0, _reactWithStyles.css)(styles.DayPicker_activePeriod), {
      "aria-hidden": "true",
      role: "presentation"
    }), activePeriod)), _react["default"].createElement("table", (0, _extends2["default"])({}, (0, _reactWithStyles.css)(!verticalBorderSpacing && styles.CalendarMonth_table, displayCaption && styles.OP_selected, verticalBorderSpacing && styles.CalendarMonth_verticalSpacing, verticalBorderSpacing && {
      borderSpacing: "0px ".concat(verticalBorderSpacing, "px")
    }), {
      role: "presentation"
    }), _react["default"].createElement("tbody", null, weeks.map(function (week, i) {
      var res = !(i === 0 && Number(week[0] && week[0].date()) > 7) ? [_react["default"].createElement(_CalendarWeek["default"], {
        key: i
      }, _react["default"].createElement("td", {
        style: {
          padding: 5
        },
        className: week[0] && missingWeeks && missingWeeks["".concat(week[0] && week[0].year()).concat(week[0] && week[0].isoWeek())] ? 'missingWeek' : '',
        onClick: function onClick() {
          _this2.setWeek({
            startDate: week[0],
            endDate: week[6]
          });
        }
      }, i === 0 && Number(week[0] && week[0].date()) > 7 ? '' : "".concat(week[0] && week[0].isoWeek())), week.map(function (day, dayOfWeek) {
        return renderCalendarDay({
          key: dayOfWeek,
          day: day,
          daySize: daySize,
          isOutsideDay: !day || day.month() !== month.month(),
          tabIndex: isVisible && (0, _isSameDay["default"])(day, focusedDate) ? 0 : -1,
          isFocused: isFocused,
          onDayMouseEnter: onDayMouseEnter,
          onDayMouseLeave: onDayMouseLeave,
          onDayClick: onDayClick,
          renderDayContents: renderDayContents,
          phrases: phrases,
          modifiers: modifiers[(0, _toISODateString["default"])(day)],
          ariaLabelFormat: dayAriaLabelFormat,
          currentMonth: currentMonth,
          monthIndex: monthIndex
        });
      }), _react["default"].createElement("td", {
        style: {
          padding: '5px 5px 5px 10px',
          textAlign: 'left'
        }
      }, i === 0 && Number(week[0] && week[0].date()) < 8 || startWeek === null && monthIndex === 1 ? _react["default"].createElement("div", null, monthTitle) : '', i === weeks.length - 1 && Number(week[6] && week[6].date()) < 7 ? _react["default"].createElement("div", null, month.clone().add(1, 'month').format(monthFormat), _react["default"].createElement("div", {
        className: "divider"
      })) : '')), lastInvalidWeek === i && lastPeriodMonth && errorMessage ? _react["default"].createElement(_CalendarWeek["default"], {
        key: "".concat(i, "_error")
      }, _react["default"].createElement("td", {
        style: {
          width: 10
        }
      }), _react["default"].createElement("td", (0, _extends2["default"])({
        colSpan: 7
      }, (0, _reactWithStyles.css)(styles.CalendarMonth_errorPeriod)), errorMessage), _react["default"].createElement("td", null)) : null] : null;
      startWeek = res ? i : null;
      return res;
    }))));
  };

  return CalendarMonth;
}(_react["default"].PureComponent || _react["default"].Component);

CalendarMonth.propTypes = process.env.NODE_ENV !== "production" ? propTypes : {};
CalendarMonth.defaultProps = defaultProps;

var _default = (0, _reactWithStyles.withStyles)(function (_ref3) {
  var _ref3$reactDates = _ref3.reactDates,
      color = _ref3$reactDates.color,
      font = _ref3$reactDates.font,
      spacing = _ref3$reactDates.spacing,
      zIndex = _ref3$reactDates.zIndex;
  return {
    CalendarMonth: {
      background: color.background,
      textAlign: 'center',
      verticalAlign: 'top',
      userSelect: 'none'
    },
    CalendarMonth_table: {
      borderCollapse: 'collapse',
      borderSpacing: 0
    },
    CalendarMonth_verticalSpacing: {
      borderCollapse: 'separate'
    },
    CalendarMonth_caption: {
      color: color.text,
      fontSize: font.captionSize,
      textAlign: 'center',
      paddingTop: spacing.captionPaddingTop,
      paddingBottom: spacing.captionPaddingBottom,
      captionSide: 'initial'
    },
    CalendarMonth_caption__verticalScrollable: {
      paddingTop: 12,
      paddingBottom: 7
    },
    CalendarMonth_errorPeriod: {
      background: '#FF6D6D',
      color: '#fff',
      padding: '5px 10px',
      textAlign: 'left'
    },
    DayPicker_activePeriod: {
      fontSize: 10,
      color: color.placeholderText,
      zIndex: zIndex + 2,
      textAlign: (0, _noflip["default"])('left')
    },
    OP_selected: {}
  };
}, {
  pureComponent: typeof _react["default"].PureComponent !== 'undefined'
})(CalendarMonth);

exports["default"] = _default;