"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const withInfoPlist_1 = require("./ios/withInfoPlist");
const withSwiftAppDelegate_1 = require("./ios/withSwiftAppDelegate");
const withBridgingHeader_1 = require("./ios/withBridgingHeader");
const withAndroidManifest_1 = require("./android/withAndroidManifest");
const withBuildGradle_1 = require("./android/withBuildGradle");
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
const withReactNativeAppAuth = (config, options) => {
    if (!options?.redirectScheme) {
        throw new Error('react-native-app-auth-plugin: redirectScheme is required');
    }
    return (0, config_plugins_1.withPlugins)(config, [
        [withInfoPlist_1.withReactNativeAppAuthInfoPlist, options],
        withSwiftAppDelegate_1.withReactNativeAppAuthSwiftAppDelegate,
        withBridgingHeader_1.withReactNativeAppAuthBridgingHeader,
        [withAndroidManifest_1.withReactNativeAppAuthAndroidManifest, options],
        [withBuildGradle_1.withReactNativeAppAuthBuildGradle, options],
    ]);
};
exports.default = (0, config_plugins_1.createRunOncePlugin)(withReactNativeAppAuth, 'react-native-app-auth-plugin', '1.0.0');
