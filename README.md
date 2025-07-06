# Vue.js Hotel Booking Application

This project is a modern, responsive web application built to simulate a hotel room booking flow. It was developed to meet the requirements of a technical skills assessment, focusing on frontend best practices, custom CSS implementation, and business logic handling without a CSS framework.

**Note:** This project was converted from an existing profile management application to a hotel booking application.

## Features

* **User Authentication**: Secure login and registration pages.
* **Hotel Booking Flow**:
  * **Room Search**: A homepage to search for rooms based on dates and number of guests.
  * **Room Selection**: A results page to view and sort available rooms.
  * **Contact Information**: A form to enter guest details before finalizing the booking.
  * **Confirmation**: A final summary page confirming the booking with a unique reference number.
* **User Dashboard**: A private, authenticated area where users can:
  * View their upcoming and past bookings.
  * Cancel any upcoming bookings.
* **Responsive Design**: The application is designed to be fully responsive and provide an optimal user experience on desktop, tablet, and mobile devices.
* **Custom Styling**: All styling is done with custom CSS to demonstrate proficiency without relying on a component or CSS framework.

## Technology Stack

This project was built using a modern web development stack:

* **Framework**: [Vue.js](https://vuejs.org/) (v3 with Composition API)
* **Build Tool**: [Vite](https://vitejs.dev/)
* **Routing**: [Vue Router](https://router.vuejs.org/)
* **Form Validation**: [VeeValidate](https://vee-validate.logaretm.com/v4/) & [Yup](https://github.com/jquense/yup)
* **Deployment**: [GitHub Pages](https://pages.github.com/)

## Project Setup

To run this project on your local machine, follow these steps:

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd <repository-folder>
```

### 2. Install dependencies

This will install all the necessary packages for the project.

```bash
npm install
```

### 3. Run the development server

This command will start the Vite development server, typically on `http://localhost:5173/`.

```bash
npm run dev
```

### 4. Build for production

To create a production-ready build of the application in the `dist` folder.

```bash
npm run build
```

### 5. Deploy to GitHub Pages

To deploy the application, run the custom `deploy` script. This will build the project and push the `dist` folder to the `gh-pages` branch of your repository. Make sure your `vite.config.js` has the correct `base` path for your repository.

```bash
npm run deploy
```

## Test Credentials

You can use the following credentials to log in and test the dashboard functionality:

* **User ID:** `testuser`
* **Password:** `password`

## Project Structure

The source code is organized into the following main directories:

* `/src/assets`: Contains the global `main.css` stylesheet.
* `/src/components`: Contains small, reusable components (e.g., `BookingSummaryCard.vue`, `GuestDetailsCard.vue`).
* `/src/layouts`: Contains layout components that provide a common structure for pages (e.g., `BookingProcessLayout.vue`).
* `/src/router`: Contains the Vue Router configuration and navigation guards.
* `/src/services`: Contains the mock `api.js` service for simulating backend data.
* `/src/views`: Contains the main page components of the application (e.g., `RoomSearch.vue`, `Dashboard.vue`).
