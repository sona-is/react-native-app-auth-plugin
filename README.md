# React Native App Auth Expo Plugin

Custom Expo config plugin for [react-native-app-auth](https://github.com/FormidableLabs/react-native-app-auth) with full Swift AppDelegate support.

## Overview

This plugin automatically configures iOS and Android for OAuth authentication when running `expo prebuild`. It replaces `@wavemaker/react-native-app-auth-expo-plugin` with full Swift support for modern Expo SDK versions.

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

The app links this plugin as a local dependency:

```json
// expo-app/package.json
{
  "dependencies": {
    "react-native-app-auth-plugin": "file:plugins/react-native-app-auth-plugin"
  }
}
```

The plugin itself compiles on install via `prepare`:

```json
// plugins/react-native-app-auth-plugin/package.json
{
  "scripts": {
    "build": "tsc -p .",
    "prepare": "npm run build"
  },
  "main": "build/index.js",
  "types": "build/index.d.ts"
}
```

Install dependencies (runs `prepare` and builds the plugin):

```bash
cd expo-app
bun install
```

## Usage

Add the plugin to `app.config.ts` using the package name:

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

Build happens automatically on install via `prepare`. To build manually while iterating:

```bash
cd expo-app/plugins/react-native-app-auth-plugin
bunx tsc -p .
```

### Test via prebuild

Run prebuild to verify the plugin generates correct native code:

```bash
cd expo-app
bun run prebuild:clean
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

- Ensure install ran the plugin’s `prepare` script: re-run `bun install` from `expo-app`.
- As a fallback during development, build manually: `bunx tsc -p plugins/react-native-app-auth-plugin`.

### OAuth not working

Verify the redirect URL in your OAuth configuration matches the scheme:

```ts
redirectUrl: 'your.app.scheme://auth/'
```
