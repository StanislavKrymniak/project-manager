import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // This tells Turbopack to leave Prisma alone!
    serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;