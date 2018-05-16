import React from 'react'
import styled, { css } from 'styled-components'

import {
  getHoverColor,
  getPrimaryColor,
  getSecondaryColor,
} from './utils'

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
  ${props => props.selected && '1px solid #d3d3d37a'};

  padding: 12px 0;
  transition: background-color .1s, color .1s;
  font-size: 14px;
  background-color: ${props => props.selected ? getPrimaryColor(props) : getSecondaryColor(props)};
  color: ${props => props.selected ? getSecondaryColor(props) : getPrimaryColor(props)};
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 33.33%;

  ${props => props.focussed && !props.selected && css`
    &:nth-child(3n) {
      border-right: 1px solid ${getSecondaryColor};
    }

    &:nth-child(3n+1) {
      border-left: 1px solid ${getSecondaryColor};
    }

    &:nth-last-child(-n+3) {
      border-bottom: 1px solid ${getSecondaryColor};
    }
  `}

  border-bottom-right-radius: ${props => props.index === 11 && '4px'};
  border-bottom-left-radius: ${props => props.index === 9 && '4px'};
`

export default Month
