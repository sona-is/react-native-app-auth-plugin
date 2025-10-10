import { ConfigPlugin } from '@expo/config-plugins';
interface PluginOptions {
    redirectScheme: string;
}
/**
 * Adds RedirectUriReceiverActivity to AndroidManifest.xml for OAuth redirect handling
 * Based on @wavemaker plugin and official react-native-app-auth documentation
 */
export declare const withReactNativeAppAuthAndroidManifest: ConfigPlugin<PluginOptions>;
export {};
