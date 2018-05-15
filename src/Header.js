import styled from 'styled-components'

import { getPrimaryColor, getSecondaryColor } from './utils'

export default styled.div`
  padding: 16px 8px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${getPrimaryColor};
  color: ${getSecondaryColor};
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`
