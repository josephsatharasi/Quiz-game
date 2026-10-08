const BASE = 'http://localhost:5000/api'

async function request(path) {
  const res  = await fetch(`${BASE}${path}`)
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Request failed')
  return data
}

export const api = {
  get: (path) => request(path),
}
