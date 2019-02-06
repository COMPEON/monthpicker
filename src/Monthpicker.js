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

  constructor(props) {
    super(props)

    this.state = {
      year: props.year,
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
    this.close(event)
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
    const { open, year } = this.state
    const { month } = this.props

    if (!open) return

    const currentDate = new Date(year, month - 1)

    const firstMonthOfSelectedYear = new Date(year, 0)

    switch (event.key) {
      case 'ArrowLeft': {
        event.preventDefault()

        const nextDate = subMonths(currentDate, 1)
        return this.changeValue(nextDate, event)
      }

      case 'ArrowRight': {
        event.preventDefault()

        const nextDate = addMonths(currentDate, 1)
        return this.changeValue(nextDate, event)
      }

      case 'ArrowUp': {
        event.preventDefault()

        const nextDate = subMonths(currentDate, 3)
        return this.changeValue(nextDate, event)
      }

      case 'ArrowDown': {
        event.preventDefault()

        const nextDate = addMonths(currentDate, 3)
        return this.changeValue(nextDate, event)
      }

      case 'Enter': {
        this.close()
      }

      default: {
        break
      }
    }
  }

  // Other functions
  nextYear = () => {
    const { allowedYears, month } = this.props
    const { year } = this.state

    if (Array.isArray(allowedYears)) {
      const sortedYears = allowedYears.sort((a,b) => a - b)
      const currentIndex = sortedYears.indexOf(year)

      if (currentIndex < sortedYears.length - 1) {
        const nextYear = sortedYears[currentIndex + 1]
        this.setState({ year: nextYear })
      }
    }

    const nextYear = year + 1

    if (this.isAllowedYear(nextYear)) {
      this.setState({ year: nextYear })
    }
  }

  previousYear = () => {
    const { allowedYears, month } = this.props
    const { year } = this.state

    if (Array.isArray(allowedYears)) {
      const sortedYears = allowedYears.sort((a,b) => a - b)
      const currentIndex = sortedYears.indexOf(year)

      if (currentIndex > 0) {
        const previousYear = sortedYears[currentIndex - 1]
        this.setState({ year: previousYear })
      }
    }

    const previousYear = year - 1

    if (this.isAllowedYear(previousYear)) {
      this.setState({ year: previousYear })
    }
  }

  toggleOpen = () => {
    this.setState(({ open }) => ({ open: !open }))
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
    const { month, year: selectedYear, locale } = this.props
    const { year } = this.state

    const selectedMonth = month - 1

    const monthNameFormatter = Intl.DateTimeFormat(locale, { month: 'short' })

    const months = []

    for (let index = 0; index < 12; index++) {
      const monthName = monthNameFormatter.format(new Date(year, index, 1))

      const isSelectedMonth = (
        selectedMonth !== undefined &&
        index === selectedMonth &&
        year === selectedYear
      )

      months.push(
        <Month
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
    const { open, year } = this.state
    const { className, dialogClassName, children } = this.props

    const styleProps = getStyleProps(this.props)

    return (
      <Container className={className} tabIndex={-1} ref={this.setWrapperRef} onKeyDown={this.handleKeyDown}>
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
