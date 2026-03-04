import DateNormalizer from './utils/dateNormalizer'

import type { Album, Country, Genre, SelectItem } from '@/types'

export const sortByDate = (a: Album, b: Album): number => {
  if (DateNormalizer.normalizeDate(a.release_date) < DateNormalizer.normalizeDate(b.release_date)) return -1
  return 1
}

export const bandStatuses: SelectItem[] = [
  { title: 'Любой', value: '' },
  { title: 'Активна', value: 1 },
  { title: 'На паузе', value: 2 },
  { title: 'Распалась', value: 3 },
  { title: 'Неизвестно', value: 4 },
  { title: 'Сменила название', value: 5 },
  { title: 'Оспариваемый', value: 6 }
]

export const albumTypes: SelectItem[] = [
  { title: 'Full-length', value: 'Full-length' },
  { title: 'EP', value: 'EP' },
  { title: 'Single', value: 'Single' },
  { title: 'Demo', value: 'Demo' },
  { title: 'Live', value: 'Live' },
  { title: 'Compilation', value: 'Compilation' }
]

export const releaseTypes: SelectItem[] = [
  { title: 'Любой', value: '' },
  { title: 'Full-length', value: 1 },
  { title: 'Live', value: 2 },
  { title: 'Demo', value: 3 },
  { title: 'Single', value: 4 },
  { title: 'EP', value: 5 },
  { title: 'Video', value: 6 },
  { title: 'Boxed set', value: 7 },
  { title: 'Split', value: 8 },
  { title: 'Compilation', value: 10 },
  { title: 'Split video', value: 12 },
  { title: 'Collaboration', value: 13 }
]

export const releaseFormats: SelectItem[] = [
  { title: 'Любой', value: '' },
  { title: 'CD', value: 'CD' },
  { title: 'Cassette', value: 'Cassette*' },
  { title: 'Vinyl', value: 'Vinyl*' },
  { title: 'VHS', value: 'VHS' },
  { title: 'DVD', value: 'DVD' },
  { title: 'Digital', value: 'Digital' },
  { title: 'Blu-ray', value: 'Blu-ray*' },
  { title: 'Other', value: 'Other' }
]

