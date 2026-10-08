import { config } from '../config/env.js'

const timestamp = () => new Date().toTimeString().slice(0, 8)

export const logger = {
  info:  (...args) => console.log( `[${timestamp()}] INFO `, ...args),
  warn:  (...args) => console.warn(`[${timestamp()}] WARN `, ...args),
  error: (...args) => console.error(`[${timestamp()}] ERROR`, ...args),
  debug: (...args) => { if (config.isDev) console.log(`[${timestamp()}] DEBUG`, ...args) },
}
