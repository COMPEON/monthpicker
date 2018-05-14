import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes, css } from 'styled-components'
import getMonth from 'date-fns/get_month'
import getYear from 'date-fns/get_year'
import addMonths from 'date-fns/add_months'
import subMonths from 'date-fns/sub_months'
import format from 'date-fns/format'

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

const fadeIn = keyframes`
  from {
    transform: scaleY(0.95);
    opacity: 0;
  }

  to {
    transform: scaleY(1);
    opacity: 1;
  }
`

const Tooltip = styled.div`
  margin-top: 8px;
  transform-origin: top center;
  animation: ${fadeIn} .2s;
  position: absolute;
  box-shadow: 0 0 8px 0px rgba(0,0,0,0.12);
  border: 1px solid ${getPrimaryColor};
`

const Container = styled.div`
  &:focus {
    outline: none;
  }
`

const MonthContainer = styled.div`
  width: 300px;
  display: flex;
  flex-wrap: wrap;
`

const Month = styled.div`
  ${props => !props.selected && css`
      cursor: pointer;

      &:hover {
        background-color: ${getHoverColor};
      }
    `
  }

  &:focus {
    outline: none;
  }

  ${props => !props.selected && props.focussed && css`
    border: 1px solid ${getPrimaryColor};
      background-color: ${getHoverColor};
  `}

  padding: 12px 0;
  transition: background-color .1s, color .1s;
  border-radius: 1px;
  font-size: 14px;
  background-color: ${props => props.selected ? getPrimaryColor(props) : getSecondaryColor(props)};
  color: ${props => props.selected ? getSecondaryColor(props) : getPrimaryColor(props)};
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 33.33%;
`

class MonthPicker extends React.Component {
  static defaultProps = {
    hoverColor: '#d3d3d330',
    primaryColor: '#29708',
    secondaryColor: 'white',
    initialYear: getYear(new Date()),
    month: getMonth(new Date()),
    year: getYear(new Date())
  }

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

  handleClickOutside = (event: MouseEvent) => {
    const element = event.target
    if (this.wrapperRef && !this.wrapperRef.contains(element)) {
      this.close()
    }
  }

  nextYear = () => {
    this.setState(({ year }) => ({ year: year + 1 }))
  }

  previousYear = () => {
    this.setState(({ year }) => ({ year: year - 1 }))
  }

  toggleOpen = () => {
    this.setState(({ open }) => ({ open: !open }))
  }

  close = () => {
    this.setState({ open: false })
  }

  setWrapperRef = node => {
    this.wrapperRef = node
  }

  handleChange = index => event => {
    event.persist()
    const date = new Date(this.state.year, index)

    this.changeValue(date, event)
  }

  changeValue = (date, event) => {
    const { onChange, format: dateFormat } = this.props

    const formattedDate = dateFormat
      ? format(date, dateFormat)
      : { month: getMonth(date) + 1, year: getYear(date) }

    if (onChange) onChange(formattedDate, event)

    this.setFocussedMonth(date)

    this.close()
  }

  setFocussedMonth = date => {
    this.setState({ focussedDate: date })
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

        if (focussedDate) this.changeValue(focussedDate)

        break
      }

      default: {
        break
      }
    }
  }

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
      >
        {monthName.substr(0, 3)}
      </Month>
    )
  }

  render () {
    const { year, open } = this.state
    const { primaryColor, secondaryColor } = this.props

    return (
      <Container tabIndex={-1} innerRef={this.setWrapperRef} onKeyDown={this.handleKeyDown}>
        <div onClick={this.toggleOpen}>{this.props.children}</div>
        {open && (
          <Tooltip>
            <Header {...getStyleProps(this.props)}>
              <ArrowLeft onClick={this.previousYear} {...getStyleProps(this.props)} />
              {year}
              <ArrowRight onClick={this.nextYear} {...getStyleProps(this.props)} />
            </Header>
            <MonthContainer {...getStyleProps(this.props)}>
              {MONTHS.map(this.renderMonth)}
            </MonthContainer>
          </Tooltip>
        )}
      </Container>
    )
  }
}

MonthPicker.propTypes = {
  primaryColor: PropTypes.string.isRequired,
  secondaryColor: PropTypes.string.isRequired,
  hoverColor: PropTypes.string.isRequired,
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  format: PropTypes.string,
  initialYear: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ])
}

export default MonthPicker
