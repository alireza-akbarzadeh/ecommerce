function getElementOffset(elem: HTMLElement) {
  let offset = {
    left: 0,
    top: 0,
  }
  do {
    if (!isNaN(elem.offsetLeft)) {
      offset.left += elem.offsetLeft
    }
    if (!isNaN(elem.offsetTop)) {
      offset.top += elem.offsetTop
    }
  } while (elem == elem.offsetParent)
  return offset
}

export { getElementOffset }
