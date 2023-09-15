import axios from 'axios'

type MediastackResponse = {
  error?: {
    code: number
    message: string
  }
  pagination?: {
    limit: number
    offset: number
    count: number
    total: number
  }
  data: {
    author: string
    title: string
    url: string
    image: string
    category: string
    language: string
    country: string
    published_at: string
  }[]
}

export async function getMediaStackNews(
  query: string
): Promise<MediastackResponse> {
  const apiKey = process.env.MEDIASTACK_API_KEY
  const countries = getAllMediastackCountries()
  const url =
    `http://api.mediastack.com/v1/news?access_key=${apiKey}` +
    `&keywords=${query}&countries=${countries}&languages=en&limit=20`
  const response = await axios.get<MediastackResponse>(url)
  return response.data
}

function getAllMediastackCountries(): string {
  return [
    'ar',
    'at',
    'au',
    'be',
    'bg',
    'br',
    'ca',
    'ch',
    'cn',
    'co',
    'cu',
    'cz',
    'de',
    'eg',
    'fr',
    'gb',
    'gr',
    'hk',
    'hu',
    'id',
    'ie',
    'il',
    'in',
    'it',
    'jp',
    'kr',
    'lt',
    'lv',
    'ma',
    'mx',
    'my',
    'ng',
    'nl',
    'no',
    'nz',
    'ph',
    'pl',
    'pt',
    'ro',
    'rs',
    'ru',
    'sa',
    'se',
    'sg',
    'si',
    'sk',
    'th',
    'tr',
    'tw',
    'ua',
    'us',
    've',
    'za',
  ].join(',')
}
