export default ({ config }: { config: Record<string, unknown> }) => {
  return {
    ...config,
    extra: {
      ...(config.extra as Record<string, unknown>),
      BACKEND_PORT: process.env.BACKEND_PORT,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
      PROD_BACKEND_URL:process.env.PROD_BACKEND_URL
    },
  };
};
