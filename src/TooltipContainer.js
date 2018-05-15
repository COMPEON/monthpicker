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
  box-shadow: 0 0 8px 0px rgba(0,0,0,0.12);
  border: 1px solid ${getPrimaryColor};
  border-radius: 4px;
`

export default TooltipContainer
