"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withReactNativeAppAuthAndroidManifest = void 0;
const config_plugins_1 = require("@expo/config-plugins");
/**
 * Adds RedirectUriReceiverActivity to AndroidManifest.xml for OAuth redirect handling
 * Based on @wavemaker plugin and official react-native-app-auth documentation
 */
const withReactNativeAppAuthAndroidManifest = (config, options) => {
    return (0, config_plugins_1.withAndroidManifest)(config, config => {
        const { redirectScheme } = options;
        const androidManifest = config.modResults;
        // Find the main application
        const mainApplication = androidManifest.manifest.application?.[0];
        if (!mainApplication) {
            return config;
        }
        if (!mainApplication.activity) {
            mainApplication.activity = [];
        }
        // Check if we already have the redirect URI receiver activity
        const existingActivity = mainApplication.activity.find((activity) => activity.$?.['android:name'] === 'net.openid.appauth.RedirectUriReceiverActivity');
        if (!existingActivity) {
            // Add the RedirectUriReceiverActivity for AppAuth
            mainApplication.activity.push({
                $: {
                    'android:name': 'net.openid.appauth.RedirectUriReceiverActivity',
                    'android:exported': 'true',
                },
                'intent-filter': [
                    {
                        $: { 'android:autoVerify': 'true' },
                        action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }],
                        category: [
                            { $: { 'android:name': 'android.intent.category.DEFAULT' } },
                            { $: { 'android:name': 'android.intent.category.BROWSABLE' } },
                        ],
                        data: [{ $: { 'android:scheme': 'https', 'android:host': redirectScheme } }],
                    },
                ],
            });
        }
        return config;
    });
};
exports.withReactNativeAppAuthAndroidManifest = withReactNativeAppAuthAndroidManifest;