export const countries: Country[] = [
  { title: 'Любая', titleEn: 'Any', value: '' },
  { title: 'Афганистан', titleEn: 'Afghanistan', value: 'AF' },
  { title: 'Аландские острова', titleEn: 'Åland Islands', value: 'AX' },
  { title: 'Албания', titleEn: 'Albania', value: 'AL' },
  { title: 'Алжир', titleEn: 'Algeria', value: 'DZ' },
  { title: 'Андорра', titleEn: 'Andorra', value: 'AD' },
  { title: 'Ангола', titleEn: 'Angola', value: 'AO' },
  { title: 'Аргентина', titleEn: 'Argentina', value: 'AR' },
  { title: 'Армения', titleEn: 'Armenia', value: 'AM' },
  { title: 'Аруба', titleEn: 'Aruba', value: 'AW' },
  { title: 'Австралия', titleEn: 'Australia', value: 'AU' },
  { title: 'Австрия', titleEn: 'Austria', value: 'AT' },
  { title: 'Азербайджан', titleEn: 'Azerbaijan', value: 'AZ' },
  { title: 'Бахрейн', titleEn: 'Bahrain', value: 'BH' },
  { title: 'Бангладеш', titleEn: 'Bangladesh', value: 'BD' },
  { title: 'Барбадос', titleEn: 'Barbados', value: 'BB' },
  { title: 'Беларусь', titleEn: 'Belarus', value: 'BY' },
  { title: 'Бельгия', titleEn: 'Belgium', value: 'BE' },
  { title: 'Белиз', titleEn: 'Belize', value: 'BZ' },
  { title: 'Боливия', titleEn: 'Bolivia', value: 'BO' },
  { title: 'Босния и Герцеговина', titleEn: 'Bosnia and Herzegovina', value: 'BA' },
  { title: 'Ботсвана', titleEn: 'Botswana', value: 'BW' },
  { title: 'Бразилия', titleEn: 'Brazil', value: 'BR' },
  { title: 'Бруней', titleEn: 'Brunei', value: 'BN' },
  { title: 'Болгария', titleEn: 'Bulgaria', value: 'BG' },
  { title: 'Камбоджа', titleEn: 'Cambodia', value: 'KH' },
  { title: 'Канада', titleEn: 'Canada', value: 'CA' },
  { title: 'Чили', titleEn: 'Chile', value: 'CL' },
  { title: 'Китай', titleEn: 'China', value: 'CN' },
  { title: 'Колумбия', titleEn: 'Colombia', value: 'CO' },
  { title: 'Коста-Рика', titleEn: 'Costa Rica', value: 'CR' },
  { title: 'Хорватия', titleEn: 'Croatia', value: 'HR' },
  { title: 'Куба', titleEn: 'Cuba', value: 'CU' },
  { title: 'Кюрасао', titleEn: 'Curaçao', value: 'CW' },
  { title: 'Кипр', titleEn: 'Cyprus', value: 'CY' },
  { title: 'Чехия', titleEn: 'Czechia', value: 'CZ' },
  { title: 'Дания', titleEn: 'Denmark', value: 'DK' },
  { title: 'Доминиканская Республика', titleEn: 'Dominican Republic', value: 'DO' },
  { title: 'Восточный Тимор', titleEn: 'East Timor', value: 'TL' },
  { title: 'Эквадор', titleEn: 'Ecuador', value: 'EC' },
  { title: 'Египет', titleEn: 'Egypt', value: 'EG' },
  { title: 'Сальвадор', titleEn: 'El Salvador', value: 'SV' },
  { title: 'Эстония', titleEn: 'Estonia', value: 'EE' },
  { title: 'Эфиопия', titleEn: 'Ethiopia', value: 'ET' },
  { title: 'Фолклендские острова', titleEn: 'Falkland Islands', value: 'FK' },
  { title: 'Фарерские острова', titleEn: 'Faroe Islands', value: 'FO' },
  { title: 'Финляндия', titleEn: 'Finland', value: 'FI' },
  { title: 'Франция', titleEn: 'France', value: 'FR' },
  { title: 'Французская Гвиана', titleEn: 'French Guiana', value: 'GF' },
  { title: 'Французская Полинезия', titleEn: 'French Polynesia', value: 'PF' },
  { title: 'Грузия', titleEn: 'Georgia', value: 'GE' },
  { title: 'Германия', titleEn: 'Germany', value: 'DE' },
  { title: 'Гибралтар', titleEn: 'Gibraltar', value: 'GI' },
  { title: 'Греция', titleEn: 'Greece', value: 'GR' },
  { title: 'Гренландия', titleEn: 'Greenland', value: 'GL' },
  { title: 'Гваделупа', titleEn: 'Guadeloupe', value: 'GP' },
  { title: 'Гуам', titleEn: 'Guam', value: 'GU' },
  { title: 'Гватемала', titleEn: 'Guatemala', value: 'GT' },
  { title: 'Гернси', titleEn: 'Guernsey', value: 'GG' },
  { title: 'Гайана', titleEn: 'Guyana', value: 'GY' },
  { title: 'Гондурас', titleEn: 'Honduras', value: 'HN' },
  { title: 'Гонконг', titleEn: 'Hong Kong', value: 'HK' },
  { title: 'Венгрия', titleEn: 'Hungary', value: 'HU' },
  { title: 'Исландия', titleEn: 'Iceland', value: 'IS' },
  { title: 'Индия', titleEn: 'India', value: 'IN' },
  { title: 'Индонезия', titleEn: 'Indonesia', value: 'ID' },
  { title: 'Международный', titleEn: 'International', value: 'INT' },
  { title: 'Иран', titleEn: 'Iran', value: 'IR' },
  { title: 'Ирак', titleEn: 'Iraq', value: 'IQ' },
  { title: 'Ирландия', titleEn: 'Ireland', value: 'IE' },
  { title: 'Остров Мэн', titleEn: 'Isle of Man', value: 'IM' },
  { title: 'Израиль', titleEn: 'Israel', value: 'IL' },
  { title: 'Италия', titleEn: 'Italy', value: 'IT' },
  { title: 'Ямайка', titleEn: 'Jamaica', value: 'JM' },
  { title: 'Япония', titleEn: 'Japan', value: 'JP' },
  { title: 'Джерси', titleEn: 'Jersey', value: 'JE' },
  { title: 'Иордания', titleEn: 'Jordan', value: 'JO' },
  { title: 'Казахстан', titleEn: 'Kazakhstan', value: 'KZ' },
  { title: 'Кения', titleEn: 'Kenya', value: 'KE' },
  { title: 'Южная Корея', titleEn: 'Korea, South', value: 'KR' },
  { title: 'Кувейт', titleEn: 'Kuwait', value: 'KW' },
  { title: 'Кыргызстан', titleEn: 'Kyrgyzstan', value: 'KG' },
  { title: 'Лаос', titleEn: 'Laos', value: 'LA' },
  { title: 'Латвия', titleEn: 'Latvia', value: 'LV' },
  { title: 'Ливан', titleEn: 'Lebanon', value: 'LB' },
  { title: 'Ливия', titleEn: 'Libya', value: 'LY' },
  { title: 'Лихтенштейн', titleEn: 'Liechtenstein', value: 'LI' },
  { title: 'Литва', titleEn: 'Lithuania', value: 'LT' },
  { title: 'Люксембург', titleEn: 'Luxembourg', value: 'LU' },
  { title: 'Мадагаскар', titleEn: 'Madagascar', value: 'MG' },
  { title: 'Малави', titleEn: 'Malawi', value: 'MW' },
  { title: 'Малайзия', titleEn: 'Malaysia', value: 'MY' },
  { title: 'Мальдивы', titleEn: 'Maldives', value: 'MV' },
  { title: 'Мальта', titleEn: 'Malta', value: 'MT' },
  { title: 'Маврикий', titleEn: 'Mauritius', value: 'MU' },
  { title: 'Мексика', titleEn: 'Mexico', value: 'MX' },
  { title: 'Молдова', titleEn: 'Moldova', value: 'MD' },
  { title: 'Монако', titleEn: 'Monaco', value: 'MC' },
  { title: 'Монголия', titleEn: 'Mongolia', value: 'MN' },
  { title: 'Черногория', titleEn: 'Montenegro', value: 'ME' },
  { title: 'Марокко', titleEn: 'Morocco', value: 'MA' },
  { title: 'Мозамбик', titleEn: 'Mozambique', value: 'MZ' },
  { title: 'Мьянма', titleEn: 'Myanmar', value: 'MM' },
  { title: 'Намибия', titleEn: 'Namibia', value: 'NA' },
  { title: 'Непал', titleEn: 'Nepal', value: 'NP' },
  { title: 'Нидерланды', titleEn: 'Netherlands', value: 'NL' },
  { title: 'Новая Каледония', titleEn: 'New Caledonia', value: 'NC' },
  { title: 'Новая Зеландия', titleEn: 'New Zealand', value: 'NZ' },
  { title: 'Никарагуа', titleEn: 'Nicaragua', value: 'NI' },
  { title: 'Северная Македония', titleEn: 'North Macedonia', value: 'MK' },
  { title: 'Норвегия', titleEn: 'Norway', value: 'NO' },
  { title: 'Оман', titleEn: 'Oman', value: 'OM' },
  { title: 'Пакистан', titleEn: 'Pakistan', value: 'PK' },
  { title: 'Палестина', titleEn: 'Palestine', value: 'PS' },
  { title: 'Панама', titleEn: 'Panama', value: 'PA' },
  { title: 'Парагвай', titleEn: 'Paraguay', value: 'PY' },
  { title: 'Перу', titleEn: 'Peru', value: 'PE' },
  { title: 'Филиппины', titleEn: 'Philippines', value: 'PH' },
  { title: 'Польша', titleEn: 'Poland', value: 'PL' },
  { title: 'Португалия', titleEn: 'Portugal', value: 'PT' },
  { title: 'Пуэрто-Рико', titleEn: 'Puerto Rico', value: 'PR' },
  { title: 'Катар', titleEn: 'Qatar', value: 'QA' },
  { title: 'Реюньон', titleEn: 'Reunion', value: 'RE' },
  { title: 'Румыния', titleEn: 'Romania', value: 'RO' },
  { title: 'Россия', titleEn: 'Russia', value: 'RU' },
  { title: 'Сен-Пьер и Микелон', titleEn: 'Saint Pierre and Miquelon', value: 'PM' },
  { title: 'Сан-Марино', titleEn: 'San Marino', value: 'SM' },
  { title: 'Саудовская Аравия', titleEn: 'Saudi Arabia', value: 'SA' },
  { title: 'Сербия', titleEn: 'Serbia', value: 'RS' },
  { title: 'Сингапур', titleEn: 'Singapore', value: 'SG' },
  { title: 'Словакия', titleEn: 'Slovakia', value: 'SK' },
  { title: 'Словения', titleEn: 'Slovenia', value: 'SI' },
  { title: 'Южная Африка', titleEn: 'South Africa', value: 'ZA' },
  { title: 'Испания', titleEn: 'Spain', value: 'ES' },
  { title: 'Шри-Ланка', titleEn: 'Sri Lanka', value: 'LK' },
  { title: 'Суринам', titleEn: 'Suriname', value: 'SR' },
  { title: 'Шпицберген', titleEn: 'Svalbard', value: 'SJ' },
  { title: 'Швеция', titleEn: 'Sweden', value: 'SE' },
  { title: 'Швейцария', titleEn: 'Switzerland', value: 'CH' },
  { title: 'Сирия', titleEn: 'Syria', value: 'SY' },
  { title: 'Тайвань', titleEn: 'Taiwan', value: 'TW' },
  { title: 'Таджикистан', titleEn: 'Tajikistan', value: 'TJ' },
  { title: 'Таиланд', titleEn: 'Thailand', value: 'TH' },
  { title: 'Тринидад и Тобаго', titleEn: 'Trinidad and Tobago', value: 'TT' },
  { title: 'Тунис', titleEn: 'Tunisia', value: 'TN' },
  { title: 'Турция', titleEn: 'Türkiye', value: 'TR' },
  { title: 'Туркменистан', titleEn: 'Turkmenistan', value: 'TM' },
  { title: 'Уганда', titleEn: 'Uganda', value: 'UG' },
  { title: 'Украина', titleEn: 'Ukraine', value: 'UA' },
  { title: 'ОАЭ', titleEn: 'United Arab Emirates', value: 'AE' },
  { title: 'Великобритания', titleEn: 'United Kingdom', value: 'GB' },
  { title: 'США', titleEn: 'United States', value: 'US' },
  { title: 'Неизвестно', titleEn: 'Unknown', value: 'XX' },
  { title: 'Уругвай', titleEn: 'Uruguay', value: 'UY' },
  { title: 'Узбекистан', titleEn: 'Uzbekistan', value: 'UZ' },
  { title: 'Венесуэла', titleEn: 'Venezuela', value: 'VE' },
  { title: 'Вьетнам', titleEn: 'Vietnam', value: 'VN' },
  { title: 'Замбия', titleEn: 'Zambia', value: 'ZM' },
  { title: 'Зимбабве', titleEn: 'Zimbabwe', value: 'ZW' }
]

export const genres: Genre[] = [
  {
    id: 'black',
    name: 'Black Metal'
  },
  {
    id: 'death',
    name: 'Death Metal'
  },
  {
    id: 'doom',
    name: 'Doom/Stoner/Sludge'
  },
  {
    id: 'electronic',
    name: 'Electronic/Industrial'
  },
  {
    id: 'avantgarde',
    name: 'Experimental/Avant-garde'
  },
  {
    id: 'folk',
    name: 'Folk/Viking/Pagan'
  },
  {
    id: 'gothic',
    name: 'Gothic Metal'
  },
  {
    id: 'grind',
    name: 'Grindcore'
  },
  {
    id: 'groove',
    name: 'Groove Metal'
  },
  {
    id: 'heavy',
    name: 'Heavy Metal'
  },
  {
    id: 'metalcore',
    name: 'Metalcore/Deathcore'
  },
  {
    id: 'power',
    name: 'Power Metal'
  },
  {
    id: 'prog',
    name: 'Progressive Metal'
  },
  {
    id: 'speed',
    name: 'Speed Metal'
  },
  {
    id: 'orchestral',
    name: 'Symphonic Metal'
  },
  {
    id: 'thrash',
    name: 'Thrash Metal'
  }
]
