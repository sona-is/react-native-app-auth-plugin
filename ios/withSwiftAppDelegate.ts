import { ConfigPlugin, withAppDelegate } from '@expo/config-plugins';

/**
 * Modifies Swift AppDelegate to support react-native-app-auth
 * Based on official documentation: https://nearform.com/open-source/react-native-app-auth/docs/#ios-setup
 */
export const withReactNativeAppAuthSwiftAppDelegate: ConfigPlugin = (config) => {
  return withAppDelegate(config, (config) => {
    if (config.modResults.language !== 'swift') {
      // Only modify Swift AppDelegate files
      return config;
    }

    let contents = config.modResults.contents;

    // 1. Add protocol conformance to class declaration
    if (!contents.includes('RNAppAuthAuthorizationFlowManager')) {
      // Find class declaration and add protocol
      const classRegex = /(public class AppDelegate:\s*\w+)/;
      if (classRegex.test(contents)) {
        contents = contents.replace(classRegex, '$1, RNAppAuthAuthorizationFlowManager');
      }
    }

    // 2. Add authorizationFlowManagerDelegate property
    if (!contents.includes('authorizationFlowManagerDelegate')) {
      // Find the class declaration and add property after it
      const classRegex = /(public class AppDelegate:[^{]+\{)/;
      if (classRegex.test(contents)) {
        contents = contents.replace(
          classRegex,
          '$1\n  public weak var authorizationFlowManagerDelegate: RNAppAuthAuthorizationFlowManagerDelegate?\n'
        );
      }
    }

    // 3. Modify or add application(_:open:options:) method
    if (!contents.includes('resumeExternalUserAgentFlow')) {
      const openURLRegex = /(public override func application\(\s*_ app: UIApplication,\s*open url: URL,\s*options: \[UIApplication\.OpenURLOptionsKey:\s*Any\][^)]*\) -> Bool \{)/;

      if (openURLRegex.test(contents)) {
        // Method exists, inject AppAuth check at the beginning
        contents = contents.replace(
          openURLRegex,
          `$1
    if let delegate = authorizationFlowManagerDelegate,
       delegate.resumeExternalUserAgentFlow(with: url) {
      return true
    }
`
        );
      } else {
        // Method doesn't exist, create it before the end of AppDelegate class
        // Find the AppDelegate class closing brace (before any nested classes)
        const appDelegateMatch = contents.match(/(public class AppDelegate[^{]*\{[\s\S]*?)(\n\}[\s\S]*?class\s)/);
        if (appDelegateMatch) {
          const newMethod = `
  // Linking API - OAuth redirect handling
  public override func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {
    if let delegate = authorizationFlowManagerDelegate,
       delegate.resumeExternalUserAgentFlow(with: url) {
      return true
    }
    return super.application(app, open: url, options: options) || RCTLinkingManager.application(app, open: url, options: options)
  }
`;
          contents = contents.replace(
            appDelegateMatch[0],
            appDelegateMatch[1] + newMethod + appDelegateMatch[2]
          );
        }
      }
    }

    // 4. Modify application(_:continue:restorationHandler:) for universal links
    // Only inject if the method doesn't already have the AppAuth check
    if (!contents.includes('resumeExternalUserAgentFlow(with: userActivity.webpageURL)')) {
      const continueUserActivityRegex = /(\/\/ Universal Links\s*\n\s*public override func application\(\s*_ application: UIApplication,\s*continue userActivity: NSUserActivity,\s*restorationHandler:[^)]*\) -> Bool \{)/;

      if (continueUserActivityRegex.test(contents)) {
        // Method with "Universal Links" comment exists, inject AppAuth check
        contents = contents.replace(
          continueUserActivityRegex,
          `$1
    if userActivity.activityType == NSUserActivityTypeBrowsingWeb,
       let delegate = authorizationFlowManagerDelegate,
       delegate.resumeExternalUserAgentFlow(with: userActivity.webpageURL) {
      return true
    }
`
        );
      }
    }

    config.modResults.contents = contents;
    return config;
  });
};
