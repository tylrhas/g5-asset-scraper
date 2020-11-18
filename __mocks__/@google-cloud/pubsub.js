//pubsub.js
class PubSubMock {

  constructor() {
  }

  topic(topic) {
    return this
  }

  publishMessage(body, obj) {
    return this
  }
}

module.exports.PubSub = PubSubMock;