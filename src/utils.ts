import DateNormalizer from './utils/dateNormalizer'

import { Album } from '@/types'

export const sortByDate = (a: Album, b: Album): number => {
  if (DateNormalizer.normalizeDate(a.release_date) < DateNormalizer.normalizeDate(b.release_date)) return -1
  return 1
}
