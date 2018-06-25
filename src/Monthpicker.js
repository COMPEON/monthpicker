import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import { getMonth, getYear, addMonths, subMonths, format } from 'date-fns'

import TooltipContainer from './TooltipContainer'
import Month from './Month'
import ArrowRight from './ArrowRight'
import ArrowLeft from './ArrowLeft'
import Header from './Header'
import { getHoverColor, getPrimaryColor, getSecondaryColor, getStyleProps } from './utils'

export const Year = styled.span`
  user-select: none;
`

const Container = styled.div`
  * {
    box-sizing: border-box;
  }

  &:focus {
    outline: none;
  }
`

const MonthContainer = styled.div`
  background-color: ${getSecondaryColor};
  border-radius: 4px;
  width: 300px;
  display: flex;
  flex-wrap: wrap;
`

const Divider = styled.div`
  height: 8px;
  background-color: ${getSecondaryColor};
  width: 100%;
`

const currentDate = new Date()
const currentYear = getYear(currentDate)

class MonthPicker extends React.Component {
  static defaultProps = {
    hoverColor: '#d3d3d330',
    primaryColor: '#27718c',
    secondaryColor: 'white',
    locale: 'de',
    initialYear: currentYear,
    month: getMonth(currentDate),
    year: currentYear
  }

