import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Monthpicker from '../src'

storiesOf('Monthpicker', module)
  .add('without an initial date', () => (
    <Monthpicker onChange={console.log}>Test</Monthpicker>
  ))
  .add('with an initial date', () => (
    <Monthpicker month={2} year={2018} onChange={console.log}>Test</Monthpicker>
  ))
  .add('with an initial year set', () => (
    <Monthpicker initialYear={2017} month={2} year={2018} onChange={console.log}>Test</Monthpicker>
  ))
  .add('with different colors', () => (
    <Monthpicker
      month={5}
      year={2018}
      onChange={console.log}
      primaryColor='#fab400'
      secondaryColor='#550000'
      hoverColor='red'
    >
      Test
    </Monthpicker>
  ))
