# ♟️ Solstice Shift - AI-Powered Chess Engine

An intelligent chess game powered by AI, built with Next.js and modern web technologies. Play against a sophisticated AI opponent with adaptive difficulty levels.

**🎮 [Play Now](https://solstice-shift.vercel.app)** | **📖 [GitHub](https://github.com/abxdev12/solstice-shift)**

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [How to Play](#-how-to-play)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- 🤖 **AI Chess Engine** - Powered by chess.js with intelligent strategic gameplay
- 🎮 **Interactive Board** - Beautiful, responsive chess interface with Lucide icons
- 📊 **Game Analysis** - Track moves and game statistics in real-time
- ⚙️ **Difficulty Levels** - Adjust AI challenge to your skill level
- 🌐 **Responsive Design** - Play on desktop, tablet, or mobile with Tailwind CSS
- ⚡ **Smooth Animations** - Instant move feedback and fluid interactions with Framer Motion
- 🎨 **Modern UI** - Clean, intuitive interface built with React 19

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | [Next.js](https://nextjs.org/) 16.2.9 |
| **UI Library** | [React](https://react.dev/) 19.2.4 |
| **Chess Logic** | [chess.js](https://www.npmjs.com/package/chess.js) 1.4.0 |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) 5.0.14 |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) 12.40.0 |
| **Icons** | [Lucide React](https://lucide.dev/) 1.21.0 |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) 4 |
| **Linting** | [ESLint](https://eslint.org/) 9 |
| **Language** | JavaScript (98.5%), CSS (1.5%) |
| **Deployment** | [Vercel](https://vercel.com/) |

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ or later
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/abxdev12/solstice-shift.git
cd solstice-shift
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. **Run the development server:**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to start playing.

The application hot-reloads as you edit files, making development seamless.

## 📁 Project Structure

```
solstice-shift/
├── app/                    # Next.js App Router
│   ├── page.js            # Main chess game component
│   ├── layout.js          # Root layout configuration
│   └── globals.css        # Global styles
├── public/                # Static assets (images, icons)
├── components/            # Reusable React components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and helpers
├── styles/                # Component-specific styles
├── package.json           # Project dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── eslint.config.js       # ESLint configuration
```

## 🎮 How to Play

1. **Start Game** - Open the application to begin a new match
2. **Make Moves** - Click on a piece to select it, then click the destination square to move
3. **AI Response** - The AI automatically responds to your moves
4. **Win Conditions** - Achieve checkmate to win or force a stalemate
5. **Adjust Difficulty** - Select your preferred difficulty level from the settings menu
6. **View History** - Review all moves made during the game

### Chess Rules
- Standard chess rules apply (FIDE regulations)
- Castling, en passant, and pawn promotion are supported
- Illegal moves are automatically prevented

## 🔧 Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint to check code quality
npm run lint
```

### Key Dependencies Explained

- **chess.js**: Core chess engine handling rules, move validation, and game state
- **Zustand**: Lightweight state management for game state and user preferences
- **Framer Motion**: Animation library for smooth piece movements and UI transitions
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Icon library for UI components

### Making Changes

- **Game Logic**: Edit `app/page.js` to modify the main chess game interface
- **Styling**: Update Tailwind classes directly in components or edit `tailwind.config.js`
- **State Management**: Manage global state with Zustand stores in the `lib/` directory
- **Components**: Create reusable components in the `components/` directory

## 📦 Deployment

### Deploy on Vercel (Recommended)

The easiest way to deploy is with the **[Vercel Platform](https://vercel.com)**:

1. Push your code to GitHub
2. Connect your repository to Vercel at [vercel.com](https://vercel.com)
3. Vercel automatically detects Next.js and deploys on every push to main

**Live App**: [https://solstice-shift.vercel.app](https://solstice-shift.vercel.app)

### Manual Deployment

For production builds:
```bash
npm run build
npm run start
```

For detailed deployment instructions, see the [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## 🤝 Contributing

Contributions are welcome! Here's how to help:

1. **Fork** the repository
2. **Create** a feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Make** your changes and test thoroughly
4. **Commit** with a clear message:
   ```bash
   git commit -m 'Add AmazingFeature'
   ```
5. **Push** to your branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
6. **Open** a Pull Request with a detailed description

### Development Guidelines

- Follow the existing code style (ESLint rules apply)
- Write meaningful commit messages
- Test your changes locally before submitting a PR
- Update documentation if adding new features

## 📄 License

This project is open source and available under the MIT License. See the LICENSE file for details.

## 📚 Learn More

### Chess & Game Development
- [Chess Rules](https://www.chess.com/terms/chess-rules) - Standard chess rules reference
- [Chess.js Documentation](https://github.com/jhlywa/chess.js) - Engine documentation

### Web Development
- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [React Documentation](https://react.dev) - React 19 documentation
- [Tailwind CSS Docs](https://tailwindcss.com/docs) - Styling framework
- [Learn Next.js](https://nextjs.org/learn) - Interactive tutorial

## 🎯 Roadmap

- [ ] Multiplayer mode (play against friends)
- [ ] ELO rating system
- [ ] Opening book database
- [ ] Move suggestions (hints)
- [ ] Game replay and analysis tools
- [ ] Dark mode support
- [ ] Internationalization (i18n)

## 🐛 Bug Reports & Feature Requests

Found a bug? Have a great idea? Please open an [issue](https://github.com/abxdev12/solstice-shift/issues) on GitHub!

---

**Happy Playing! ♟️**

*Created with ❤️ by [abxdev12](https://github.com/abxdev12)*
