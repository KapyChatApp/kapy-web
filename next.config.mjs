import webpack from "webpack";

const nextConfig = {
  // Cấu hình cho việc hiển thị ảnh từ Cloudinary
  images: {
    domains: ["res.cloudinary.com"]
  },

  webpack: (config, { isServer }) => {
    // Tắt caching
    config.cache = false;

    // Lọc các biến môi trường và loại bỏ những biến môi trường liên quan đến Next.js (NEXT_*),
    const env = Object.keys(process.env)
      .filter((key) => !key.startsWith("NEXT_"))
      .reduce((acc, key) => {
        acc[`process.env.${key}`] = JSON.stringify(process.env[key]);
        return acc;
      }, {});

    // Thêm DefinePlugin để inject biến môi trường vào code
    config.plugins.push(new webpack.DefinePlugin(env));

    return config;
  },
  reactStrictMode: true
};

export default nextConfig;
