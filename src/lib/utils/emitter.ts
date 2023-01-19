import EventEmitter from 'eventemitter3'
const eventEmitter = new EventEmitter()
const Emitter = {
  on: (event: string, fn: (payload?: any) => void | Promise<void>) => eventEmitter.on(event, fn),
  once: (event: string, fn: (payload?: any) => void | Promise<void>) =>
    eventEmitter.once(event, fn),
  off: (event: string, fn: (payload?: any) => void | Promise<void>) => eventEmitter.off(event, fn),
  emit: (event: string, payload?: any) => eventEmitter.emit(event, payload)
}
Object.freeze(Emitter)
// console.log('created event emitter', Emitter)
export default Emitter
