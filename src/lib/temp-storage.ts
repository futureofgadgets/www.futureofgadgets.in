interface TempUser {
  email: string
  password: string
  name: string
  code: string
  expiresAt: Date
}

class TempStorage {
  private storage = new Map<string, TempUser>()

  set(email: string, data: TempUser) {
    this.storage.set(email, data)
  }

  get(email: string): TempUser | undefined {
    return this.storage.get(email)
  }

  delete(email: string) {
    this.storage.delete(email)
  }
}

export const tempStorage = new TempStorage()
