const STORAGE_KEY = 'fedf_ps08_data'
const BASE_URL = 'https://backendproject-6-0sai.onrender.com'

const defaultData = {
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

function emitChange() {
  try {
    window.dispatchEvent(new CustomEvent('fedf_data_change'))
    window.dispatchEvent(new CustomEvent('fedf_role_change'))
  } catch (e) {
    void e
  }
}

function load() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return { ...defaultData }

  try {
    const parsed = JSON.parse(raw)
    return {
      ...defaultData,
      ...parsed,
      reports: Array.isArray(parsed.reports) ? parsed.reports : [],
      feedback: Array.isArray(parsed.feedback) ? parsed.feedback : [],
      updates: Array.isArray(parsed.updates) ? parsed.updates : [],
      responses: Array.isArray(parsed.responses) ? parsed.responses : [],
      flags: Array.isArray(parsed.flags) ? parsed.flags : [],
      users: Array.isArray(parsed.users) ? parsed.users : defaultData.users,
      leaderImages: parsed.leaderImages || {},
    }
  } catch {
    return { ...defaultData }
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  emitChange()
}

export function getData() {
  return load()
}

export function clearData() {
  localStorage.removeItem(STORAGE_KEY)
  emitChange()
}

export function setCurrentRole(role) {
  const data = load()
  data.currentRole = role
  save(data)
}

export function getCurrentRole() {
  return load().currentRole
}

export function logout() {
  const data = load()
  data.currentRole = null
  data.currentUser = null
  save(data)
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
  data.reports.push({
    id,
    status: 'open',
    createdAt: new Date().toISOString(),
    ...report,
  })
  save(data)
  return id
}

export function addFeedback(feedback) {
  const data = load()
  const id = Date.now()
  data.feedback.push({
    id,
    createdAt: new Date().toISOString(),
    ...feedback,
  })
  save(data)
  return id
}

export function addUpdate(update) {
  const data = load()
  const id = Date.now()
  data.updates.push({
    id,
    createdAt: new Date().toISOString(),
    ...update,
  })
  save(data)
  return id
}

export function addResponse(response) {
  const data = load()
  const id = Date.now()

  data.responses.push({
    id,
    createdAt: new Date().toISOString(),
    ...response,
  })

  if (response.reportId) {
    const r = data.reports.find(x => x.id === response.reportId)
    if (r) {
      r.status = response.status || 'reviewing'
    }
  }

  save(data)
  return id
}

export function addFlag(flag) {
  const data = load()
  const id = Date.now()
  data.flags.push({
    id,
    createdAt: new Date().toISOString(),
    ...flag,
  })
  save(data)
  return id
}

export function solveReport(reportId, note, politicianName) {
  const data = load()
  const r = data.reports.find(x => x.id === reportId)

  if (r) {
    r.status = 'solved'
    const id = Date.now()

    data.responses.push({
      id,
      createdAt: new Date().toISOString(),
      reportId,
      message: note || 'Issue solved',
      politicianName,
      status: 'solved',
    })

    save(data)
    return true
  }

  return false
}

export function getReports() {
  return load().reports
}

export function getFeedback() {
  return load().feedback
}

export function getUpdates() {
  return load().updates
}

export function getResponses() {
  return load().responses
}

export function getFlags() {
  return load().flags
}

export function getUsers() {
  return load().users
}

// ================= BACKEND API FUNCTIONS =================

export async function fetchPostsFromBackend() {
  const response = await fetch(`${BASE_URL}/api/posts`)
  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }
  return await response.json()
}

export async function createPostInBackend(post) {
  const response = await fetch(`${BASE_URL}/api/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  })

  if (!response.ok) {
    throw new Error('Failed to create post')
  }

  return await response.json()
}

export async function updatePostInBackend(id, post) {
  const response = await fetch(`${BASE_URL}/api/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  })

  if (!response.ok) {
    throw new Error('Failed to update post')
  }

  return await response.json()
}

export async function deletePostInBackend(id) {
  const response = await fetch(`${BASE_URL}/api/posts/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete post')
  }

  return await response.text()
}