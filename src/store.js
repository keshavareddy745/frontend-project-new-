const STORAGE_KEY = 'fedf_ps08_data'

function load() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return {
    reports: [],
    feedback: [],
    updates: [],
    responses: [],
    flags: [],
    users: [{ id: 1, name: 'Admin', role: 'Admin' }],
    currentRole: null,
    currentUser: null,
    leaderImages: {},
  }
  try {
    return JSON.parse(raw)
  } catch {
    return {
      reports: [],
      feedback: [],
      updates: [],
      responses: [],
      flags: [],
      users: [{ id: 1, name: 'Admin', role: 'Admin' }],
      currentRole: null,
      currentUser: null,
      leaderImages: {},
    }
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getData() {
  return load()
}

export function clearData() {
  localStorage.removeItem(STORAGE_KEY)
}

export function setCurrentRole(role) {
  const data = load()
  data.currentRole = role
  save(data)
  try { window.dispatchEvent(new CustomEvent('fedf_role_change')) } catch (e) { void e }
}

export function getCurrentRole() {
  return load().currentRole
}

export function logout() {
  const data = load()
  data.currentRole = null
  data.currentUser = null
  save(data)
  try { window.dispatchEvent(new CustomEvent('fedf_role_change')) } catch (e) { void e }
}

export function setCurrentUser(user) {
  const data = load()
  data.currentUser = user
  save(data)
}

export function getCurrentUser() {
  return load().currentUser
}

export function setLeaderImage(key, dataUrl) {
  const data = load()
  data.leaderImages = data.leaderImages || {}
  data.leaderImages[key] = dataUrl
  save(data)
  try { window.dispatchEvent(new CustomEvent('fedf_role_change')) } catch (e) { void e }
}

export function getLeaderImage(key) {
  const data = load()
  return (data.leaderImages || {})[key] || null
}

export function addUser(user) {
  const data = load()
  const id = Date.now()
  data.users.push({ id, ...user })
  save(data)
  return id
}

export function addReport(report) {
  const data = load()
  const id = Date.now()
  data.reports.push({ id, status: 'open', createdAt: new Date().toISOString(), ...report })
  save(data)
  return id
}

export function addFeedback(feedback) {
  const data = load()
  const id = Date.now()
  data.feedback.push({ id, createdAt: new Date().toISOString(), ...feedback })
  save(data)
  return id
}

export function addUpdate(update) {
  const data = load()
  const id = Date.now()
  data.updates.push({ id, createdAt: new Date().toISOString(), ...update })
  save(data)
  return id
}

export function addResponse(response) {
  const data = load()
  const id = Date.now()
  data.responses.push({ id, createdAt: new Date().toISOString(), ...response })
  // also mark report as addressed if provided
  if (response.reportId) {
    const r = data.reports.find(x => x.id === response.reportId)
    if (r) r.status = 'responded'
  }
  save(data)
  return id
}

export function addFlag(flag) {
  const data = load()
  const id = Date.now()
  data.flags.push({ id, createdAt: new Date().toISOString(), ...flag })
  save(data)
  return id
}

export function solveReport(reportId, note, politicianName) {
  const data = load()
  const r = data.reports.find(x => x.id === reportId)
  if (r) {
    r.status = 'solved'
    const id = Date.now()
    data.responses.push({ id, createdAt: new Date().toISOString(), reportId, message: note || 'Issue solved', politicianName })
    save(data)
    return true
  }
  return false
}

export function getReports() { return load().reports }
export function getFeedback() { return load().feedback }
export function getUpdates() { return load().updates }
export function getResponses() { return load().responses }
export function getFlags() { return load().flags }
export function getUsers() { return load().users }
