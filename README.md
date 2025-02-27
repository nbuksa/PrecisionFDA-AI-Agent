# PrecisionFDA AI Agent - RAG System Pro Tier

_Last Updated: February 28, 2025_

## Overview

The **precisionfda-ai-agent** is a Retrieval-Augmented Generation (RAG) chatbot designed to assist with FDA cosmetic guidance queries. It utilizes OpenAI’s language model and a document retrieval system to generate accurate, citation-based responses.

This guide provides step-by-step instructions on how to set up and use the application.

---
## Prerequisites and Installation
(*You can skip this if testing with browser-based code editor (See Option 3 in "Running the Application" section)*)

### Prerequisites

Before running the chatbot, ensure you have the following installed:

- **Node.js** (v14 or later) – Required for running the application.
- **npm** (comes with Node.js) – Required to install dependencies.
- **A modern web browser** (Chrome, Firefox, Edge, or Safari).
- **An OpenAI API key** (if replacing the default key).

---

### Installation & Setup

#### Step 1: Download the Files
If you received the code as a compressed (`.zip`) file, extract it to a folder on your computer.

#### Step 2: Install Dependencies
Navigate to the extracted folder and install the necessary dependencies.

Open a terminal or command prompt, then run:

```bash
npm install
```

This will download all required packages.

#### Step 3: Set Up Your API Key and Assistant ID (Optional)
The application includes an OpenAI API key in the frontend code. However, if you want to implement your own model, change the API key and Assistant ID.

- Obtain an API key from OpenAI.
- directly modify the API key inside the JavaScript file handling API requests.
- Replace the existing API key and Assistant ID with your own.

---

## How to implement RAG system and fine-tune the model?

### **1. OpenAI Setup**
To use this application with OpenAI's language model, follow these steps:

#### **Step 1: Get an API Key**
1. Sign up at [OpenAI](https://platform.openai.com/) if you don’t have an account.
2. Navigate to the **API Keys** section.
3. Click **"Create API Key"**, then copy and save it securely.

#### **Step 2: Configure the AI Assistant (Optional)**
If using OpenAI’s **Assistant API**:
1. Go to the **Assistant Playground** on the OpenAI platform.
2. Create a new assistant and customize its behavior with a system prompt.
3. Use a base prompt relevant to your use case (e.g., medical guidance, legal advice, general chatbot, etc.).
4. Save the assistant and retrieve its **Assistant ID** for integration.

### **2. Preparing Knowledge for Retrieval**
If you want your AI model to **retrieve information from documents** instead of just generating text, follow these steps:

#### **Step 1: Collect Your Data**
- Gather relevant documents (PDFs, text files, articles, etc.).
- Ensure the content is **clear and structured** for better AI understanding.

#### **Step 2: Process the Documents**
1. **Split the text** into smaller segments (~500 tokens per chunk) to improve retrieval accuracy.
2. **Generate vector embeddings** for each chunk  and ave the generated embeddings in a vector database like Pinecone.

---

### Running the Application
#### Option 1: Using a Local HTTP Server
If you have Live Server installed in VS Code:

- Open index.html in VS Code.
- Right-click on **server.js**  inside the editor and select "Open with Live Server".
- The chatbot will open in your default browser.

#### Option 2: Opening Directly in a Browser
- Open the folder where you extracted the files.
- Double-click on index.html.
- The chatbot interface should load in your default browser.

#### Option 3: Testing in Monaco Editor (recommended)
The chatbot application can be tested using a browser-based code editor like Monaco Editor. 
- **In this case you don't need to download the code and install prerequisites.**

To test the application:

- Open Monaco Editor.
- Copy and paste the server.js code into the editor.
- Run the code and interact with the chatbot interface.

### How to Use
- Start Chatting: Enter your FDA-related question in the chat input field.
- Receive Answers: The chatbot will process your query and provide a response with citations.
- Copy Responses: You can copy answers using the built-in copy-to-clipboard feature.

---

## Security Note

**IMPORTANT**: Security Warning!
Storing API keys in client-side JavaScript is insecure and exposes your key to the public.
It's highly recommended to move API calls to a secure backend server.
The following function includes the API key directly for demonstration. 

#### How to Secure Your API Key:
- Move API calls to a backend server to prevent key exposure.
- Use environment variables to store the API key securely.

---

### Troubleshooting
**Problem**: The chatbot does not load or shows errors.
**Solution**:
- Ensure you have installed all dependencies with npm install.
- Check if Node.js is installed by running node -v in the terminal.
- Restart the browser and try again.

**Problem**: Responses are incorrect or generic.
**Solution**:
- Verify that the API key is correctly set.
- Ensure that the chatbot has access to relevant FDA documents.

---

### Author
Shakil Ahmed
---
### License
This project is UNLICENSED. You may use and modify it as needed, but redistribution is not permitted.

