// next.config.mjs

import webpack from "webpack";
import dotenv from "dotenv";

dotenv.config();

const nextConfig = {
  webpack: (config) => {
    // Filter out internal Next.js variables like NEXT_RUNTIME
    const env = Object.keys(process.env)
      .filter((key) => !key.startsWith("NEXT_"))
      .reduce((acc, key) => {
        acc[`process.env.${key}`] = JSON.stringify(process.env[key]);
        return acc;
      }, {});

    config.plugins.push(new webpack.DefinePlugin(env));

    return config;
  }
};

export default nextConfig;
