# Multi-Agent-Medical-Chatbot


# Medical Multi-Agent Chatbot

A comprehensive, modular healthcare chatbot system built using **LangGraph**, designed to deliver intelligent, context-aware, and collaborative medical assistance. This project leverages a supervisor-agent architecture, with each agent specializing in a key healthcare domain. The system supports both command-line and web-based interactions, robust state management, and detailed logging for traceability and debugging.

---

## Table of Contents

- [Project Overview](#project-overview)  
- [Project Structure](#project-structure)  
- [Agents Description](#agents-description)  
- [Setup Instructions](#setup-instructions)  
- [Running the Application](#running-the-application)  
  - [Command-Line Interface](#command-line-interface)  
  - [FastAPI Backend](#fastapi-backend)  
  - [Frontend](#frontend)  
- [Environment Variables](#environment-variables)  
- [Logging](#logging)  
- [API Endpoints](#api-endpoints)  
- [Demo](#demo)   

---

## Project Overview

This chatbot system orchestrates multiple specialized AI agents to provide:  
- **Symptom checking and preliminary triage**  
- **Drug research and interaction information**  
- **Crisis detection and escalation**  
- **General healthcare guidance and follow-up**  
- **Centralized supervision and intelligent routing**

The supervisor agent dynamically routes user queries to the most appropriate agent, ensuring responses are accurate, comprehensive, and contextually relevant. All interactions and agent handoffs are logged for transparency and debugging.

---

## Project Structure

```

Multi-Agent-Medical-Chatbot/

├── Agents/
│   ├── __init__.py
│   ├── crisis_agent.py
│   ├── guidance_agent.py
│   ├── research_agent.py
│   ├── supervisor_agent.py
│   └── symptoms_agent.py
├── Graph/
│   ├── __init__.py
│   └── main_graph.py
├── Loggers/
│   ├── __init__.py
│   ├── debugging.log
│   └── logger_config.py
├── State/
│   ├── __init__.py
│   └── state.py
├── medi-stream-chat/
├── .env
├── .gitignore
├── .python-version
├── app.py
├── main.py
├── pyproject.toml
├── README.md
├── test.ipynb
└── uv.lock

```

---

## Agents Description

| Agent              | File                 | Responsibilities                                                        |
|--------------------|----------------------|------------------------------------------------------------------------|
| **Supervisor Agent**| supervisor_agent.py  | Central brain; routes queries, manages workflow, ensures context        |
| **Symptoms Agent**  | symptoms_agent.py    | Analyzes symptoms, provides preliminary triage, asks follow-up questions|
| **Research Agent**  | research_agent.py    | Supplies drug information, research, and interaction checks             |
| **Crisis Agent**    | crisis_agent.py      | Detects emergencies, escalates, provides urgent instructions            |
| **Guidance Agent**  | guidance_agent.py    | Offers aftercare, lifestyle, and general health guidance                |

Agents communicate via the LangGraph workflow defined in \`Graph/main_graph.py\`, with all state and context managed in \`State/state.py\`.

---

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone <your-repo-url>
   cd MEDICAL\ MULTI\ AGENT
   ```

2. Create a virtual environment:

  ```bash
  # Create and activate a virtual environment using uv
  uv venv
  source .venv/bin/activate  # On Windows: .venv\Scripts\activate.bat or .venv\Scripts\Activate.ps1
  ```

---

## Running the Application

### Command-Line Interface

Run the chatbot in CLI mode:

```bash
python main.py
```

- Interact directly with the multi-agent system from your terminal.  
- Ideal for testing, debugging, or headless deployments.

---

### FastAPI Backend

Start the FastAPI server:

```bash
python app.py
```

- Exposes RESTful endpoints for chat, state, and agent routing.  
- Integrates with the frontend and supports external API calls.

---

### Frontend

Launch the web interface:

```bash
cd medi-stream-chat
npm install
npm audit fix          # Optional: fix vulnerabilities
npm run build          # Optional: build for production
npm run dev            # Start the development server (default: http://localhost:3000)
```

- Next.js/React-based UI for user-friendly chat experience.  
- Connects to the FastAPI backend for real-time multi-agent responses.

---

## Environment Variables

Define the following in your \`.env\` file:

```
SERPER_API_KEY = ""
GROQ_API_KEY = ""
MODEL_NAME = "llama-3.3-70b-versatile"
TAVILY_API_KEY = ""
GOOGLE_API_KEY = ""
```

- Required for LLM access and medical data APIs.  

---

## Logging

- All agent interactions, routing decisions, and errors are logged to \`Loggers/debugging.log\`.  
- Logging configuration is managed in \`Loggers/logger_config.py\`.  
- Use logs to trace conversation flows, debug issues, and audit system behavior.

---

## API Endpoints

| Endpoint       | Method | Description                      |
|----------------|--------|---------------------------------|
| \`/chat_stream\`        | POST   | Main chat interface (user messages)  |

- See \`app.py\` for detailed endpoint implementations and usage examples.

---

## Demo

You can upload or link a demo video here to showcase the chatbot in action:

### Demo Video



https://github.com/user-attachments/assets/cc438509-0b32-4903-bfae-bd579d825fe2



---

For support or feature requests, please open an issue in the repository.

---
