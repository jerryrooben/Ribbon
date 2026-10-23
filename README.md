# Ribbon: get the Android app (APK)

GitHub builds the APK for you, for free. You do not need Android Studio.

1. Make a free account at github.com and sign in.
2. Tap the + at the top, then "New repository". Name it ribbon. Choose Private. Tap "Create repository".
3. On the new repository page, tap "uploading an existing file".
4. Unzip this folder on your computer. Drag everything inside it into the upload page.
   It must include the hidden folder named .github. If that folder does not upload:
   tap "Add file" > "Create new file", type  .github/workflows/build-apk.yml  as the name,
   paste the contents of that file from this folder, and commit.
5. Tap "Commit changes".
6. Open the "Actions" tab. A run called "Build Android APK" starts by itself. Wait about 5 to 8 minutes for the green tick.
   If you see a red cross, open the run and send me the error text.
7. Open the "Releases" section on the right side of the repository page, open "Ribbon APK 1" and tap Ribbon.apk to download it on your phone.
8. Open the downloaded file. Android will ask you to allow installs from this source. Allow it, then install.
   Play Protect may show a warning because the app is not from the Play Store. Tap "Install anyway".

To update the app later, change a file in the repository and commit. A new APK appears under Releases.
