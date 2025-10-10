# React Native App Auth Expo Plugin

Custom Expo config plugin for [react-native-app-auth](https://github.com/FormidableLabs/react-native-app-auth) with full Swift AppDelegate support.

## Overview

This plugin automatically configures iOS and Android for OAuth authentication when running `expo prebuild`. It replaces `@wavemaker/react-native-app-auth-expo-plugin` with full Swift support for modern Expo SDK versions.

**Compatible with `react-native-app-auth` ^8.0.3**

## Features

### iOS (Swift)

- Adds `CFBundleURLTypes` to Info.plist for OAuth redirect handling
- Modifies `AppDelegate.swift` to implement `RNAppAuthAuthorizationFlowManager` protocol
- Adds `authorizationFlowManagerDelegate` property
- Implements `application(_:open:options:)` for URL scheme redirects
- Implements `application(_:continue:restorationHandler:)` for universal links
- Creates/modifies bridging header with required Objective-C imports

### Android

- Adds `RedirectUriReceiverActivity` to AndroidManifest.xml
- Adds `manifestPlaceholders` to app/build.gradle

## Installation

First, install `react-native-app-auth` if you haven't already:

```bash
npm install react-native-app-auth@^8.0.3
# or
yarn add react-native-app-auth@^8.0.3
# or
bun add react-native-app-auth@^8.0.3
```

Then install this plugin from the private git repository:

```bash
npm install git+ssh://git@github.com/sona-is/react-native-app-auth-plugin.git
# or
yarn add git+ssh://git@github.com/sona-is/react-native-app-auth-plugin.git
# or
bun add git+ssh://git@github.com/sona-is/react-native-app-auth-plugin.git
```

Alternatively, add it to your `package.json`:

```json
{
  "dependencies": {
    "react-native-app-auth-plugin": "git+ssh://git@github.com/sona-is/react-native-app-auth-plugin.git"
  }
}
```

The plugin ships with pre-built JavaScript files, so no compilation is required during installation.

## Usage

Add the plugin to your Expo config file (`app.config.ts` or `app.config.js`):

```ts
plugins: [
  [
    'react-native-app-auth-plugin',
    {
      redirectScheme: 'your.app.scheme',
    },
  ],
]
```

## Configuration

### Required

- `redirectScheme` (string): The URL scheme for OAuth redirects (e.g., `is.sona.staging`).

### Optional

- `bundleId` (string): Bundle identifier for iOS (defaults to `config.ios.bundleIdentifier`).

## Development

### Build

The plugin ships with pre-built files in the `build/` directory. When making changes to the TypeScript source:

```bash
npm run build
# or
bunx tsc -p .
```

**Important:** Commit the updated `build/` directory after making changes so users get the latest pre-built version.

### Test via prebuild

Run prebuild to verify the plugin generates correct native code:

```bash
npx expo prebuild --clean
```

Verify the following files were modified:

- `ios/<ProjectName>/AppDelegate.swift` – Protocol conformance and OAuth methods
- `ios/<ProjectName>/<ProjectName>-Bridging-Header.h` – Objective-C imports
- `ios/<ProjectName>/Info.plist` – `CFBundleURLTypes`
- `android/app/src/main/AndroidManifest.xml` – `RedirectUriReceiverActivity`
- `android/app/build.gradle` – `manifestPlaceholders`

## Implementation Notes

- Uses `@expo/config-plugins` mods: `withInfoPlist`, `withAppDelegate`, `withXcodeProject`, `withAndroidManifest`, `withAppBuildGradle`.
- Default export is wrapped with `createRunOncePlugin` to prevent double application when composed.
- All modifications are idempotent to safely run multiple times.

## Troubleshooting

### Plugin not found / Cannot find module

- Ensure install ran the plugin’s `prepare` script: re-run your package manager's install command.
- As a fallback during development, build manually: `npm run build` or `bunx tsc -p .`.

### OAuth not working

Verify the redirect URL in your OAuth configuration matches the scheme:

```ts
redirectUrl: 'your.app.scheme://auth/'
```
