import type { NginxItem } from '@/types'

class NginxService {
  private baseUrl: string = '/music' // URL вашего nginx сервера

  setBaseUrl(url: string) {
    this.baseUrl = url
  }

  /**
   * Получить список файлов из директории через nginx autoindex
   * Формат ответа nginx autoindex должен быть JSON
   * Настройка nginx: autoindex on; autoindex_format json;
   */
  async listDirectory(path: string = ''): Promise<NginxItem[]> {
    try {
      const url = `${this.baseUrl}${path}/?json`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Преобразуем ответ nginx autoindex в наш формат
      return data.map((item: NginxItem) => ({
        name: item.name,
        type: item.type === 'directory' ? 'directory' : 'file',
        size: item.size,
        mtime: item.mtime,
        path: `${path}/${item.name}`.replace(/\/\//g, '/'),
        url: `${this.baseUrl}${path}/${item.name}`.replace(/\/\//g, '/')
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
    return '/' + parts.join('/')
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
