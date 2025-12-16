/** @type {import('next').NextConfig} */

import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig = {
  /**
   * The 'standalone' output mode creates a self-contained package with all the necessary
   * server dependencies. This is the recommended configuration for deploying Next.js
   * applications to Firebase App Hosting.
   *
   * @see https://nextjs.org/docs/pages/api-reference/next-config-js/output
   */
  output: 'standalone',

  // Your existing Next.js config here
};

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default bundleAnalyzer(nextConfig);
