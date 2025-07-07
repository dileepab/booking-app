# Vue.js & Firebase Hotel Booking Application

This project is a modern, responsive web application built to simulate a hotel room booking flow. It was developed to meet the requirements of a technical skills assessment, focusing on frontend best practices, custom CSS, and integration with a real backend service.

The application is built with Vue.js and uses Google Firebase for user authentication (Authentication) and data persistence (Firestore Database).

## Features

* **Firebase Authentication**: Secure user registration and login using email and password.
* **Firestore Database**: All room and booking data is stored and retrieved from a persistent cloud database.
* **Full Booking Flow**: A complete, multi-step process for users to book a room:
    * **Room Search**: Search for rooms based on dates and number of guests.
    * **Room Selection**: View and sort available rooms.
    * **Contact Information**: Enter guest details to proceed with the booking.
    * **Confirmation**: A final summary page confirming the booking with a unique reference number.
* **User Dashboard**: A private, authenticated area where users can:
    * View their upcoming and past bookings.
    * Cancel any upcoming bookings.
* **Data Persistence**: A user's contact details are automatically saved to their profile after their first booking and are pre-filled for subsequent bookings.
* **Responsive Design**: The application is designed to be fully responsive and provide an optimal user experience on all devices.
* **Custom Styling**: All styling is done with custom CSS to demonstrate proficiency without relying on a component or CSS framework.

## Technology Stack

* **Framework**: [Vue.js](https://vuejs.org/) (v3 with Composition API)
* **Build Tool**: [Vite](https://vitejs.dev/)
* **Routing**: [Vue Router](https://router.vuejs.org/)
* **Form Validation**: [VeeValidate](https://vee-validate.logaretm.com/v4/) & [Yup](https://github.com/jquense/yup)
* **Backend**: [Google Firebase](https://firebase.google.com/) (Authentication & Firestore)
* **Deployment**: [Firebase Hosting](https://firebase.google.com/docs/hosting)

## Project Setup

To run this project on your local machine, you must first set up a Firebase project.

### 1. Firebase Setup

1.  **Create a Firebase Project**: Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  **Register a Web App**: In your project's settings, register a new web app and copy the `firebaseConfig` object.
3.  **Add Config to Project**: Paste the copied `firebaseConfig` object into the `src/firebaseConfig.js` file.
4.  **Enable Authentication**: In the Firebase console, go to **Authentication > Sign-in method** and enable the **Email/Password** provider.
5.  **Set Up Firestore**: Go to **Firestore Database**, create a new database, and update the **Rules**.

### 2. Populating the Database

Before running the app, you need to populate your Firestore database with the initial room data.

1.  **Get Admin Credentials**: Go to your Firebase project settings, navigate to the "Service accounts" tab, and generate a new private key. Save this file as `serviceAccountKey.json` inside the `/scripts` folder. **Important:** This file grants full admin access to your project. It is already listed in `.gitignore` to prevent it from being committed to your repository.

2.  **Install Admin SDK**: The upload script requires the Firebase Admin SDK. Install it by running:
    ```bash
    npm install firebase-admin --save-dev
    ```

3.  **Run the Upload Script**: Execute the script to upload the room data from `/scripts/rooms.json` to your Firestore database:
    ```bash
    node scripts/uploadData.js
    ```
    You should see a success message for each room uploaded.

### 3. Local Development

After setting up Firebase and populating the database, you can run the application locally.

1.  **Clone the repository**:
    ```bash
    git clone <your-repository-url>
    cd <repository-folder>
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run the development server**:
    ```bash
    npm run dev
    ```

## Deployment to Firebase Hosting

To deploy the application, you will need to install the Firebase Command Line Interface (CLI).

1.  **Install Firebase CLI**:
    ```bash
    npm install -g firebase-tools
    ```
2.  **Login to Firebase**:
    ```bash
    firebase login
    ```
3.  **Initialize Firebase in your project**:
    ```bash
    firebase init
    ```
    * Select **"Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys"**.
    * Select the Firebase project you created earlier.
    * When asked for your public directory, enter `dist`.
    * When asked to configure as a single-page app, answer `Yes`.
    * Decline the option to set up automatic builds with GitHub.

4.  **Deploy the application**:
    ```bash
    npm run deploy
    ```
    This command will first build your Vue application and then deploy the contents of the `dist` folder to Firebase Hosting.

## Test Credentials

Since the application uses Firebase Authentication, you can register with any valid email address and password to test the authenticated features like the dashboard and booking process.

## Project Structure

* `/scripts`: Contains the Node.js script for uploading initial room data to Firestore.
* `/src/assets`: Contains global stylesheets.
* `/src/components`: Contains small, reusable components.
* `/src/layouts`: Contains layout components that provide a common structure.
* `/src/router`: Contains the Vue Router configuration and navigation guards.
* `/src/services`: Contains the `api.js` service that communicates with Firebase.
* `/src/views`: Contains the main page components of the application.
