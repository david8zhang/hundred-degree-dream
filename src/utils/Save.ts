export enum SaveKeys {
  CURR_EXP = 'CURR_EXP',
  CURR_LEVEL = 'CURR_LEVEL',
  CURR_PARTY = 'CURR_PARTY',
  ACTIVE_ALLY = 'ACTIVE_ALLY',
  FEVER_DEGREES = 'FEVER_DEGREES',
}

export class Save {
  private static LOCAL_STORAGE_KEY = 'super-jambo-hdd'
  private static saveObj: {
    [key in SaveKeys]?: any
  }
  private static _instance: Save

  constructor() {
    const rawSaveObj = localStorage.getItem(Save.LOCAL_STORAGE_KEY)
    if (!rawSaveObj) {
      Save.saveObj = {}
      localStorage.setItem(Save.LOCAL_STORAGE_KEY, JSON.stringify(Save.saveObj))
    } else {
      Save.saveObj = JSON.parse(rawSaveObj)
    }
    Save._instance = this
  }

  public static get instance() {
    return Save._instance
  }

  public static clearSave() {
    localStorage.clear()
  }

  public static getData(key: SaveKeys, defaultIfNotFound?: any) {
    if (this.saveObj[key] == undefined) {
      return defaultIfNotFound
    }
    return this.saveObj[key]
  }

  public static setData(key: SaveKeys, data: any) {
    this.saveObj[key] = data
    localStorage.setItem(Save.LOCAL_STORAGE_KEY, JSON.stringify(this.saveObj))
  }
}
