<h1 align="center">UICraft</h1>

<p align="center">
  <strong>AI-Powered UI Generation Platform</strong>
</p>

<p align="center">
  Build production-ready React components from natural language prompts.<br/>
  Describe your interface and watch it come to life in real-time.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## Features

- **AI-Powered Code Generation** – Generate complete, production-ready React components from natural language descriptions using Google's Gemini AI.

- **Real-time Preview** – View your generated UI instantly with live preview powered by E2B sandboxed environments.

- **Code Explorer** – Browse, explore, and navigate through all generated files with syntax highlighting.

- **Conversational Interface** – Iterate on your designs through a chat-based interface with full conversation history.

- **Secure Authentication** – User authentication and authorization powered by Clerk.

- **Theme Support** – Dark and light mode support with system preference detection.


---

## Tech Stack

### Frontend

| Technology                                      | Purpose                            |
| ----------------------------------------------- | ---------------------------------- |
| [Next.js 15](https://nextjs.org/)               | React framework with App Router    |
| [React 19](https://react.dev/)                  | UI library                         |
| [Tailwind CSS 4](https://tailwindcss.com/)      | Utility-first CSS framework        |
| [Shadcn UI](https://ui.shadcn.com/)             | Accessible component library       |
| [Framer Motion](https://www.framer.com/motion/) | Animation library                  |
| [TanStack Query](https://tanstack.com/query)    | Data fetching and state management |

### Backend and Infrastructure

| Technology                                | Purpose                                    |
| ----------------------------------------- | ------------------------------------------ |
| [Prisma](https://www.prisma.io/)          | Type-safe ORM for PostgreSQL               |
| [PostgreSQL](https://www.postgresql.org/) | Relational database                        |
| [Inngest](https://www.inngest.com/)       | Background jobs and workflow orchestration |
| [E2B](https://e2b.dev/)                   | Sandboxed code execution environments      |

### AI and Machine Learning

| Technology                                                    | Purpose                                  |
| ------------------------------------------------------------- | ---------------------------------------- |
| [Inngest Agent Kit](https://www.inngest.com/docs/agent-kit)   | AI agent orchestration                   |
| [Google Gemini](https://deepmind.google/technologies/gemini/) | Large language model for code generation |

### Authentication

| Technology                  | Purpose                                    |
| --------------------------- | ------------------------------------------ |
| [Clerk](https://clerk.com/) | User authentication and session management |

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Docker (for PostgreSQL database)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Pranay-Prat/UICraft.git
   cd UICraft
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/uicraft"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # E2B Sandbox
   E2B_API_KEY=your_e2b_api_key

   # Google Gemini AI
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
   ```

4. **Start the database**

   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**

   ```bash
   npx prisma migrate dev
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

7. **Start the Inngest dev server** (in a separate terminal)

   ```bash
   npx inngest-cli@latest dev
   ```

8. **Access the application**

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses PostgreSQL with the following data models:

| Model      | Description                                                |
| ---------- | ---------------------------------------------------------- |
| `User`     | Authenticated users synchronized with Clerk                |
| `Project`  | User-created UI generation projects                        |
| `Message`  | Conversation messages within projects                      |
| `Fragment` | Generated UI components with sandbox URLs and source files |
| `Usage`    | Rate limiting and usage tracking records                   |

---


## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Shadcn](https://ui.shadcn.com/) for the component library
- [Vercel](https://vercel.com) for Next.js
- [Inngest](https://inngest.com) for workflow orchestration
- [E2B](https://e2b.dev) for sandboxed execution environments

---
