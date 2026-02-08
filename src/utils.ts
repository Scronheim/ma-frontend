import dayjs from 'dayjs'

import { Album } from '@/types'

export const formatDate = (date: string, format: string = 'YYYY-MM-DD'): string => {
  if (date === 'N/A') return date

  let newDate = dayjs(date).format(format)
  if (newDate === 'Invalid Date') {
    newDate = dayjs(date, 'MMMM Dth, YYYY').format(format)
  }
  if (newDate === 'Invalid Date') {
    newDate = dayjs(date, 'MMMM YYYY').format(format)
  }
  if (newDate === 'Invalid Date') {
    newDate = dayjs(date, 'YYYY').format(format)
  }
  return newDate
}

export const sortByDate = (a: Album, b: Album): number => {
  if (formatDate(a.release_date) < formatDate(b.release_date)) return 1
  return -1
}
