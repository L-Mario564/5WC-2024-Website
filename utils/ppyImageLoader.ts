export default function absoluteUriImageLoader({ src }: {src: string}): string {
  /**
   * @param src full URI to remote image (including all of: scheme://host/uri?query_params)
   */
  return src
}
