const withNextIntl = require("next-intl/plugin")();

/** @type {import('next').NextConfig} */
const config = {
  images: {
    domains: ["utfs.io"],
  },

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
};

module.exports = withNextIntl(config);
