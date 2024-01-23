import { BaseStorage, createStorage, StorageType } from './base';

export interface ColorVariant {
  color: string;
  textIsBlack: boolean;
}

export interface Settings {
  showGrid: boolean;
  interactive: boolean;
}

type SettingsStorage = BaseStorage<Settings> & {
  update: (newData: Partial<Settings>) => Promise<void>;
};

const storage = createStorage<Settings>(
  'settings',
  { interactive: true, showGrid: false },
  {
    storageType: StorageType.Local,
  },
);

const settingsStorage: SettingsStorage = {
  ...storage,
  update: async (newData) => {
    await storage.set((storageData) => ({ ...storageData, ...newData }));
  },
};

export default settingsStorage;
