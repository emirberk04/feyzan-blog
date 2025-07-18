# 🌸 Feyzan Blog - Personal Blog Platform

A beautiful personal blog platform with gallery, authentication, and content management features.

## 🚀 Live Demo
- **Frontend**: [Your Frontend URL]
- **Backend API**: [Your Backend URL]

## 🛠️ Tech Stack

### Frontend
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router DOM
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Cloudinary (Image Storage)
- Multer (File Upload)

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB
- Cloudinary Account

### Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your configuration
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp env.production .env.production
# Edit .env.production with your API URL
npm start
```

## 🌐 Deployment

### Backend Deployment (Render/Railway)
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL`
   - `CLOUDINARY_*` variables

### Frontend Deployment (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set environment variables:
   - `REACT_APP_API_URL`

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=3001
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret
FRONTEND_URL=https://your-frontend.com
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend (.env.production)
```env
REACT_APP_API_URL=https://your-backend.com/api
REACT_APP_ENVIRONMENT=production
```

## 📱 Features

- ✨ Beautiful UI with animations
- 🔐 User authentication
- 📝 Blog post creation and management
- 🖼️ Photo gallery with upload
- 💬 Like and comment system
- 📊 User statistics
- 📱 Responsive design

## 🎨 Screenshots

[Add your screenshots here]

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Emir Alan** - [Your GitHub]

---

Made with ❤️ and lots of ☕ 