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

export interface BaseEyeDropperStorage {
  settings: EyeDropperSettings;
  history: EyeDropperHistoryItem[];
}

export type EyeDropperStorage = BaseStorage<BaseEyeDropperStorage> & {
  update: (newData: Partial<BaseEyeDropperStorage>) => Promise<void>;
};

const storage = createStorage<BaseEyeDropperStorage>(
  'eye-dropper',
  { history: [], settings: { pickOnActivate: true } },
  {
    storageType: StorageType.Local,
  },
);

const eyeDropperStorage: EyeDropperStorage = {
  ...storage,
  update: async (newData) => {
    await storage.set((storageData) => ({ ...storageData, ...newData }));
  },
};

export default eyeDropperStorage;
