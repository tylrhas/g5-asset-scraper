//pubsub.js
class PubSubMock {

  constructor() {
  }

  topic(topic) {
    // you can implement here the logic
    return this;
  }

  publishMessage(body, obj) {
    return this;
  }
}

module.exports.PubSub = PubSubMock;