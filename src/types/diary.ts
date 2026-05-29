// 日记数据类型
export type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy' | 'custom'

export interface DiaryEntry {
  id: string
  date: string        // 'YYYY-MM-DD'
  weather: WeatherType
  customWeather?: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

export const WEATHER_OPTIONS: { value: WeatherType; label: string; emoji: string }[] = [
  { value: 'sunny',  label: '晴天', emoji: '☀️' },
  { value: 'cloudy', label: '阴天', emoji: '☁️' },
  { value: 'rainy',  label: '下雨', emoji: '🌧️' },
  { value: 'snowy',  label: '下雪', emoji: '❄️' },
  { value: 'windy',  label: '刮风', emoji: '💨' },
]