  static propTypes = {
    allowedYears: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.number),
      PropTypes.shape({
        before: PropTypes.number,
        after: PropTypes.number
      })
    ]),
    primaryColor: PropTypes.string.isRequired,
    secondaryColor: PropTypes.string.isRequired,
    hoverColor: PropTypes.string.isRequired,
    month: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
    format: PropTypes.string,
    initialYear: PropTypes.number.isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node)
    ]).isRequired,
    className: PropTypes.string,
    dialogClassName: PropTypes.string
  }

  // Lifecycle methods
  constructor(props) {
    super(props)

    const { initialYear, month, year } = props

    const focussedDate = new Date(year, month - 1)

    this.state = {
      focussedDate,
      year: initialYear,
      open: false,
    }
  }

  componentDidMount () {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount () {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  // Event handlers
  handleClickOutside = event => {
    const element = event.target
    if (this.wrapperRef && !this.wrapperRef.contains(element)) {
      this.close(event)
    }
  }

  handleMonthChange = month => event => {
    event.persist()
    const date = new Date(this.state.year, month)

    this.changeValue(date, event)
  }

  handleTriggerClick = event => {
    event.persist()

    const { onFocus, onBlur } = this.props
    const { open } = this.state

    this.toggleOpen()

    if (!open && onFocus) onFocus()
    if (open && onBlur) onBlur()
  }

  handleKeyDown = event => {
    const { focussedDate, year } = this.state

    const focussedYear = getYear(focussedDate)
    const matchesCurrentYear = focussedYear === year

    const firstMonthOfSelectedYear = new Date(year, 0)

    switch (event.key) {
      case 'ArrowLeft': {
        event.preventDefault()

        const nextFocussedDate = matchesCurrentYear ? subMonths(focussedDate, 1) : firstMonthOfSelectedYear

        if (getYear(nextFocussedDate) < year) this.previousYear()

        return this.setFocussedMonth(nextFocussedDate)
      }

      case 'ArrowRight': {
        event.preventDefault()

        const nextFocussedDate = matchesCurrentYear ? addMonths(focussedDate, 1) : firstMonthOfSelectedYear

        if (getYear(nextFocussedDate) > year) this.nextYear()

        return this.setFocussedMonth(nextFocussedDate)
      }

      case 'ArrowUp': {
        event.preventDefault()

        const nextFocussedDate = matchesCurrentYear ? subMonths(focussedDate, 3) : firstMonthOfSelectedYear

        if (getYear(nextFocussedDate) < year) this.previousYear()

        return this.setFocussedMonth(nextFocussedDate)
      }

      case 'ArrowDown': {
        event.preventDefault()

        const nextFocussedDate = matchesCurrentYear ? addMonths(focussedDate, 3) : firstMonthOfSelectedYear

        if (getYear(nextFocussedDate) > year) this.nextYear()

        return this.setFocussedMonth(nextFocussedDate)
      }

      case 'Enter': {
        event.preventDefault()
        event.persist()

        if (focussedDate) return this.changeValue(focussedDate, event)
      }

      default: {
        break
      }
    }
  }

  // Other functions
  nextYear = () => this.setState(({ year }) => {
    const { allowedYears } = this.props

    if (Array.isArray(allowedYears)) {
      const sortedYears = allowedYears.sort((a,b) => a - b)
      const currentIndex = sortedYears.indexOf(year)

      if (currentIndex < sortedYears.length - 1) return { year: sortedYears[currentIndex + 1] }
    }

    const nextYear = year + 1

    if (this.isAllowedYear(nextYear)) {
      return { year: nextYear }
    }

    return null
  })

  previousYear = () => this.setState(({ year }) => {
    const { allowedYears } = this.props

    if (Array.isArray(allowedYears)) {
      const sortedYears = allowedYears.sort((a,b) => a - b)
      const currentIndex = sortedYears.indexOf(year)

      if (currentIndex > 0) return { year: sortedYears[currentIndex - 1] }
    }

    const previousYear = year - 1

    if (this.isAllowedYear(previousYear)) {
      return { year: previousYear }
    }

    return null
  })

  toggleOpen = () => {
    this.setState(({ open }) => ({ open: !open }))
  }

  setFocussedMonth = date => {
    if (this.isAllowedYear(getYear(date))) {
      this.setState({ focussedDate: date })
    }
  }

  close = event => {
    const { onBlur } = this.props

    if (!this.state.open) return

    this.setState({ open: false })

    if (onBlur) onBlur()
  }

  setWrapperRef = node => {
    this.wrapperRef = node
  }

  changeValue = (date, event) => {
    const { onChange, format: dateFormat } = this.props

    const formattedDate = dateFormat
      ? format(date, dateFormat)
      : { month: getMonth(date) + 1, year: getYear(date) }

    if (onChange) onChange(formattedDate, event)

    this.setFocussedMonth(date)

    this.close(event)
  }

  isAllowedYear = year => {
    const { allowedYears } = this.props

    if (!allowedYears) return true

    if (Array.isArray(allowedYears)) {
      return allowedYears.indexOf(year) >= 0
    }

    const { before, after } = allowedYears

    if (before && after) {
      return year < before && year > after
    }

    if (before) return year < before
    if (after) return year > after

    return false
  }

  // Render functions
  renderMonths = () => {
    const { month, year, locale } = this.props
    const { year: selectedYear, focussedDate } = this.state

    const monthNameFormatter = Intl.DateTimeFormat(locale, { month: 'short' })
    const formatDate = currentDate

    const focussedMonth = getMonth(focussedDate)
    const focussedYear = getYear(focussedDate)

    const months = []

    for (let index = 0; index < 12; index++) {
      formatDate.setMonth(index)
      const monthName = monthNameFormatter.format(formatDate)

      const isSelectedMonth = month && selectedYear === year && index === month -1
      const isFocussedMonth = focussedYear === selectedYear && index === focussedMonth

      months.push(
        <Month
          focussed={isFocussedMonth}
          selected={isSelectedMonth}
          key={monthName}
          onClick={this.handleMonthChange(index)}
          index={index}
          {...getStyleProps(this.props)}
        >
        {monthName}
        </Month>
      )
    }

    return months
  }

  render () {
    const { year, open } = this.state
    const { className, dialogClassName, children } = this.props

    const styleProps = getStyleProps(this.props)

    return (
      <Container className={className} tabIndex={-1} innerRef={this.setWrapperRef} onKeyDown={this.handleKeyDown}>
        <div onClick={this.handleTriggerClick}>
          {this.props.children}
        </div>
        {open && (
          <TooltipContainer className={dialogClassName} {...styleProps}>
            <Header {...styleProps}>
              <ArrowLeft onClick={this.previousYear} {...styleProps} />
              <Year>{year}</Year>
              <ArrowRight onClick={this.nextYear} {...styleProps} />
            </Header>
            <Divider {...styleProps } />
            <MonthContainer {...styleProps}>
              {this.renderMonths()}
            </MonthContainer>
          </TooltipContainer>
        )}
      </Container>
    )
  }
}

export default MonthPicker
