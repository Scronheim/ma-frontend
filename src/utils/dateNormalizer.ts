import dayjs, { Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

type ParsedDate = {
  year: number
  month: number | null
  day: number | null
}

class DateNormalizer {
  private static readonly SUPPORTED_FORMATS: readonly string[] = [
    'YYYY-MM-DDTHH:mm:ss.SSS', // "January 1st, 2023"
    'MMMM Dth, YYYY', // "January 1st, 2023"
    'MMMM YYYY', // "January 2023"
    'YYYY' // "2023"
  ]

  private static readonly MONTHS: { [key: string]: number } = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12
  }

  /**
   * Нормализует дату из различных форматов в единый формат
   * @param dateString - строка с датой в одном из поддерживаемых форматов
   * @param outputFormat - желаемый выходной формат (по умолчанию 'YYYY-MM-DD')
   * @returns нормализованную дату в указанном формате или null, если парсинг невозможен
   */
  public static normalizeDate(dateString: string, outputFormat: string = 'YYYY-MM-DD'): string {
    try {
      const parsedDate = this.parseDate(dateString)

      if (!parsedDate) return ''

      const normalizedDayjs = this.createDayjsFromParsedDate(parsedDate)

      if (!normalizedDayjs || !normalizedDayjs.isValid()) return ''

      return normalizedDayjs.format(outputFormat)
    } catch (error) {
      console.error(`Error normalizing date: ${dateString}`, error)
      return ''
    }
  }

  /**
   * Парсит строку даты в объект с компонентами
   */
  private static parseDate(dateString: string): ParsedDate | null {
    if (!dateString) return null

    const trimmedDate = dateString.trim()

    for (const format of this.SUPPORTED_FORMATS) {
      try {
        const date = dayjs(trimmedDate, format)
        if (date.isValid()) {
          return {
            year: date.year(),
            month: date.month() + 1,
            day: format.includes('D') ? date.date() : null
          }
        }
      } catch {
        continue
      }
    }

    // Фолбэк: парсинг вручную для сложных случаев с порядковыми числительными
    return this.parseDateManually(trimmedDate)
  }

  /**
   * Ручной парсинг для случаев с порядковыми числительными (1st, 2nd, 3rd и т.д.)
   */
  private static parseDateManually(dateString: string): ParsedDate | null {
    const patterns = [
      // Формат "MMMM Dth, YYYY"
      {
        regex: /^([a-zа-яё]+)\s+(\d{1,2})(?:st|nd|rd|th)?,\s*(\d{4})$/i,
        parser: (match: RegExpMatchArray): ParsedDate => ({
          year: parseInt(match[3]),
          month: this.parseMonth(match[1]),
          day: parseInt(match[2])
        })
      },
      // Формат "MMMM YYYY"
      {
        regex: /^([a-zа-яё]+)\s+(\d{4})$/i,
        parser: (match: RegExpMatchArray): ParsedDate => ({
          year: parseInt(match[2]),
          month: this.parseMonth(match[1]),
          day: null
        })
      },
      // Формат "YYYY"
      {
        regex: /^(\d{4})$/,
        parser: (match: RegExpMatchArray): ParsedDate => ({
          year: parseInt(match[1]),
          month: null,
          day: null
        })
      }
    ]

    for (const pattern of patterns) {
      const match = dateString.match(pattern.regex)
      if (match) {
        const parsed = pattern.parser(match)

        if (parsed.year < 1000 || parsed.year > 9999) {
          return null
        }

        if (parsed.month !== null && (parsed.month < 1 || parsed.month > 12)) {
          return null
        }

        if (parsed.day !== null && (parsed.day < 1 || parsed.day > 31)) {
          return null
        }

        return parsed
      }
    }

    return null
  }

  /**
   * Парсит название месяца в число
   */
  private static parseMonth(monthString: string): number | null {
    const normalizedMonth = monthString.toLowerCase().trim()
    return this.MONTHS[normalizedMonth] || null
  }

  /**
   * Создает dayjs объект из распарсенных компонентов
   */
  private static createDayjsFromParsedDate(parsedDate: ParsedDate): Dayjs | null {
    try {
      // Для дат без месяца (только год) используем 1 января
      const month = parsedDate.month !== null ? parsedDate.month - 1 : 0 // dayjs месяцы 0-11
      const day = parsedDate.day !== null ? parsedDate.day : 1

      return dayjs(new Date(parsedDate.year, month, day))
    } catch (error) {
      console.error('Error creating dayjs object:', error)
      return null
    }
  }

  /**
   * Дополнительный метод для получения отдельных компонентов даты
   */
  public static parseToComponents(dateString: string): ParsedDate | null {
    return this.parseDate(dateString)
  }
}

export default DateNormalizer
