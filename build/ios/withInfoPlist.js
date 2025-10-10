"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withReactNativeAppAuthInfoPlist = void 0;
const config_plugins_1 = require("@expo/config-plugins");
/**
 * Adds CFBundleURLTypes to Info.plist for OAuth redirect handling
 */
const withReactNativeAppAuthInfoPlist = (config, options) => {
    return (0, config_plugins_1.withInfoPlist)(config, (config) => {
        const { redirectScheme, bundleId } = options;
        const plist = config.modResults;
        // Ensure CFBundleURLTypes exists
        if (!plist.CFBundleURLTypes) {
            plist.CFBundleURLTypes = [];
        }
        // Check if our scheme already exists
        const existingScheme = plist.CFBundleURLTypes.find((urlType) => urlType.CFBundleURLSchemes && urlType.CFBundleURLSchemes.includes(redirectScheme));
        if (!existingScheme) {
            // Add the redirect scheme
            plist.CFBundleURLTypes.push({
                CFBundleURLName: bundleId || config.ios?.bundleIdentifier || 'oauth',
                CFBundleURLSchemes: [redirectScheme],
            });
        }
        return config;
    });
};
exports.withReactNativeAppAuthInfoPlist = withReactNativeAppAuthInfoPlist;
