import { ConfigPlugin, withAndroidManifest } from '@expo/config-plugins'

interface PluginOptions {
  redirectScheme: string
}

/**
 * Adds RedirectUriReceiverActivity to AndroidManifest.xml for OAuth redirect handling
 * Based on @wavemaker plugin and official react-native-app-auth documentation
 */
export const withReactNativeAppAuthAndroidManifest: ConfigPlugin<PluginOptions> = (config, options) => {
  return withAndroidManifest(config, config => {
    const { redirectScheme } = options
    const androidManifest = config.modResults

    // Find the main application
    const mainApplication = androidManifest.manifest.application?.[0]
    if (!mainApplication) {
      return config
    }

    if (!mainApplication.activity) {
      mainApplication.activity = []
    }

    // Check if we already have the redirect URI receiver activity
    const existingActivity = mainApplication.activity.find(
      (activity: any) => activity.$?.['android:name'] === 'net.openid.appauth.RedirectUriReceiverActivity',
    )

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
      })
    }

    return config
  })
}
