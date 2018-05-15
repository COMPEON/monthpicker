import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Monthpicker from '../src'

storiesOf('Button', module)
  .add('with text', () => (
    <Monthpicker onChange={console.log} month={1} year={2018}>Test</Monthpicker>
  ))
