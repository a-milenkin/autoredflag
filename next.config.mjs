/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  outputFileTracingIncludes: { '/api/check': ['./data/**'], '/[locale]/report/[identifier]': ['./data/**'] },
};
export default nextConfig;
