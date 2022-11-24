export default class Event {
  constructor(title, time, startAt, endAt) {
    this.title = title
    this.time = time
    this.startAt = startAt
    this.endAt = endAt
  }

  copy() {
    return new Event(
      this.title,
      this.time,
      this.startAt.clone(),
      this.endAt.clone()
    )
  }
}
