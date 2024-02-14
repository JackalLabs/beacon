export function sanitizeName(source: string): string {
  return source.replace(/[ .+/=]/g, '_')
    .replace(/[^ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\-_]/g, '')
}
