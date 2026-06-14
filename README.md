# WanderLust

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Passport](https://img.shields.io/badge/Passport.js-34E27A?style=flat&logo=passport&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat&logo=cloudinary&logoColor=white)
![Mapbox](https://img.shields.io/badge/Mapbox-000000?style=flat&logo=mapbox&logoColor=white)
![Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?style=flat&logo=render&logoColor=white)

A full-stack property rental web app built as a personal project to go deeper into backend development, auth flows, cloud storage, and deployment. Heavily inspired by Airbnb — users can list properties, upload images, leave reviews, and find listings on an interactive map.

Live demo: [wanderlust-project-1-v2n7.onrender.com](https://wanderlust-project-1-v2n7.onrender.com/listings)

---

## What it does

- Sign up, log in, and manage your own listings
- Create, edit, and delete property listings with image uploads
- Browse all listings on an interactive Mapbox map
- Leave and delete reviews on any listing
- Protected routes — you can only edit/delete what you own
- Flash messages for all user actions
- Works on mobile and desktop

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | Passport.js (Local Strategy) + express-session |
| File Storage | Cloudinary + Multer |
| Maps | Mapbox GL JS + Mapbox SDK (geocoding) |
| Templating | EJS + EJS-Mate |
| Session Store | connect-mongo |
| Validation | Joi |
| Deployment | Render |

---

## Screenshots

> Add screenshots here once deployed

| Listings Page | Listing Detail | Map View |
|---|---|---|
| ![listings](#) | ![detail](#) | ![map](#) |

---

## Folder Structure

```
wanderlust/
├── controllers/
│   ├── listings.js       # listing CRUD logic
│   ├── reviews.js        # review create/delete logic
│   └── user.js           # auth logic
├── models/
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── routes/
│   ├── listings.js
│   ├── reviews.js
│   └── user.js
├── views/
│   ├── listings/
│   ├── users/
│   └── partials/
├── public/               # static assets
├── utils/
│   ├── ExpressError.js
│   └── wrapAsync.js
├── cloudConfig.js        # cloudinary setup
├── middlewares.js        # auth, validation, ownership checks
├── schema.js             # Joi validation schemas
└── app.js                # entry point
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Mapbox account

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/wanderlust.git
cd wanderlust

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
ATLASDB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/wanderlust
SESSION_SECRET=your_session_secret_here
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
MAP_TOKEN=pk.eyJ1your_mapbox_token_here
NODE_ENV=development
```

> Never commit your `.env` file. A `.env.example` is included for reference.

### Run Locally

```bash
npm start
# server runs on http://localhost:8080/listings
```

---

## Deployment

This app is deployed on **Render** as a web service.

Key things to set up on Render:
- Add all environment variables from `.env` in the Render dashboard under **Environment**
- Set `NODE_ENV=production`
- Start command: `node app.js`
- The app uses MongoDB Atlas (cloud), so no local DB setup needed on the server

---

## Known Limitations / Future Improvements

- [ ] Add booking/reservation system with date range selection
- [ ] Search and filter listings by location, price, category
- [ ] User profile page with listing history
- [ ] Pagination on the listings index page
- [ ] Email verification on signup
- [ ] Admin dashboard
- [ ] Migrate to React frontend (currently server-side rendered with EJS)

---

## What I Learned

This project pushed me to deal with things tutorials gloss over — wiring up persistent sessions with MongoDB, handling async errors properly across middleware and controllers, Cloudinary multipart uploads, geocoding API integration, and actually deploying a Node app with environment secrets on a real server.

---

## Author

**Raunak Rawat**


