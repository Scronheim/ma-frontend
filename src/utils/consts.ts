import type { Album, Band, Member, User } from '@/types'

export const DEFAULT_USER: User = {
  username: '',
  real_name: '',
  country: '',
  gender: '',
  avatar_color: 'red',
  bands_ratings: [],
  albums_ratings: [],
  favorite_genre: null,
  favorite_bands: [],
  favorite_albums: [],
  role: 'user'
}

export const DEFAULT_BAND_MEMBER: Member = {
  id: null,
  fullname: null,
  fullname_slug: null,
  age: null,
  biography: '',
  gender: null,
  place_of_birth: null,
  active_bands: [],
  past_bands: [],
  guest_session: [],
  live: [],
  misc_staff: [],
  links: [],
  photo_url: null
}

export const DEFAULT_ALBUM: Album = {
  id: null,
  title: '',
  title_slug: '',
  band_ids: [],
  band_names: [],
  band_names_slug: [],
  release_date: '',
  current_lineup: [],
  tracklist: [],
  type: 'Full-length',
  label: '',
  cover_url: null,
  cover_loading: false,
  updated_at: ''
}

export const DEFAULT_BAND: Band = {
  id: null,
  name: '',
  name_slug: '',
  country: '',
  city: '',
  description: '',
  formed_in: '',
  years_active: '',
  current_lineup: [],
  past_lineup: [],
  discography: [],
  genres: '',
  label: '',
  links: [],
  status: 'Active',
  themes: '',
  photo_url: null,
  logo_url: null,
  updated_at: ''
}
