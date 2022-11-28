import { getColor, rgbToHsl } from '../components/Colors'

export default class Event {
  constructor(title, time, startAt, endAt, colorId, left, width) {
    this.title = title
    this.time = time
    this.startAt = startAt
    this.endAt = endAt
    this.color = colorId ? getColor(colorId).event : "#26A69A"
    this.left = 0 // px
    this.width = 100 // %
  }

  copy() {
    return new Event(
      this.title,
      this.time,
      this.startAt.clone(),
      this.endAt.clone(),
      this.color
    )
  }
}
