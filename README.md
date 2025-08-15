# ClearQ - AI Study Assistant

A luxury minimalistic AI-powered study assistant that helps students solve academic problems with detailed, step-by-step explanations.

## ✨ Features

- **🎯 AI-Powered Solutions**: Upload images of problems and get comprehensive solutions
- **📚 Multi-LLM Support**: Gemini, Claude, and GPT-4 integration
- **🔐 User Authentication**: Secure JWT-based authentication with database storage
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **💎 Luxury UI**: Glassmorphism effects with Poppins typography
- **🎨 Organized Output**: Structured solutions with steps, explanations, and summaries
- **📖 Educational Focus**: Detailed explanations, not just answers

## 🚀 Tech Stack

### Frontend
- **HTML5** - Modern semantic structure
- **CSS3** - Luxury minimalistic design with glassmorphism
- **Vanilla JavaScript** - Clean, efficient client-side logic
- **Poppins Font** - Modern typography

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite** - Database for user data and history
- **JWT** - Secure authentication
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

### AI Integration
- **Google Gemini API** - Primary AI model
- **Anthropic Claude** - Secondary AI option
- **OpenAI GPT** - Additional AI support

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup
1. Clone the repository:
```bash
git clone https://github.com/AdhiNarayan206/TEAM-FALLBACKS.git
cd TEAM-FALLBACKS
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Configure API keys:
   - Add your AI API keys through the web interface
   - Or set them in the API configuration panel

4. Start the backend server:
```bash
node server.js
```

5. Open `index.html` in your browser or serve it with a local server

## 🎨 Design Features

- **Luxury Minimalism**: Clean, professional interface
- **Glassmorphism**: Modern backdrop blur effects
- **Responsive Layout**: Mobile-first design approach
- **Color-Coded Sections**: Visual organization for better UX
- **Professional Typography**: Poppins font family

## 🔧 Configuration

### API Keys
Configure your AI service API keys through:
1. Web interface sidebar panel
2. User authentication system (persistent storage)
3. Local storage (fallback for non-authenticated users)

### Database
- Automatically initializes SQLite database
- Stores user accounts, sessions, API keys, and solution history
- No additional setup required

## 📚 Usage

1. **Upload**: Drag and drop or click to upload problem images
2. **Analyze**: AI analyzes the problem and provides structured solutions
3. **Learn**: Get step-by-step explanations with educational context
4. **Review**: Access your solution history through the sidebar

## 🛡️ Security

- JWT-based authentication
- bcrypt password hashing
- Session management with database persistence
- Secure API key storage per user
- Input validation and sanitization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**AdhiNarayan206** - [GitHub Profile](https://github.com/AdhiNarayan206)

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- Express.js community for the robust framework
- Contributors and testers who helped improve the application

---

**ClearQ** - Making learning clear, one solution at a time! ✨
