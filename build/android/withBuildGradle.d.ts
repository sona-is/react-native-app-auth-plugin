import { ConfigPlugin } from '@expo/config-plugins';
interface PluginOptions {
    redirectScheme: string;
}
/**
 * Adds manifestPlaceholders to app/build.gradle for OAuth redirect scheme
 * Based on @wavemaker plugin and official react-native-app-auth documentation
 */
export declare const withReactNativeAppAuthBuildGradle: ConfigPlugin<PluginOptions>;
export {};
