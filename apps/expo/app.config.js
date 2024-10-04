module.exports = ({ config }) => {
  return {
    ...config,
    extra: {
      ...config.extra,
      API_URL: process.env.EXPO_PUBLIC_API_URL,
      CLERK_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
    },
  }
}
