import { ConfigPlugin } from '@expo/config-plugins';
export interface ReactNativeAppAuthPluginOptions {
    /**
     * The URL scheme for OAuth redirects (e.g., 'is.sona.staging')
     */
    redirectScheme: string;
    /**
     * Optional bundle identifier for iOS
     */
    bundleId?: string;
}
declare const _default: ConfigPlugin<ReactNativeAppAuthPluginOptions>;
export default _default;
