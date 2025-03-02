# We Are Geniuses

A platform for Joe Dispenza students to connect based on skills and experiences.

## Features

- User authentication (login/registration)
- Subscription-based access
- User directory for subscribers
- User connections based on skills and experiences
- Profile management

## Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Payments**: Stripe

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- Stripe account for payments

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/we-are-geniuses.git
cd we-are-geniuses
```

2. Install server dependencies:
```
cd server
npm install
```

3. Install client dependencies:
```
cd ../client
npm install
```

4. Set up environment variables:
   - Create a `.env` file in the server directory
   - Add the following variables:
     ```
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     STRIPE_SECRET_KEY=your_stripe_secret_key
     STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
     SUBSCRIPTION_PRICE_ID=your_stripe_price_id
     ```

5. Run the application:
   - Server:
     ```
     cd server
     npm run dev
     ```
   - Client:
     ```
     cd client
     npm start
     ```

## Future Enhancements

- Mobile app version
- Direct messaging between users
- Events and group features
- Content sharing

## License

[MIT](LICENSE) 