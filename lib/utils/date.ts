import { format, parseISO } from 'date-fns'

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMMM d, yyyy')
}

export function formatDateTime(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d, yyyy · h:mm a')
}
