import { ConfigPlugin, withInfoPlist } from '@expo/config-plugins';

interface PluginOptions {
  redirectScheme: string;
  bundleId?: string;
}

/**
 * Adds CFBundleURLTypes to Info.plist for OAuth redirect handling
 */
export const withReactNativeAppAuthInfoPlist: ConfigPlugin<PluginOptions> = (config, options) => {
  return withInfoPlist(config, (config) => {
    const { redirectScheme, bundleId } = options;
    const plist = config.modResults;

    // Ensure CFBundleURLTypes exists
    if (!plist.CFBundleURLTypes) {
      plist.CFBundleURLTypes = [];
    }

    // Check if our scheme already exists
    const existingScheme = plist.CFBundleURLTypes.find(
      (urlType: any) =>
        urlType.CFBundleURLSchemes && urlType.CFBundleURLSchemes.includes(redirectScheme)
    );

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
