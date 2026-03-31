const axios = require('axios')

const DEMAND_MAP = {
  'Diwali': ['dry fruits', 'sweets', 'oil', 'ghee', 'sugar', 'chocolate', 'namkeen'],
  'Holi': ['sweets', 'milk', 'sugar', 'thandai', 'colours'],
  'Navratri': ['sabudana', 'singhara atta', 'fruits', 'milk', 'sendha namak'],
  'Dussehra': ['sweets', 'sugar', 'dry fruits'],
  'Ganesh Chaturthi': ['modak', 'coconut', 'jaggery', 'rice flour', 'sweets'],
  'Janmashtami': ['milk', 'butter', 'dahi', 'dry fruits', 'sweets'],
  'Raksha Bandhan': ['sweets', 'chocolate', 'dry fruits'],
  'Chhath': ['thekua', 'fruits', 'sugarcane', 'coconut', 'wheat flour', 'ghee'],
  'Karwa Chauth': ['sweets', 'dry fruits', 'fruits'],
  'Pongal': ['rice', 'jaggery', 'coconut', 'sugarcane', 'milk'],
  'Sankranti': ['til', 'gur', 'rewari', 'groundnuts', 'popcorn'],
  'Lohri': ['til', 'gur', 'rewari', 'popcorn', 'groundnuts'],
  'Baisakhi': ['sweets', 'dry fruits', 'butter', 'milk'],
  'Onam': ['rice', 'coconut', 'vegetables', 'bananas', 'jaggery'],
  'Ugadi': ['neem flowers', 'jaggery', 'tamarind', 'coconut', 'raw mango'],
  'Vishu': ['coconut', 'rice', 'fruits', 'bananas', 'sweets'],
  'Bihu': ['rice', 'coconut', 'jaggery', 'til', 'sweets'],
  'Durga Puja': ['sweets', 'fruits', 'coconut', 'flowers', 'sindoor'],
  'Eid': ['sewai', 'dates', 'sugar', 'ghee', 'dry fruits'],
  'Christmas': ['cake ingredients', 'chocolate', 'dry fruits', 'juice'],
  'Guru Nanak': ['ghee', 'wheat flour', 'sugar', 'dry fruits'],
  'New Year': ['chocolate', 'dry fruits', 'juice', 'sweets', 'namkeen'],
  'Teej': ['sweets', 'ghewar', 'fruits', 'coconut'],
  'Shivratri': ['milk', 'fruits', 'dry fruits', 'belpatra'],
  'Ram Navami': ['sweets', 'fruits', 'coconut'],
  'Hanuman Jayanti': ['sindoor', 'sweets', 'coconut', 'oil', 'bananas'],
  'Hanuman': ['sindoor', 'sweets', 'coconut', 'oil', 'bananas'],
  'Buddha Purnima': ['fruits', 'sweets', 'flowers', 'coconut'],
  'Mahavir': ['fruits', 'dry fruits', 'sweets', 'coconut'],
  'Muharram': ['dates', 'sweets', 'dry fruits'],
  'Maha Shivratri': ['milk', 'fruits', 'dry fruits', 'belpatra'],
  'Vasant Panchami': ['sweets', 'yellow rice', 'coconut'],
  'default': ['sweets', 'dry fruits', 'coconut', 'sugar']
}

const getDemandItems = (festivalName) => {
  const name = festivalName || ''
  for (const key of Object.keys(DEMAND_MAP)) {
    if (name.toLowerCase().includes(key.toLowerCase())) {
      return DEMAND_MAP[key]
    }
  }
  return DEMAND_MAP['default']
}

const parseIndianDate = (dateKey) => {
  // Format: "January 1, 2026, Thursday"
  // Remove the day name at the end
  const withoutDay = dateKey.replace(/,\s*\w+day$/, '').trim()
  // Now it's "January 1, 2026"
  return new Date(withoutDay)
}

const getFestivals = async () => {
  try {
    const year = new Date().getFullYear()
    const response = await axios.get(
      `https://jayantur13.github.io/calendar-bharat/calendar/${year}.json`,
      { timeout: 8000 }
    )

    const yearData = response.data[year]
    if (!yearData) throw new Error('No data for year ' + year)

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const upcoming = []

    for (const monthData of Object.values(yearData)) {
      for (const [dateKey, info] of Object.entries(monthData)) {
        if (!info || !info.event) continue
        if (info.type === 'Good to know') continue

        const festDate = parseIndianDate(dateKey)
        if (isNaN(festDate.getTime())) continue

        const daysUntil = Math.ceil(
          (festDate - today) / (1000 * 60 * 60 * 24)
        )
        if (daysUntil < 0 || daysUntil > 45) continue

        upcoming.push({
          name: info.event,
          date: festDate.toISOString().split('T')[0],
          daysUntil,
          type: info.type,
          extras: info.extras || '',
          demandItems: getDemandItems(info.event),
          demandFactor: daysUntil <= 3 ? 1.8 : daysUntil <= 7 ? 1.5 : 1.25
        })
      }
    }

    console.log(`Fetched ${upcoming.length} upcoming festivals from API`)
    return upcoming.sort((a, b) => a.daysUntil - b.daysUntil)

  } catch (err) {
    console.error('Festival API failed, using fallback:', err.message)
    return getFallbackFestivals()
  }
}

const getFallbackFestivals = () => {
  const today = new Date()
  const festivals = [
    { name: 'Baisakhi', date: '2026-04-13' },
    { name: 'Hanuman Jayanti', date: '2026-04-02' },
    { name: 'Ram Navami', date: '2026-03-28' },
    { name: 'Diwali', date: '2026-11-08' },
    { name: 'Navratri', date: '2026-10-12' },
    { name: 'Christmas', date: '2026-12-25' },
    { name: 'New Year', date: '2027-01-01' },
  ]
  return festivals
    .map(f => {
      const daysUntil = Math.ceil(
        (new Date(f.date) - today) / (1000 * 60 * 60 * 24)
      )
      return {
        ...f,
        daysUntil,
        demandItems: getDemandItems(f.name),
        demandFactor: 1.25
      }
    })
    .filter(f => f.daysUntil >= 0 && f.daysUntil <= 45)
    .sort((a, b) => a.daysUntil - b.daysUntil)
}

module.exports = { getFestivals }
