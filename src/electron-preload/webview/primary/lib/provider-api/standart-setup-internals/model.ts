import {AddInitializedProp, DefineObservableValue} from "src/electron-preload/webview/primary/lib/provider-api/model";
import {PROVIDER_REPO_STANDARD_SETUP_WEBPACK_INDEX_ENTRY_ITEMS} from "src/shared/const/proton-apps";

/* eslint-disable max-len */

type Keys = typeof PROVIDER_REPO_STANDARD_SETUP_WEBPACK_INDEX_ENTRY_ITEMS[number];

type LazyKeys = StrictExclude<
    StrictExtract<
        Keys,
        | "../../packages/components/hooks/useApi.ts"
        | "../../packages/components/hooks/useAuthentication.ts"
        | "../../packages/components/hooks/useCache.ts"
        | "../../node_modules/react-router/esm/react-router.js"
    >,
    never
>;

type ImmediateKeys = StrictExclude<Keys, LazyKeys>;

// TODO clone the proton project on npm postinstall hook and reference the modules signatures from their typescript code
export type StandardSetupProviderInternals = AddInitializedProp<
    {
        [K in StrictExtract<ImmediateKeys, "../../packages/components/containers/app/StandardPrivateApp.tsx">]: DefineObservableValue<
            {
                readonly publicScope: {
                    // https://github.com/ProtonMail/react-components/blob/500b9a973ce7347638c11994d809f63299eb5df2/containers/api/ApiProvider.js
                    readonly httpApi: HttpApi;
                    // https://github.com/ProtonMail/react-components/blob/5055a566f574066f5460db847ad393c401f01d96/containers/authentication/Provider.tsx
                    readonly authentication: {readonly hasSession?: () => boolean};
                    // https://github.com/ProtonMail/react-components/blob/500b9a973ce7347638c11994d809f63299eb5df2/containers/cache/Provider.tsx
                    readonly cache: Cache;
                    // @types/react-router/index.d.ts
                    readonly history: ReturnType<typeof import("react-router").useHistory>;
                };
            },
            (arg: unknown) => import("react").ReactNode
        >;
    }
>;

export type StandardSetupPublicScope = Unpacked<
    StandardSetupProviderInternals["../../packages/components/containers/app/StandardPrivateApp.tsx"]["value$"]
>["publicScope"];

export type StandardSetupProviderInternalsLazy = AddInitializedProp<
    & { [K in StrictExtract<LazyKeys, "../../packages/components/hooks/useApi.ts">]: {default: () => StandardSetupPublicScope["httpApi"]} }
    & {
        [K in StrictExtract<LazyKeys, "../../packages/components/hooks/useAuthentication.ts">]: {
            default: () => StandardSetupPublicScope["authentication"];
        };
    }
    & { [K in StrictExtract<LazyKeys, "../../packages/components/hooks/useCache.ts">]: {default: () => StandardSetupPublicScope["cache"]} }
    & {
        [K in StrictExtract<LazyKeys, "../../node_modules/react-router/esm/react-router.js">]: {
            useHistory: () => StandardSetupPublicScope["history"];
        };
    }
>;

export type StandardSetupProviderApi = DeepReadonly<{_custom_: {loggedIn$: import("rxjs").Observable<boolean>}}>;

export type Cache = {readonly get: <T>(key: string) => T | undefined};

export interface HttpApiArg {
    url?: string;
    method?: string;
}

export type HttpApi = <T>(arg: HttpApiArg) => Promise<T>;
