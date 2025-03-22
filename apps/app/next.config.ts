import { withToolbar } from '@repo/feature-flags/lib/toolbar';
import { config, withAnalyzer } from '@repo/next-config';
import { withLogtail, withSentry } from '@repo/observability/next-config';
import type { NextConfig } from 'next';
import { env } from './env';



let nextConfig: NextConfig = withToolbar(
  {
    turbo: {
      resolveAlias: {
        canvas: './empty-module.ts',
      },
    },
    ...config,
  }
);

if (env.VERCEL) {
  nextConfig = withSentry(nextConfig);
}

if (env.ANALYZE === 'true') {
  nextConfig = withAnalyzer(nextConfig);
}

// @ts-ignore - Using casts to bypass Next.js version conflicts
nextConfig = withLogtail(nextConfig);

export default nextConfig;
