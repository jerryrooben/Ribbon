// Gives the Android project Ribbon's colors (status bar, icon background).
const fs = require('fs');
const path = require('path');
const res = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res', 'values');
if (!fs.existsSync(res)) { console.log('No android/res folder, skipping.'); process.exit(0); }
fs.writeFileSync(path.join(res, 'colors.xml'),
`<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="colorPrimary">#141211</color>
    <color name="colorPrimaryDark">#141211</color>
    <color name="colorAccent">#7D1519</color>
</resources>
`);
fs.writeFileSync(path.join(res, 'ic_launcher_background.xml'),
`<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#7D1519</color>
</resources>
`);
console.log('Android colors patched.');
