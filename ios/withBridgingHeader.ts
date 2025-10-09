import { ConfigPlugin, withXcodeProject } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Creates or modifies the bridging header for Swift projects to expose react-native-app-auth Objective-C APIs
 */
export const withReactNativeAppAuthBridgingHeader: ConfigPlugin = (config) => {
  return withXcodeProject(config, (config) => {
    const projectRoot = config.modRequest.projectRoot;
    const projectName = config.modRequest.projectName;

    if (!projectName) {
      throw new Error('Project name is required for bridging header configuration');
    }

    const iosPath = path.join(projectRoot, 'ios');
    const bridgingHeaderFileName = `${projectName}-Bridging-Header.h`;
    const bridgingHeaderPath = path.join(iosPath, projectName, bridgingHeaderFileName);

    // Required imports for react-native-app-auth
    const requiredImports = [
      '#import <React/RCTBridgeModule.h>',
      '#import <React/RCTLinkingManager.h>',
      '#import <react-native-app-auth/RNAppAuthAuthorizationFlowManager.h>',
      '#import <react-native-app-auth/RNAppAuthAuthorizationFlowManagerDelegate.h>',
    ];

    let bridgingHeaderContent = '';

    // Check if bridging header exists
    if (fs.existsSync(bridgingHeaderPath)) {
      // Read existing bridging header
      bridgingHeaderContent = fs.readFileSync(bridgingHeaderPath, 'utf8');
    } else {
      // Create new bridging header with standard header comment
      bridgingHeaderContent = `//
//  Use this file to import your target's public headers that you would like to expose to Swift.
//

`;
    }

    // Add missing imports
    let modified = false;
    requiredImports.forEach((importStatement) => {
      if (!bridgingHeaderContent.includes(importStatement)) {
        bridgingHeaderContent += `${importStatement}\n`;
        modified = true;
      }
    });

    // Write bridging header if modified or new
    if (modified || !fs.existsSync(bridgingHeaderPath)) {
      // Ensure directory exists
      const bridgingHeaderDir = path.dirname(bridgingHeaderPath);
      if (!fs.existsSync(bridgingHeaderDir)) {
        fs.mkdirSync(bridgingHeaderDir, { recursive: true });
      }

      fs.writeFileSync(bridgingHeaderPath, bridgingHeaderContent, 'utf8');
    }

    // Set Xcode build setting for bridging header
    const project = config.modResults;
    const bridgingHeaderRelativePath = `${projectName}/${bridgingHeaderFileName}`;

    // Get all build configurations
    const configurations = project.pbxXCBuildConfigurationSection();

    // Set SWIFT_OBJC_BRIDGING_HEADER for all configurations
    Object.keys(configurations).forEach((key) => {
      const configuration = configurations[key];

      // Skip comment entries (they have 'isa' property)
      if (typeof configuration === 'object' && !configuration.isa) {
        // Only set if not already set or empty
        if (!configuration.buildSettings.SWIFT_OBJC_BRIDGING_HEADER) {
          configuration.buildSettings.SWIFT_OBJC_BRIDGING_HEADER = bridgingHeaderRelativePath;
        }
      }
    });

    return config;
  });
};
