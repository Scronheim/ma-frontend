export interface Band {
  id: number | null
  name: string
  name_slug: string
  description: string
  country: string
  city: string
  status: 'Active' | 'Split-up' | 'On hold' | 'Changed name' | 'Disputed'
  formed_in: string
  years_active: string
  genres: string
  themes: string
  label: string
  links: SocialLink[]
  logo_url: string | null
  photo_url: string | null
  discography: Album[]
  current_lineup: MemberLineUp[]
  past_lineup: MemberLineUp[]
  updated_at: string
}

export interface Album {
  id: number | null
  title: string
  title_slug: string
  band_ids: number[]
  band_names: string[]
  band_names_slug: string[]
  type: 'Full-length' | 'EP' | 'Single' | 'Demo' | 'Split'
  release_date: string
  label: string
  cover_url: string | null
  cover_loading: boolean
  tracklist: Track[]
  current_lineup: MemberLineUp[]
  updated_at: string
}

export interface Track {
  id: number | string | null
  number: number
  title: string
  duration: string
  lyrics: string | null
  cd_number: number | null
  side: number | null
  show_lyrics: boolean | null
}

export interface Member {
  id: number | null
  fullname: string | null
  fullname_slug: string | null
  age: string | null
  place_of_birth: string | null
  gender: string | null
  photo_url: string | null
  biography: string
  active_bands: MemberBand[]
  past_bands: MemberBand[]
  guest_session: MemberBand[]
  live: MemberBand[]
  misc_staff: MemberBand[]
  links: SocialLink[]
}

export interface MemberBand {
  id: number | null
  name: string
  name_slug: string
  albums: MemberAlbum[]
  role: string
}

export interface MemberAlbum {
  id: number | null
  title: string
  title_slug: string
  release_date: string
  role: string
}

export interface MemberLineUp {
  id: number
  fullname: string
  fullname_slug: string
  role: string
  other_bands: {
    id: number
    name: string
    name_slug: string
  }[]
  url: string
}

export interface SearchBandResult {
  id: number
  name: string
  name_slug: string
  genre: string
  country: string
}

export interface SearchAlbumResult {
  id: number
  title: string
  title_slug: string
  band_name: string
  band_name_slug: string
  release_date: string
  type: string
}

export interface SearchFilters {
  country: string
  genre: string
  status: string
}

export interface SSEResponse {
  type: string
  message: string
  data: {
    [key: string]: string
  }
}

export interface BandStatInfo {
  active: number
  on_hold: number
  split_up: number
  changed_name: number
  unknown: number
  total: number
}
export interface StatInfo {
  bands: BandStatInfo
  albums: number
  songs: number
}

export interface AllStatInfo {
  local: StatInfo
  ma: StatInfo
}

export interface SocialLink {
  social: string
  url: string
}

export interface AuthData {
  username: string
  password: string
}

export interface ShortBand {
  id: number
  name: string
  name_slug: string
  genres: string
  country: string
  photo_url: string | null
  logo_url: string | null
}

export interface ShortAlbum {
  id: number
  title: string
  title_slug: string
  band_names: string[]
  band_names_slug: string[]
  type: string
  cover_url: string | null
}

export interface Rating {
  id: number
  rating: number
}

export interface User {
  username: string
  real_name: string | null
  gender: string | null
  country: string | null
  bands_ratings: Rating[]
  albums_ratings: Rating[]
  favorite_genre: string | null
  favorite_bands: ShortBand[]
  favorite_albums: ShortAlbum[]
  role: 'admin' | 'moderator' | 'user'
  avatar_color: string
  created_at?: string
}
