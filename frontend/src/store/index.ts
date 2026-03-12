import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import createUiSlice from "./slices/ui/store";
import createAgentsSlice from "./slices/agents/store";
import createBuilderSlice from "./slices/builder/store";
import createMarketplaceSlice from "./slices/marketplace/store";

import type { IUiStore } from "./slices/ui/types";
import type { IAgentsStore } from "./slices/agents/types";
import type { IBuilderStore } from "./slices/builder/types";
import type { IMarketplaceStore } from "./slices/marketplace/types";

export type IAppStore = IUiStore & IAgentsStore & IBuilderStore & IMarketplaceStore;

const compare = <T>(a: T, b: T) => a === b || shallow(a, b);

export const useAppStore = createWithEqualityFn<IAppStore>(
  (...args) => ({
    ...createUiSlice(...args),
    ...createAgentsSlice(...args),
    ...createBuilderSlice(...args),
    ...createMarketplaceSlice(...args),
  }),
  compare,
);

export const getAppStore = useAppStore.getState;
export const setAppStore = useAppStore.setState;
