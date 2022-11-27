import getColor from '../components/Colors'

export default class Event {
  constructor(title, time, startAt, endAt, colorId) {
    this.title = title
    this.time = time
    this.startAt = startAt
    this.endAt = endAt
    this.color = colorId ? getColor(colorId) : "#26A69A"
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
