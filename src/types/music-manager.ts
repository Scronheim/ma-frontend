// Типы для левой панели (файловая система)
export interface MusicFolder {
  id: string
  name: string
  path: string
  type: 'folder'
  children?: MusicItem[]
  expanded?: boolean
  selected?: boolean
}

export interface MusicFile {
  id: string
  name: string
  path: string
  type: 'file'
  format: 'mp3' | 'flac' | 'wav' | 'ogg' | 'm4a'
  size: number
  duration?: number
  bitrate?: number
  selected?: boolean
  matched?: boolean
  matchedBandId?: string
  matchedAlbumId?: string
  matchedTrackId?: string
}

export type MusicItem = MusicFolder | MusicFile

// Типы для правой панели (данные из БД)
export interface DatabaseBand {
  id: string
  name: string
  country: string
  genre: string[]
  formedIn: number
  albums: DatabaseAlbum[]
}

export interface DatabaseAlbum {
  id: string
  title: string
  year: number
  type: string
  coverUrl?: string
  tracks: DatabaseTrack[]
}

export interface DatabaseTrack {
  id: string
  title: string
  number: number
  duration: string
  lyrics?: string
}

// Сопоставление локальных файлов с БД
export interface FileMatch {
  fileId: string
  filePath: string
  bandId: string
  bandName: string
  albumId: string
  albumTitle: string
  trackId: string
  trackTitle: string
  confidence: number // 0-100
  manuallyMatched?: boolean
}

// Состояние приложения
export interface MusicManagerState {
  folders: MusicFolder[]
  selectedFolder: MusicFolder | null
  selectedFiles: MusicFile[]
  searchQuery: string
  searchResults: DatabaseBand[]
  matches: FileMatch[]
  showOnlyMatched: boolean
}
