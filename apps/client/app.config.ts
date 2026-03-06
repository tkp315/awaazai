export default ({ config }: { config: Record<string, unknown> }) => {
  return {
    ...config,
    extra: {
      ...(config.extra as Record<string, unknown>),
      BACKEND_PORT: process.env.BACKEND_PORT,
    },
  };
};
