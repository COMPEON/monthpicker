import React from 'react'
import styled, { keyframes } from 'styled-components'

import { getPrimaryColor } from './utils'

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

const TooltipContainer = styled.div`
  margin-top: 8px;
  transform-origin: top center;
  animation: ${fadeIn} .2s;
  position: absolute;
  box-shadow: 0 1px 3px #d3d3d380, 0 1px 3px #d3d3d380;
  border: 1px solid ${getPrimaryColor};
  border-radius: 4px;
  z-index: 10;
`

export default TooltipContainer
