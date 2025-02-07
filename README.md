# Proactively

## Setup Instructions

1. Firebase Configuration
   - Copy the example configuration files:
     ```bash
     cp google-services.example.json google-services.json
     cp firebase-adminsdk.example.json firebase-adminsdk.json
     cp .env.example .env
     ```
   - Get your Firebase configuration from the Firebase Console
   - Update the configuration files with your actual values

2. Environment Variables
   - Create a `.env` file based on `.env.example`
   - Add your Firebase configuration values

3. Firebase Admin SDK
   - Generate a new service account key from Firebase Console
   - Save it as `firebase-adminsdk.json`

Note: Never commit files containing actual credentials to version control. 