import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import getMonth from 'date-fns/get_month'
import getYear from 'date-fns/get_year'
import addMonths from 'date-fns/add_months'
import subMonths from 'date-fns/sub_months'
import format from 'date-fns/format'

import TooltipContainer from './TooltipContainer'
import Month from './Month'
import ArrowRight from './ArrowRight'
import ArrowLeft from './ArrowLeft'
import Header from './Header'
import {
  MONTHS,
  getHoverColor,
  getPrimaryColor,
  getSecondaryColor,
  getStyleProps
} from './utils'

const Year = styled.span`
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
  background-color: white;
  border-radius: 4px;
  width: 300px;
  display: flex;
  flex-wrap: wrap;
`

const Divider = styled.div`
  height: 8px;
  background-color: white;
  width: 100%;
`

class MonthPicker extends React.Component {
  static defaultProps = {
    hoverColor: '#d3d3d330',
    primaryColor: '#27718c',
    secondaryColor: 'white',
    initialYear: getYear(new Date()),
    month: getMonth(new Date()),
    year: getYear(new Date())
  }

  static propTypes = {
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
    ]).isRequired
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

  handleChange = index => event => {
    event.persist()
    const date = new Date(this.state.year, index)

    this.changeValue(date, event)
  }

  handleTriggerClick = event => {
    const { onFocus, onBlur } = this.props
    const { open } = this.state

    this.toggleOpen()

    if (!open && onFocus) onFocus(event)
    if (open && onBlur) onBlur(event)
  }

  handleKeyDown = event => {
    const { focussedDate, year } = this.state

    const focussedYear = getYear(focussedDate)
    const matchesCurrentYear = focussedYear === year

    switch (event.key) {
      case 'ArrowLeft': {
        event.preventDefault()

        const nextFocussedDate = matchesCurrentYear ? subMonths(focussedDate, 1) : new Date(year, 0)

        if (getYear(nextFocussedDate) < year) {
          this.previousYear()
        }

        return this.setFocussedMonth(nextFocussedDate)
      }

      case 'ArrowRight': {
        event.preventDefault()

        const nextFocussedDate = matchesCurrentYear ? addMonths(focussedDate, 1) : new Date(year, 0)
        if (getYear(nextFocussedDate) > year) {
          this.nextYear()
        }

        return this.setFocussedMonth(nextFocussedDate)
      }

      case 'ArrowUp': {
        event.preventDefault()

        const nextFocussedDate = matchesCurrentYear ? subMonths(focussedDate, 3) : new Date(year, 0)
        if (getYear(nextFocussedDate) < year) {
          this.previousYear()
        }

        return this.setFocussedMonth(nextFocussedDate)
      }

      case 'ArrowDown': {
        event.preventDefault()

        const nextFocussedDate = matchesCurrentYear ? addMonths(focussedDate, 3) : new Date(year, 0)
        if (getYear(nextFocussedDate) > year) {
          this.nextYear()
        }

        return this.setFocussedMonth(nextFocussedDate)
      }

      case 'Enter': {
        event.preventDefault()
        event.persist()

        if (focussedDate) this.changeValue(focussedDate, event)

        break
      }

      default: {
        break
      }
    }
  }

  // Other functions
  nextYear = () => {
    this.setState(({ year }) => ({ year: year + 1 }))
  }

  previousYear = () => {
    this.setState(({ year }) => ({ year: year - 1 }))
  }

  toggleOpen = () => {
    this.setState(({ open }) => ({ open: !open }))
  }

  setFocussedMonth = date => {
    this.setState({ focussedDate: date })
  }

  close = event => {
    const { onBlur } = this.props

    if (!this.state.open) return

    this.setState({ open: false })

    if (onBlur) onBlur(event)
  }

  setWrapperRef = node => {
    this.wrapperRef = node
  }

  changeValue = (date, event) => {
    const { onChange, format: dateFormat, onBlur } = this.props

    const formattedDate = dateFormat
      ? format(date, dateFormat)
      : { month: getMonth(date) + 1, year: getYear(date) }

    if (onChange) onChange(formattedDate, event)

    this.setFocussedMonth(date)

    this.close(event)
  }

  // Render functions
  renderMonth = (monthName, index) => {
    const { month, year } = this.props

    const focussedMonth = getMonth(this.state.focussedDate)
    const focussedYear = getYear(this.state.focussedDate)

    return (
      <Month
        focussed={focussedYear === this.state.year && index === focussedMonth}
        key={monthName}
        selected={month && this.state.year === year && month - 1  === index}
        onClick={this.handleChange(index)}
        index={index}
        {...getStyleProps(this.props)}
      >
        {monthName.substr(0, 3)}
      </Month>
    )
  }

  render () {
    const { year, open } = this.state

    const styleProps = getStyleProps(this.props)

    return (
      <Container tabIndex={-1} innerRef={this.setWrapperRef} onKeyDown={this.handleKeyDown}>
        <div onClick={this.handleTriggerClick}>{this.props.children}</div>
        {open && (
          <TooltipContainer {...styleProps}>
            <Header {...styleProps}>
              <ArrowLeft onClick={this.previousYear} {...styleProps} />
              <Year>{year}</Year>
              <ArrowRight onClick={this.nextYear} {...styleProps} />
            </Header>
            <Divider />
            <MonthContainer {...styleProps}>
              {MONTHS.map(this.renderMonth)}
            </MonthContainer>
          </TooltipContainer>
        )}
      </Container>
    )
  }
}

export default MonthPicker
