Simple, clean monthpicker component written with styled-components and date-fns

![Screenshot](screenshot.png)

# Installation

```bash
yarn add @compeon/monthpicker
```

You also need to have `styled-components` installed, so if that's not the case
```bash
yarn add styled-components
```

# Usage

```js
import Monthpicker from '@compeon/monthpicker'

<Monthpicker format='MM.YYYY' onChange={this.handleChange}>
  <div>Click me</div>
</Monthpicker>
```

# Props

prop | description | default
------------ | ------------- | -------------
month | the currently selected month | `new Date().getMonth()`
year | the currently selected year | `new Date().getFullYear()`
initialYear | the initally shown year | `new Date().getFullYear()`
locale | the locale that is used for displaying monthnames | `de`
onBlur | function that is called when the picker is blurred | `-`
onFocus | function that is called when the picker is focussed | `-`
onChange | function that is called when the selected month changes. Will be called with `{ month: 1, year: 2018 }` as the first param when no format is specified. Second param is always the triggering event. | `-`
children | node(s) which on click trigger the opening of the picker | `-`
allowedYears | either an object in the format `{ before: 2019, after: 2016 }` (also works with only one of `after` or `before`) or an array with the allowed years `[2016, 2017, 2018]` | `-`
primaryColor | the primary color that is used | `#27718c`
secondaryColor | the secondary color that is used | `white`
hoverColor | the color that is used for hovering over a month | `#d3d3d330`

