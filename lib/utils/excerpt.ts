// Strip common markdown syntax and return first N characters
export function generateExcerpt(content: string, length = 160): string {
  const stripped = content
    .replace(/#{1,6}\s+/g, '')        // headings
    .replace(/\*\*(.+?)\*\*/g, '$1') // bold
    .replace(/\*(.+?)\*/g, '$1')     // italic
    .replace(/`{1,3}[^`]*`{1,3}/g, '') // inline code / code blocks
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // links
    .replace(/!\[.*?\]\(.*?\)/g, '')    // images
    .replace(/>\s+/g, '')               // blockquotes
    .replace(/[-*+]\s+/g, '')           // list items
    .replace(/\n+/g, ' ')               // newlines to space
    .trim()

  return stripped.length > length
    ? stripped.slice(0, length).trimEnd() + '…'
    : stripped
}
