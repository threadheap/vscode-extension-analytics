# [vscode-extension-analytics](https://www.npmjs.com/package/vscode-extension-analytics)
This module provides a consistent way for first-party extensions to report analytics and telemetry
with different analytics providers. The module respects the user's decision about whether or
not to send telemetry data.

This module mostly a fork of [vscode-extension-telemetry](https://github.com/Microsoft/vscode-extension-telemetry)

# install 
`npm install vscode-extension-analytics`

# usage
 ```javascript
 const vscode = require('vscode');
 const {AnalyticsProvider, AnalyticsEvent} = require('vscode-extension-analytics');
 
 // all events will be prefixed with this event name
 const extensionId = '<your extension unique name>';
 
 // extension version will be reported as a property with each event 
 const extensionVersion = '<your extension version>';

// see analytics interface in src/base-client.ts
 const client = new AnalyticsClient();

// telemetry reporter 
 let analyticsProvider;
 
 function activate(context: vscode.ExtensionContext) {
    ...
    // create analytics provider on extension activation
    analyticsProvider = new AnalyticsProvider(extensionId, extensionVersion, client);
    // ensure it gets property disposed
    context.subscriptions.push(analyticsProvider);
    ...
 }

 function deactivate() {
   // This will ensure all pending events get flushed
    analyticsProvider.dispose();
 }

 ...
 // send event any time after activation
 analyticsProvider.sendEvent(new AnalyticsEvent('opened', {attribute: 'value'}));
 
  ```

# common properties
- `common.extname`
- `common.extversion`
- `common.vscodemachineid` 
- `common.vscodesessionid`
- `common.vscodeversion` 
- `common.os`
- `common.platformversion`

# License
[MIT](LICENSE)
