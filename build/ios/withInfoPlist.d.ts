import { ConfigPlugin } from '@expo/config-plugins';
interface PluginOptions {
    redirectScheme: string;
    bundleId?: string;
}
/**
 * Adds CFBundleURLTypes to Info.plist for OAuth redirect handling
 */
export declare const withReactNativeAppAuthInfoPlist: ConfigPlugin<PluginOptions>;
export {};
