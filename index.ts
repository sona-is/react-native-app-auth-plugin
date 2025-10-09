import { ConfigPlugin, withPlugins, createRunOncePlugin } from '@expo/config-plugins'
import { withReactNativeAppAuthInfoPlist } from './ios/withInfoPlist'
import { withReactNativeAppAuthSwiftAppDelegate } from './ios/withSwiftAppDelegate'
import { withReactNativeAppAuthBridgingHeader } from './ios/withBridgingHeader'
import { withReactNativeAppAuthAndroidManifest } from './android/withAndroidManifest'
import { withReactNativeAppAuthBuildGradle } from './android/withBuildGradle'

export interface ReactNativeAppAuthPluginOptions {
  /**
   * The URL scheme for OAuth redirects (e.g., 'is.sona.staging')
   */
  redirectScheme: string

  /**
   * Optional bundle identifier for iOS
   */
  bundleId?: string
}

/**
 * Expo config plugin for react-native-app-auth
 *
 * Configures both iOS and Android for OAuth authentication:
 *
 * iOS (Swift):
 * - Adds CFBundleURLTypes to Info.plist
 * - Modifies AppDelegate.swift to implement RNAppAuthAuthorizationFlowManager protocol
 * - Creates/modifies bridging header with required imports
 *
 * Android:
 * - Adds RedirectUriReceiverActivity to AndroidManifest.xml
 * - Adds manifestPlaceholders to app/build.gradle
 *
 * Based on official react-native-app-auth documentation:
 * https://nearform.com/open-source/react-native-app-auth/docs/
 */
const withReactNativeAppAuth: ConfigPlugin<ReactNativeAppAuthPluginOptions> = (config, options) => {
  if (!options?.redirectScheme) {
    throw new Error('react-native-app-auth-plugin: redirectScheme is required')
  }

  return withPlugins(config, [
    [withReactNativeAppAuthInfoPlist, options],
    withReactNativeAppAuthSwiftAppDelegate,
    withReactNativeAppAuthBridgingHeader,
    [withReactNativeAppAuthAndroidManifest, options],
    [withReactNativeAppAuthBuildGradle, options],
  ])
}
export default createRunOncePlugin(withReactNativeAppAuth, 'react-native-app-auth-plugin', '1.0.0')
