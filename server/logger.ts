import winston from 'winston'

const formatter = winston.format.printf(
  ({ level, message, timestamp, ...meta }) => {
    let output = `${timestamp} | ${level} : ${message}`

    if (Object.keys(meta).length !== 0) {
      output += `, ${JSON.stringify(meta)}`
    }

    return output
  }
)

const colorizeTimestamp = winston.format((info) => {
  switch (info.level) {
    case 'error':
      info.timestamp = `\u001b[31m${info.timestamp}\u001b[39m`
      break
    case 'warn':
      info.timestamp = `\u001b[33m${info.timestamp}\u001b[39m`
      break
    case 'info':
      info.timestamp = `\u001b[32m${info.timestamp}\u001b[39m`
      break
    case 'debug':
      info.timestamp = `\u001b[34m${info.timestamp}\u001b[39m`
  }
  return info
})

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/info.log', level: 'info' }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        colorizeTimestamp(),
        winston.format.colorize(),
        formatter
      ),
    })
  )
}
