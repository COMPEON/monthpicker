export function getPrimaryColor (props) {
  return props.primaryColor
}

export function getSecondaryColor (props) {
  return props.secondaryColor
}

export function getHoverColor (props) {
  return props.hoverColor
}

export function getStyleProps ({ primaryColor, secondaryColor, hoverColor }) {
  return {
    hoverColor,
    primaryColor,
    secondaryColor
  }
}
