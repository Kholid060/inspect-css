import { BaseStorage, createStorage, StorageType } from './base';

export interface ColorVariant {
  color: string;
  textIsBlack: boolean;
}

export interface EyeDropperHistoryItem {
  baseColor: string;
  textIsBlack: boolean;
  darkVariants: ColorVariant[];
  lightVariants: ColorVariant[];
}

export interface EyeDropperSettings {
  pickOnActivate: boolean;
}

export interface EyeDropperStorage {
  settings: EyeDropperSettings;
  history: EyeDropperHistoryItem[];
}

type ThemeStorage = BaseStorage<EyeDropperStorage> & {
  update: (newData: Partial<EyeDropperStorage>) => Promise<void>;
};

const storage = createStorage<EyeDropperStorage>(
  'eye-dropper',
  { history: [], settings: { pickOnActivate: true } },
  {
    storageType: StorageType.Local,
  },
);

const eyeDropperStorage: ThemeStorage = {
  ...storage,
  update: async (newData) => {
    await storage.set((storageData) => ({ ...storageData, ...newData }));
  },
};

export default eyeDropperStorage;
