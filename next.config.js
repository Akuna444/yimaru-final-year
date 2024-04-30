const withNextIntl = require("next-intl/plugin")();

/** @type {import('next').NextConfig} */
const config = {
  images: {
    domains: ["utfs.io"],
  },
};

module.exports = withNextIntl(config);
