import { ConfigPlugin, withAppBuildGradle } from '@expo/config-plugins'

interface PluginOptions {
  redirectScheme: string
}

/**
 * Adds manifestPlaceholders to app/build.gradle for OAuth redirect scheme
 * Based on @wavemaker plugin and official react-native-app-auth documentation
 */
export const withReactNativeAppAuthBuildGradle: ConfigPlugin<PluginOptions> = (config, options) => {
  return withAppBuildGradle(config, config => {
    const { redirectScheme } = options
    let contents = config.modResults.contents

    // Look for existing manifestPlaceholders
    const manifestPlaceholdersRegex = /manifestPlaceholders\s*=\s*\[([\s\S]*?)\]/
    const defaultConfigRegex = /defaultConfig\s*\{([\s\S]*?)\}/

    if (manifestPlaceholdersRegex.test(contents)) {
      // Update existing manifestPlaceholders
      contents = contents.replace(manifestPlaceholdersRegex, (match, placeholders) => {
        if (!placeholders.includes('appAuthRedirectScheme')) {
          const newPlaceholders = placeholders.trim()
            ? `${placeholders.trim()},\n      appAuthRedirectScheme: '${redirectScheme}'`
            : `appAuthRedirectScheme: '${redirectScheme}'`
          return `manifestPlaceholders = [\n      ${newPlaceholders}\n    ]`
        }
        return match
      })
    } else if (defaultConfigRegex.test(contents)) {
      // Add manifestPlaceholders to existing defaultConfig
      contents = contents.replace(defaultConfigRegex, (match, configContent) => {
        if (!configContent.includes('manifestPlaceholders')) {
          const newConfigContent =
            configContent.trim() +
            `\n    manifestPlaceholders = [\n      appAuthRedirectScheme: '${redirectScheme}'\n    ]\n  `
          return `defaultConfig {\n  ${newConfigContent}}`
        }
        return match
      })
    } else {
      // Add defaultConfig block with manifestPlaceholders
      const androidBlockRegex = /android\s*\{([\s\S]*?)\}/
      contents = contents.replace(androidBlockRegex, (match, androidContent) => {
        const newAndroidContent =
          androidContent.trim() +
          `\n  defaultConfig {\n    manifestPlaceholders = [\n      appAuthRedirectScheme: '${redirectScheme}'\n    ]\n  }\n`
        return `android {\n${newAndroidContent}}`
      })
    }

    config.modResults.contents = contents
    return config
  })
}
