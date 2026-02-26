import DateNormalizer from './utils/dateNormalizer'

import type { Album, Country, Genre } from '@/types'

export const sortByDate = (a: Album, b: Album): number => {
  if (DateNormalizer.normalizeDate(a.release_date) < DateNormalizer.normalizeDate(b.release_date)) return -1
  return 1
}

export const countries: Country[] = [
  { name: 'Афганистан', nameEn: 'Afghanistan', code: 'AF' },
  { name: 'Аландские острова', nameEn: 'Åland Islands', code: 'AX' },
  { name: 'Албания', nameEn: 'Albania', code: 'AL' },
  { name: 'Алжир', nameEn: 'Algeria', code: 'DZ' },
  { name: 'Андорра', nameEn: 'Andorra', code: 'AD' },
  { name: 'Ангола', nameEn: 'Angola', code: 'AO' },
  { name: 'Аргентина', nameEn: 'Argentina', code: 'AR' },
  { name: 'Армения', nameEn: 'Armenia', code: 'AM' },
  { name: 'Аруба', nameEn: 'Aruba', code: 'AW' },
  { name: 'Австралия', nameEn: 'Australia', code: 'AU' },
  { name: 'Австрия', nameEn: 'Austria', code: 'AT' },
  { name: 'Азербайджан', nameEn: 'Azerbaijan', code: 'AZ' },
  { name: 'Бахрейн', nameEn: 'Bahrain', code: 'BH' },
  { name: 'Бангладеш', nameEn: 'Bangladesh', code: 'BD' },
  { name: 'Барбадос', nameEn: 'Barbados', code: 'BB' },
  { name: 'Беларусь', nameEn: 'Belarus', code: 'BY' },
  { name: 'Бельгия', nameEn: 'Belgium', code: 'BE' },
  { name: 'Белиз', nameEn: 'Belize', code: 'BZ' },
  { name: 'Боливия', nameEn: 'Bolivia', code: 'BO' },
  { name: 'Босния и Герцеговина', nameEn: 'Bosnia and Herzegovina', code: 'BA' },
  { name: 'Ботсвана', nameEn: 'Botswana', code: 'BW' },
  { name: 'Бразилия', nameEn: 'Brazil', code: 'BR' },
  { name: 'Бруней', nameEn: 'Brunei', code: 'BN' },
  { name: 'Болгария', nameEn: 'Bulgaria', code: 'BG' },
  { name: 'Камбоджа', nameEn: 'Cambodia', code: 'KH' },
  { name: 'Канада', nameEn: 'Canada', code: 'CA' },
  { name: 'Чили', nameEn: 'Chile', code: 'CL' },
  { name: 'Китай', nameEn: 'China', code: 'CN' },
  { name: 'Колумбия', nameEn: 'Colombia', code: 'CO' },
  { name: 'Коста-Рика', nameEn: 'Costa Rica', code: 'CR' },
  { name: 'Хорватия', nameEn: 'Croatia', code: 'HR' },
  { name: 'Куба', nameEn: 'Cuba', code: 'CU' },
  { name: 'Кюрасао', nameEn: 'Curaçao', code: 'CW' },
  { name: 'Кипр', nameEn: 'Cyprus', code: 'CY' },
  { name: 'Чехия', nameEn: 'Czechia', code: 'CZ' },
  { name: 'Дания', nameEn: 'Denmark', code: 'DK' },
  { name: 'Доминиканская Республика', nameEn: 'Dominican Republic', code: 'DO' },
  { name: 'Восточный Тимор', nameEn: 'East Timor', code: 'TL' },
  { name: 'Эквадор', nameEn: 'Ecuador', code: 'EC' },
  { name: 'Египет', nameEn: 'Egypt', code: 'EG' },
  { name: 'Сальвадор', nameEn: 'El Salvador', code: 'SV' },
  { name: 'Эстония', nameEn: 'Estonia', code: 'EE' },
  { name: 'Эфиопия', nameEn: 'Ethiopia', code: 'ET' },
  { name: 'Фолклендские острова', nameEn: 'Falkland Islands', code: 'FK' },
  { name: 'Фарерские острова', nameEn: 'Faroe Islands', code: 'FO' },
  { name: 'Финляндия', nameEn: 'Finland', code: 'FI' },
  { name: 'Франция', nameEn: 'France', code: 'FR' },
  { name: 'Французская Гвиана', nameEn: 'French Guiana', code: 'GF' },
  { name: 'Французская Полинезия', nameEn: 'French Polynesia', code: 'PF' },
  { name: 'Грузия', nameEn: 'Georgia', code: 'GE' },
  { name: 'Германия', nameEn: 'Germany', code: 'DE' },
  { name: 'Гибралтар', nameEn: 'Gibraltar', code: 'GI' },
  { name: 'Греция', nameEn: 'Greece', code: 'GR' },
  { name: 'Гренландия', nameEn: 'Greenland', code: 'GL' },
  { name: 'Гваделупа', nameEn: 'Guadeloupe', code: 'GP' },
  { name: 'Гуам', nameEn: 'Guam', code: 'GU' },
  { name: 'Гватемала', nameEn: 'Guatemala', code: 'GT' },
  { name: 'Гернси', nameEn: 'Guernsey', code: 'GG' },
  { name: 'Гайана', nameEn: 'Guyana', code: 'GY' },
  { name: 'Гондурас', nameEn: 'Honduras', code: 'HN' },
  { name: 'Гонконг', nameEn: 'Hong Kong', code: 'HK' },
  { name: 'Венгрия', nameEn: 'Hungary', code: 'HU' },
  { name: 'Исландия', nameEn: 'Iceland', code: 'IS' },
  { name: 'Индия', nameEn: 'India', code: 'IN' },
  { name: 'Индонезия', nameEn: 'Indonesia', code: 'ID' },
  { name: 'Международный', nameEn: 'International', code: 'INT' },
  { name: 'Иран', nameEn: 'Iran', code: 'IR' },
  { name: 'Ирак', nameEn: 'Iraq', code: 'IQ' },
  { name: 'Ирландия', nameEn: 'Ireland', code: 'IE' },
  { name: 'Остров Мэн', nameEn: 'Isle of Man', code: 'IM' },
  { name: 'Израиль', nameEn: 'Israel', code: 'IL' },
  { name: 'Италия', nameEn: 'Italy', code: 'IT' },
  { name: 'Ямайка', nameEn: 'Jamaica', code: 'JM' },
  { name: 'Япония', nameEn: 'Japan', code: 'JP' },
  { name: 'Джерси', nameEn: 'Jersey', code: 'JE' },
  { name: 'Иордания', nameEn: 'Jordan', code: 'JO' },
  { name: 'Казахстан', nameEn: 'Kazakhstan', code: 'KZ' },
  { name: 'Кения', nameEn: 'Kenya', code: 'KE' },
  { name: 'Южная Корея', nameEn: 'Korea, South', code: 'KR' },
  { name: 'Кувейт', nameEn: 'Kuwait', code: 'KW' },
  { name: 'Кыргызстан', nameEn: 'Kyrgyzstan', code: 'KG' },
  { name: 'Лаос', nameEn: 'Laos', code: 'LA' },
  { name: 'Латвия', nameEn: 'Latvia', code: 'LV' },
  { name: 'Ливан', nameEn: 'Lebanon', code: 'LB' },
  { name: 'Ливия', nameEn: 'Libya', code: 'LY' },
  { name: 'Лихтенштейн', nameEn: 'Liechtenstein', code: 'LI' },
  { name: 'Литва', nameEn: 'Lithuania', code: 'LT' },
  { name: 'Люксембург', nameEn: 'Luxembourg', code: 'LU' },
  { name: 'Мадагаскар', nameEn: 'Madagascar', code: 'MG' },
  { name: 'Малави', nameEn: 'Malawi', code: 'MW' },
  { name: 'Малайзия', nameEn: 'Malaysia', code: 'MY' },
  { name: 'Мальдивы', nameEn: 'Maldives', code: 'MV' },
  { name: 'Мальта', nameEn: 'Malta', code: 'MT' },
  { name: 'Маврикий', nameEn: 'Mauritius', code: 'MU' },
  { name: 'Мексика', nameEn: 'Mexico', code: 'MX' },
  { name: 'Молдова', nameEn: 'Moldova', code: 'MD' },
  { name: 'Монако', nameEn: 'Monaco', code: 'MC' },
  { name: 'Монголия', nameEn: 'Mongolia', code: 'MN' },
  { name: 'Черногория', nameEn: 'Montenegro', code: 'ME' },
  { name: 'Марокко', nameEn: 'Morocco', code: 'MA' },
  { name: 'Мозамбик', nameEn: 'Mozambique', code: 'MZ' },
  { name: 'Мьянма', nameEn: 'Myanmar', code: 'MM' },
  { name: 'Намибия', nameEn: 'Namibia', code: 'NA' },
  { name: 'Непал', nameEn: 'Nepal', code: 'NP' },
  { name: 'Нидерланды', nameEn: 'Netherlands', code: 'NL' },
  { name: 'Новая Каледония', nameEn: 'New Caledonia', code: 'NC' },
  { name: 'Новая Зеландия', nameEn: 'New Zealand', code: 'NZ' },
  { name: 'Никарагуа', nameEn: 'Nicaragua', code: 'NI' },
  { name: 'Северная Македония', nameEn: 'North Macedonia', code: 'MK' },
  { name: 'Норвегия', nameEn: 'Norway', code: 'NO' },
  { name: 'Оман', nameEn: 'Oman', code: 'OM' },
  { name: 'Пакистан', nameEn: 'Pakistan', code: 'PK' },
  { name: 'Палестина', nameEn: 'Palestine', code: 'PS' },
  { name: 'Панама', nameEn: 'Panama', code: 'PA' },
  { name: 'Парагвай', nameEn: 'Paraguay', code: 'PY' },
  { name: 'Перу', nameEn: 'Peru', code: 'PE' },
  { name: 'Филиппины', nameEn: 'Philippines', code: 'PH' },
  { name: 'Польша', nameEn: 'Poland', code: 'PL' },
  { name: 'Португалия', nameEn: 'Portugal', code: 'PT' },
  { name: 'Пуэрто-Рико', nameEn: 'Puerto Rico', code: 'PR' },
  { name: 'Катар', nameEn: 'Qatar', code: 'QA' },
  { name: 'Реюньон', nameEn: 'Reunion', code: 'RE' },
  { name: 'Румыния', nameEn: 'Romania', code: 'RO' },
  { name: 'Россия', nameEn: 'Russia', code: 'RU' },
  { name: 'Сен-Пьер и Микелон', nameEn: 'Saint Pierre and Miquelon', code: 'PM' },
  { name: 'Сан-Марино', nameEn: 'San Marino', code: 'SM' },
  { name: 'Саудовская Аравия', nameEn: 'Saudi Arabia', code: 'SA' },
  { name: 'Сербия', nameEn: 'Serbia', code: 'RS' },
  { name: 'Сингапур', nameEn: 'Singapore', code: 'SG' },
  { name: 'Словакия', nameEn: 'Slovakia', code: 'SK' },
  { name: 'Словения', nameEn: 'Slovenia', code: 'SI' },
  { name: 'Южная Африка', nameEn: 'South Africa', code: 'ZA' },
  { name: 'Испания', nameEn: 'Spain', code: 'ES' },
  { name: 'Шри-Ланка', nameEn: 'Sri Lanka', code: 'LK' },
  { name: 'Суринам', nameEn: 'Suriname', code: 'SR' },
  { name: 'Шпицберген', nameEn: 'Svalbard', code: 'SJ' },
  { name: 'Швеция', nameEn: 'Sweden', code: 'SE' },
  { name: 'Швейцария', nameEn: 'Switzerland', code: 'CH' },
  { name: 'Сирия', nameEn: 'Syria', code: 'SY' },
  { name: 'Тайвань', nameEn: 'Taiwan', code: 'TW' },
  { name: 'Таджикистан', nameEn: 'Tajikistan', code: 'TJ' },
  { name: 'Таиланд', nameEn: 'Thailand', code: 'TH' },
  { name: 'Тринидад и Тобаго', nameEn: 'Trinidad and Tobago', code: 'TT' },
  { name: 'Тунис', nameEn: 'Tunisia', code: 'TN' },
  { name: 'Турция', nameEn: 'Türkiye', code: 'TR' },
  { name: 'Туркменистан', nameEn: 'Turkmenistan', code: 'TM' },
  { name: 'Уганда', nameEn: 'Uganda', code: 'UG' },
  { name: 'Украина', nameEn: 'Ukraine', code: 'UA' },
  { name: 'ОАЭ', nameEn: 'United Arab Emirates', code: 'AE' },
  { name: 'Великобритания', nameEn: 'United Kingdom', code: 'GB' },
  { name: 'США', nameEn: 'United States', code: 'US' },
  { name: 'Неизвестно', nameEn: 'Unknown', code: 'XX' },
  { name: 'Уругвай', nameEn: 'Uruguay', code: 'UY' },
  { name: 'Узбекистан', nameEn: 'Uzbekistan', code: 'UZ' },
  { name: 'Венесуэла', nameEn: 'Venezuela', code: 'VE' },
  { name: 'Вьетнам', nameEn: 'Vietnam', code: 'VN' },
  { name: 'Замбия', nameEn: 'Zambia', code: 'ZM' },
  { name: 'Зимбабве', nameEn: 'Zimbabwe', code: 'ZW' }
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
