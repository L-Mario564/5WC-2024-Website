await import('./env.mjs');
import createMDX from '@next/mdx';

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: []
  }
});

/** @type {import("next").NextConfig} */
const config = {
  output: 'export',
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  reactStrictMode: true,
  images: {
    loader: 'custom',
    loaderFile: './utils/ppyImageLoader.ts',
  },
};

export default withMDX(config);
