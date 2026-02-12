export interface Band {
  id: number
  name: string
  name_slug: string
  description: string
  country: string
  city: string
  status: 'Active' | 'Split-up' | 'On hold' | 'Changed name' | 'Disputed'
  formed_in: number
  years_active: string
  genres: string
  themes: string
  label: string
  links: BandLink[]
  logo_url: string
  photo_url: string
  discography: Album[]
  current_lineup: {
    name: string
    role: string
    url: string
  }[]
  updated_at: string
}

export interface Album {
  id: number
  title: string
  title_slug: string
  band_ids: number[]
  band_names: string[]
  band_names_slug: string[]
  type: 'Full-length' | 'EP' | 'Single' | 'Demo' | 'Split'
  release_date: string
  label: string
  cover_url: string
  cover_loading: boolean
  tracklist: Track[]
  current_lineup: BandMember[]
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

export interface BandMember {
  name: string
  role: string
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

export interface BandLink {
  social: string
  url: string
}
