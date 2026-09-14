/**
 * 本地账号系统：纯浏览器内实现，数据保存在 localStorage。
 * 密码以「随机盐 + SHA-256 摘要」存储，明文不落盘。
 * 注意：本地账号仅用于本机学习档案隔离，不构成真正的安全认证。
 */

export interface AccountRecord {
  salt: string
  hash: string
  createdAt: string
}

const ACCOUNTS_KEY = 'chfp-accounts'
const SESSION_KEY = 'chfp-session'
export const ACCOUNT_CHANGE_EVENT = 'chfp-account-change'

function readAccounts(): Record<string, AccountRecord> {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '{}') as Record<string, AccountRecord>
  } catch {
    return {}
  }
}

function writeAccounts(accounts: Record<string, AccountRecord>) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

function notify() {
  window.dispatchEvent(new Event(ACCOUNT_CHANGE_EVENT))
}

export function getSession(): string | null {
  return localStorage.getItem(SESSION_KEY)
}

export function listAccounts(): string[] {
  return Object.keys(readAccounts()).sort()
}

export function accountCreatedAt(name: string): string | null {
  return readAccounts()[name]?.createdAt ?? null
}

async function digest(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function validateName(name: string) {
  if (!name || name.length < 2 || name.length > 20) throw new Error('用户名需为 2-20 个字符')
  if (/[:：]/.test(name)) throw new Error('用户名不能包含冒号')
}

function validatePassword(pwd: string) {
  if (!pwd || pwd.length < 4) throw new Error('密码至少 4 位')
}

export async function register(name: string, password: string): Promise<void> {
  const n = name.trim()
  validateName(n)
  validatePassword(password)
  const accounts = readAccounts()
  if (accounts[n]) throw new Error('该用户名已存在，请直接登录')
  const salt = crypto.randomUUID()
  accounts[n] = { salt, hash: await digest(`${salt}:${password}`), createdAt: new Date().toISOString() }
  writeAccounts(accounts)
  localStorage.setItem(SESSION_KEY, n)
  notify()
}

export async function login(name: string, password: string): Promise<void> {
  const n = name.trim()
  const rec = readAccounts()[n]
  if (!rec) throw new Error('账号不存在，请先注册')
  if ((await digest(`${rec.salt}:${password}`)) !== rec.hash) throw new Error('密码不正确')
  localStorage.setItem(SESSION_KEY, n)
  notify()
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
  notify()
}

export async function changePassword(name: string, oldPwd: string, newPwd: string): Promise<void> {
  validatePassword(newPwd)
  const accounts = readAccounts()
  const rec = accounts[name]
  if (!rec) throw new Error('账号不存在')
  if ((await digest(`${rec.salt}:${oldPwd}`)) !== rec.hash) throw new Error('原密码不正确')
  const salt = crypto.randomUUID()
  accounts[name] = { ...rec, salt, hash: await digest(`${salt}:${newPwd}`) }
  writeAccounts(accounts)
}

/** 删除账号及其学习进度（不可恢复） */
export function deleteAccount(name: string) {
  const accounts = readAccounts()
  delete accounts[name]
  writeAccounts(accounts)
  localStorage.removeItem(masteredKeyFor(name))
  if (getSession() === name) {
    localStorage.removeItem(SESSION_KEY)
  }
  notify()
}

/** 每个账号独立的「已掌握」存储键；游客使用默认键（兼容旧数据） */
export function masteredKeyFor(name: string | null): string {
  return name ? `chfp-mastered-v2:${name}` : 'chfp-mastered-v2'
}
