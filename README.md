# We Are Geniuses

A platform for connecting and sharing experiences with Joe Dispenza's teachings.

## Features

- User authentication (login/registration)
- Subscription-based access
- User directory for subscribers
- User connections based on skills and experiences
- Profile management

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project with:
  - Firestore database
  - Authentication enabled
  - Storage bucket
  - Service account key

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Firebase
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_DATABASE_URL=your_firebase_database_url

# Server
PORT=5000
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/we-are-geniuses.git
cd we-are-geniuses
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Start the development servers:
```bash
# Start server (from server directory)
npm run dev

# Start client (from client directory)
npm start
```

## Project Structure

```
we-are-geniuses/
├── client/                 # React frontend
│   ├── public/            # Static files
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom hooks
│   │   ├── context/      # React context
│   │   ├── services/     # API services
│   │   └── utils/        # Utility functions
│   └── package.json
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Future Enhancements

- Mobile app version
- Direct messaging between users
- Events and group features
- Content sharing

[MIT](LICENSE) 