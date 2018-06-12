import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Monthpicker from '../src'

storiesOf('Monthpicker', module)
  .add('without an initial date', () => (
    <Monthpicker
      onBlur={action('blur')}
      onChange={action('change')}
      onFocus={action('focus')}
    >
      Test
    </Monthpicker>
  ))
  .add('with an initial date', () => (
    <Monthpicker
      month={2}
      year={2018}
      onBlur={action('blur')}
      onChange={action('change')}
      onFocus={action('focus')}
    >
      Test
    </Monthpicker>
  ))
  .add('with an initial year set', () => (
    <Monthpicker
      initialYear={2017}
      month={2}
      year={2018}
      onBlur={action('blur')}
      onChange={action('change')}
      onFocus={action('focus')}
    >
      Test
    </Monthpicker>
  ))
  .add('with content below', () => (
    <div>
      <Monthpicker
        initialYear={2017}
        month={2}
        year={2018}
        onBlur={action('blur')}
        onChange={action('change')}
        onFocus={action('focus')}
      >
        Test
      </Monthpicker>
      <div>
        <p>
          Lorem ipsum dolor sit amet, ea vel viderer inimicus assentior, cum ex illud debet impedit.
          Ut cum legimus mandamus, cu sed atqui postea. An essent perpetua pri.
          Has eu error saperet pericula, vitae petentium efficiendi quo in, no regione virtute constituam vim.
        </p>

        <p>
          Nec et persecuti sententiae, mea ad dicunt apeirian, altera salutatus ut est.
          Doming vocibus est no. Labore malorum copiosae pri no. Nec tritani deseruisse ad, per ad tibique perfecto facilisis.
          Has epicurei forensibus in, ignota deserunt persecuti eu mei, vis at malis minim harum. Qui elit nulla repudiare no, in maiestatis suscipiantur contentiones eam.
        </p>
      </div>
    </div>
  ))
  .add('with different colors', () => (
    <Monthpicker
      month={5}
      year={2018}
      onBlur={action('blur')}
      onChange={action('change')}
      onFocus={action('focus')}
      primaryColor='#fab400'
      secondaryColor='#550000'
      hoverColor='red'
    >
      Test
    </Monthpicker>
  ))
  .add('with an array of allowed years', () => (
    <Monthpicker
      onBlur={action('blur')}
      onChange={action('change')}
      onFocus={action('focus')}
      allowedYears={[2016, 2018]}
    >
      Test
    </Monthpicker>
  ))
