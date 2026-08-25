/**
 * Joins tags for a meta rail. The separator is glued to the preceding tag with a
 * non-breaking space, so a wrapped rail can never start a line with a stray dot.
 */
export function tagList(tags: string[]): string {
  return tags.join("\u00a0\u00b7 ");
}
