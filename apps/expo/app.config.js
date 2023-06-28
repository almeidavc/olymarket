module.exports = ({ config }) => {
  return {
    ...config,
    extra: {
      ...config.extra,
      SERVER_URL: process.env.SERVER_URL,
      CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    },
  }
}
