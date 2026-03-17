import type { NginxItem } from '@/types'

class NginxService {
  private baseUrl: string = '/api/files'

  setBaseUrl(url: string) {
    this.baseUrl = url
  }

  async listDirectory(path: string = ''): Promise<NginxItem[]> {
    try {
      let url = `${this.baseUrl}/list`
      if (path) url += `?path=${path}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.items.map((item: NginxItem) => ({
        name: item.name,
        type: item.type === 'directory' ? 'directory' : 'file',
        size: item.size,
        mtime: item.mtime,
        path: path ? `${path}/${item.name}` : item.name,
        url: `/music/${path}/${item.name}`
      }))
    } catch (error) {
      console.error('Error listing directory:', error)
      throw error
    }
  }

  /**
   * Получить URL для скачивания файла
   */
  getFileUrl(filePath: string): string {
    return `${this.baseUrl}${filePath}`
  }

  /**
   * Получить родительский путь
   */
  getParentPath(path: string): string {
    const parts = path.split('/').filter(p => p)
    parts.pop()
    return parts.join('/')
  }

  /**
   * Получить имя текущей директории
   */
  getCurrentDirName(path: string): string {
    const parts = path.split('/').filter(p => p)
    return parts[parts.length - 1] || 'root'
  }
}

export const nginxService = new NginxService()
