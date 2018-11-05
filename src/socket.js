export default class Socket {
  constructor() {
    this.listeners = {};
    this.socket = new WebSocket('ws://localhost:8080');
    this.socket.onmessage = evt => this.receive(evt.data);
  }

  receive(json) {
    const data = JSON.parse(json);
    const listeners = this.listeners[data.type];
    if (!listeners) {
      // console.warn('No listeners in app for:', data.type);
      return;
    }
    listeners.forEach(fn => fn(data.data));
  }

  send(data) {
    const json = JSON.stringify(data);
    this.socket.send(json);
  }

  on(evt, fn) {
    const listeners = this.listeners[evt];
    if (!listeners) {
      this.listeners[evt] = [fn];
    } else {
      listeners.push(fn);
    }
  }

  off(evt, fn) {
    const idx = this.listeners[evt].indexOf(fn);
    this.listeners[evt].splice(idx, 1);
  }
}
