// PrecisionFDA AI Agent - RAG System Pro Tier
// Last updated - Feb 27, 2025

// -------------------------
// External Resource Loading
// -------------------------

// Function to load external resources (fonts or scripts)
// If type is 'font', creates a <link> tag; otherwise, a <script> tag.
const loadExternalResource = (type, url) => {
  const link = document.createElement(type === 'font' ? 'link' : 'script');
  if (type === 'font') {
    link.rel = 'stylesheet';
    link.href = url;
  } else {
    link.src = url;
  }
  document.head.appendChild(link);
 };
 
 // Load Google Font "Proxima Nova"
 const loadGoogleFont = () =>
  loadExternalResource(
    'font',
    'https://fonts.googleapis.com/css2?family=Proxima+Nova:wght@400;700&display=swap'
  );
 
 // Load Font Awesome icons
 const loadFontAwesome = () =>
  loadExternalResource(
    'font',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
  );
 
 // -------------------------
 // Define Color Scheme
 // -------------------------
 const COLORS = {
  primary: '#1B74BB',
  secondary: '#FFFFFF',
  accent: '#5DA9E9',
  error: '#F25F5C',
  linkYesBg: '#E5F2FB',
  linkYesColor: '#1B74BB',
  linkNoBg: '#FBE5E6',
  linkNoColor: '#F25F5C',
 };
 
 // ------------------------------------
 // Reference Lookup Dictionary
 // ------------------------------------
 // Maps reference markers (e.g., "4:8") to descriptive text for clarity
 const referenceDetailsMap = {
  "4:8":  "Page 12, Section 4.8",
  "4:14": "Page 18, Section 2",
  "4:19": "Page 20, Appendix B",
  "4:4":  "Page 7, Section 1.3",
  "4:7":  "Page 10, Section 2.1",
  "4:13": "Page 16, Section 3.3",
  "4:20": "Page 22, Nanomaterials Guidance",
  "4:21": "Page 24, GMP Guidelines",
  "4:5":  "Page 8, Contact Details"
 };
 
 // Global array to store unique references that appear in the text
 let collectedReferences = [];
 
 // -----------------------------------------------------
 // Function: getReferenceDetails()
 // Purpose: Build a minimal HTML reference list displayed in the Explain section
 // -----------------------------------------------------
 const getReferenceDetails = () => {
  if (!collectedReferences.length) {
    return '<em>No references found.</em>';
  }
  let explanationHTML = '<strong>References</strong><br>';
  // Append each reference with its index number
  collectedReferences.forEach((ref, i) => {
    explanationHTML += `[${i + 1}] ${ref}<br>`;
  });
  // Append a link to the full FDA Guidance PDF
  explanationHTML += `
    <br>
    <a href="https://drive.google.com/file/d/1OGt3QP7K94-P6sJFO61NodgHknDiHsXa/edit"
       target="_blank"
       style="text-decoration: none; color: ${COLORS.primary};">
       View FDA Guidance (PDF)
    </a>
  `;
  return explanationHTML;
 };
 
 // -----------------------------------------------------
 // Function: createElement()
 // Purpose: Utility function to create a DOM element with styles, innerHTML, and attributes
 // -----------------------------------------------------
 const createElement = (type, styles, innerHTML = '', attributes = {}) => {
  const element = document.createElement(type);
  element.style.cssText = styles;
  element.innerHTML = innerHTML;
  Object.keys(attributes).forEach((key) =>
    element.setAttribute(key, attributes[key])
  );
  return element;
 };
 
 // -------------------------------------------
 // Function: unifyConsecutiveReferences()
 // Purpose: Merge multiple adjacent reference markers into a single superscript block.
 // For example, converts "【4:8†source】【4:14†source】" into "<sup>[1,2]</sup>"
 // -------------------------------------------
 const unifyConsecutiveReferences = (text) => {
  return text.replace(/(?:【[^†]+†source】)+/g, (fullMatch) => {
    // Use a regex to capture each reference code within the full match
    const refRegex = /【([^†]+)†source】/g;
    let subMatch;
    const refIndices = [];
 
    while ((subMatch = refRegex.exec(fullMatch)) !== null) {
      const refCode = subMatch[1];
      // Lookup detailed text for the reference code
      const detail = referenceDetailsMap[refCode] || "FDA Guidance";
      // If the reference detail hasn't been added yet, push it into the collectedReferences array
      if (!collectedReferences.includes(detail)) {
        collectedReferences.push(detail);
      }
      // Calculate the reference index (1-indexed)
      const index = collectedReferences.indexOf(detail) + 1;
      if (!refIndices.includes(index)) {
        refIndices.push(index);
      }
    }
    // Sort indices in ascending order for consistency (e.g., [1,2] instead of [2,1])
    refIndices.sort((a, b) => a - b);
    // Return a single superscript block with the indices inside
    if (refIndices.length === 1) {
      return `<sup>[${refIndices[0]}]</sup>`;
    } else {
      return `<sup>[${refIndices.join(',')}]</sup>`;
    }
  });
 };
 
 // -------------------------------------------
 // Function: linkReferences()
 // Purpose: Convert textual references (like "See - Page X") into clickable links that open the FDA Guidance PDF.
 // -------------------------------------------
 const linkReferences = (text) => {
  return text.replace(
    /((?:Refer to|See|For)[^-]+ - Page \d+(?:,\s*Section [^)\n]+)?)/gi,
    `<a href="https://drive.google.com/file/d/1OGt3QP7K94-P6sJFO61NodgHknDiHsXa/edit"
        target="_blank"
        style="text-decoration: none; color: ${COLORS.primary};">
      $1
    </a>`
  );
 };
 
 // -------------------------------------------
 // Function: createExplanationSection()
 // Purpose: Create a collapsible explanation section to display reference details.
 // -------------------------------------------
 const createExplanationSection = (explanationText) => {
  const explanationSection = createElement(
    'div',
    `
      font-size: 0.9em;
      color: #555;
      margin-top: 5px;
      padding: 8px;
      background-color: #f9f9f9;
      border-left: 3px solid ${COLORS.accent};
      display: none;
      font-family: 'Proxima Nova', Helvetica, Arial, sans-serif;
    `,
    explanationText
  );
  return explanationSection;
 };
 
 // -------------------------------------------
 // Function: createButton()
 // Purpose: Create the main chat bubble button that toggles the chat widget.
 // -------------------------------------------
 const createButton = () =>
  createElement(
    'button',
    `
      width: 70px;
      height: 70px;
      background-color: ${COLORS.primary};
      border-radius: 35px;
      position: fixed;
      bottom: 30px;
      right: 20px;
      color: ${COLORS.secondary};
      text-align: center;
      box-shadow: 0px 10px 15px rgba(0,0,0,0.2);
      border: none;
      outline: none;
      padding: 0;
      margin: 0;
      z-index: 1000;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.3s ease;
      font-family: 'Proxima Nova', sans-serif;
    `,
    `
      <img
        src="https://precision.fda.gov/assets/presskit/pfda.favicon.white.688x688.png"
        alt="PrecisionFDA Logo"
        style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;"
      >
    `,
    { draggable: true }
  );
 
 // -------------------------------------------
 // Functions to create clear and expand buttons for the chat header
 // -------------------------------------------
 const createClearButton = () =>
  createElement(
    'button',
    `
      background-color: transparent;
      border: none;
      color: ${COLORS.secondary};
      font-size: 18px;
      cursor: pointer;
    `,
    '<i class="fa-solid fa-rotate-right"></i>'
  );
 
 const createExpandButton = () =>
  createElement(
    'button',
    `
      background-color: transparent;
      border: none;
      color: ${COLORS.secondary};
      font-size: 18px;
      cursor: pointer;
    `,
    '<i class="fa fa-expand"></i>'
  );
 
 // -----------------------------------------------------
 // Function: createMessage()
 // Purpose: Constructs a chat message (for both user and chatbot) including metadata (name, timestamp),
 //          the message content, a copy-to-clipboard icon, and an optional "Explain" button for FDA-related messages.
 // -----------------------------------------------------
 const createMessage = (content, sender, isError = false) => {
  // Container for the complete message line
  const messageLine = createElement(
    'div',
    'margin-bottom: 15px; position: relative;'
  );
 
  // Create a header line with sender name and timestamp
  const userLine = createElement('div', 'display: flex; align-items: center;');
  const userNameElem = createElement(
    'span',
    `font-weight: bold; margin-right: 5px; color: ${
      sender === 'user' ? '#333' : COLORS.primary
    }; font-size: 1.05em;`,
    sender === 'user' ? getUsername() : 'PrecisionFDA'
  );
  const timestamp = createElement(
    'span',
    'font-size: 0.9em; color: #888; margin-right: 10px;',
    getTimeString()
  );
  userLine.appendChild(userNameElem);
  userLine.appendChild(timestamp);
 
  // Container for the actual message content
  const userMessageLine = createElement(
    'div',
    `
      font-size: 1.05em;
      margin-left: 15px;
      font-family: 'Proxima Nova', Helvetica, Arial, sans-serif;
      position: relative;
      padding-right: 40px;
    `
  );
 
  // Create the message paragraph and add error styling if needed
  const message = createElement(
    'p',
    `
      margin: 0;
      padding-bottom: 10px;
      line-height: 1.5;
      white-space: pre-wrap;
      ${isError ? 'color: red;' : ''}
    `,
    content
  );
 
  // Create a copy-to-clipboard icon (hidden by default)
  const copyIcon = createElement(
    'i',
    `
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      font-size: 16px;
      color: gray;
      cursor: pointer;
      display: none;
      z-index: 10;
    `,
    '',
    { class: 'fa fa-copy', title: 'Copy to clipboard' }
  );
 
  // Show the copy icon on mouse enter and hide on mouse leave
  userMessageLine.onmouseenter = () => {
    copyIcon.style.display = 'block';
  };
  userMessageLine.onmouseleave = () => {
    copyIcon.style.display = 'none';
  };
 
  // -------------------------------------------
  // Copy-to-clipboard logic when the icon is clicked
  // -------------------------------------------
  copyIcon.onclick = () => {
    const textToCopy = message.textContent.trim();
    // Create a temporary splash message to confirm copy action
    const splashMessage = createElement(
      'div',
      `
        position: fixed;
        background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent});
        color: ${COLORS.secondary};
        font-size: 1em;
        padding: 12px 20px;
        border-radius: 20px;
        box-shadow: 0px 5px 15px rgba(0,0,0,0.2);
        font-family: 'Proxima Nova', sans-serif;
        font-weight: bold;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        display: flex;
        align-items: center;
      `,
      '<i class="fa fa-check-circle" style="margin-right: 8px;"></i> Text copied!'
    );
 
    // Position the splash message relative to the chat bubble button if possible
    const chatBubble = document.querySelector('button');
    if (chatBubble) {
      const chatBubbleRect = chatBubble.getBoundingClientRect();
      let leftPosition = chatBubbleRect.left - 190;
      if (leftPosition < 10) leftPosition = 10;
      let topPosition = chatBubbleRect.top + chatBubbleRect.height / 2 + 12;
      if (topPosition + 50 > window.innerHeight) {
        topPosition = window.innerHeight - 60;
      }
      splashMessage.style.left = `${leftPosition}px`;
      splashMessage.style.top = `${topPosition}px`;
      splashMessage.style.transform = 'translateY(0)';
    } else {
      splashMessage.style.left = '20px';
      splashMessage.style.bottom = '50px';
    }
    document.body.appendChild(splashMessage);
    setTimeout(() => {
      splashMessage.style.opacity = '1';
      splashMessage.style.transform = splashMessage.style.transform.replace(
        'translateY(0)',
        'translateY(0) scale(1)'
      );
    }, 10);
    setTimeout(() => {
      splashMessage.style.opacity = '0';
      splashMessage.style.transform = splashMessage.style.transform.replace(
        'scale(1)',
        'scale(0.9)'
      );
      setTimeout(() => splashMessage.remove(), 300);
    }, 2500);
 
    // Use Clipboard API with a fallback for older browsers
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => console.log('Text copied successfully!'))
      .catch((err) => {
        console.warn('Clipboard API failed, falling back:', err);
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          console.log('Fallback: Text copied successfully!');
        } catch (error) {
          console.error('Fallback failed:', error);
        }
        document.body.removeChild(textArea);
      });
  };
 
  // Append the message content and copy icon to the message container
  userMessageLine.appendChild(message);
  userMessageLine.appendChild(copyIcon);
 
  // If the message is from the chatbot and relates to FDA/guidance topics,
  // add an "Explain" button to reveal reference details.
  if (
    sender === 'chatbot' &&
    /FDA|Guidance|Registration|Listing|Cosmetic|Numeric Codes|Product Testing|Labeling Requirements/i.test(
      content
    )
  ) {
    const explainButton = createElement(
      'button',
      `
        background-color: transparent;
        border: none;
        color: ${COLORS.accent};
        font-size: 0.9em;
        cursor: pointer;
        margin-top: 5px;
      `,
      'Explain'
    );
 
    // Get the HTML for the reference details and create the explanation section
    const explanationText = getReferenceDetails();
    const explanationSection = createExplanationSection(explanationText);
 
    // Toggle the explanation section's visibility when the button is clicked
    explainButton.onclick = () => {
      if (explanationSection.style.display === 'none') {
        explanationSection.style.display = 'block';
        explainButton.textContent = 'Hide Explanation';
      } else {
        explanationSection.style.display = 'none';
        explainButton.textContent = 'Explain';
      }
    };
 
    userMessageLine.appendChild(explainButton);
    userMessageLine.appendChild(explanationSection);
  }
 
  // Append the header and the message content to the main message container
  messageLine.appendChild(userLine);
  messageLine.appendChild(userMessageLine);
  return messageLine;
 };
 
 // -----------------------------------------------------
 // Function: createThinkingMessage()
 // Purpose: Shows "typing dots" to indicate the chatbot is processing a response.
 // -----------------------------------------------------
 const createThinkingMessage = () => {
  const messageLine = createElement('div', 'margin-bottom: 15px;', '', {
    id: 'thinkingMessage',
  });
  const userLine = createElement('div', 'display: flex; align-items: center;');
  const userNameElem = createElement(
    'span',
    `font-weight: bold; margin-right: 5px; color: ${COLORS.primary}; font-size: 1.05em;`,
    'PrecisionFDA'
  );
  const timestamp = createElement(
    'span',
    'font-size: 0.9em; color: #888; margin-right: 10px;',
    getTimeString()
  );
  userLine.appendChild(userNameElem);
  userLine.appendChild(timestamp);
 
  const userMessageLine = createElement(
    'div',
    `
      font-size: 1.05em;
      margin-left: 15px;
      display: flex;
      align-items: center;
      font-family: 'Proxima Nova', Helvetica, Arial, sans-serif;
    `
  );
  // Create a container for the animated "thinking" dots
  const thinkingDots = createElement('div', 'display: flex;', '', {
    class: 'thinking-dots',
  });
  const dot1 = createElement('span', '', '.');
  const dot2 = createElement('span', '', '.');
  const dot3 = createElement('span', '', '.');
 
  thinkingDots.appendChild(dot1);
  thinkingDots.appendChild(dot2);
  thinkingDots.appendChild(dot3);
  userMessageLine.appendChild(thinkingDots);
 
  messageLine.appendChild(userLine);
  messageLine.appendChild(userMessageLine);
  return messageLine;
 };
 
 // -----------------------------------------------------
 // Helper functions for username and time formatting
 // -----------------------------------------------------
 const getUsername = () => {
  const userSelector = document.querySelector(
    '#accessible-megamenu-1507037524108-13'
  );
  return userSelector ? userSelector.textContent.trim() : 'You';
 };
 
 const getTimeString = () => {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutes} ${ampm}`;
 };
 
 // -------------------------------------------------------------------------------------
 // Function: sanitizeAssistantResponse()
 // Purpose: Clean and prepare the assistant's response text by removing unwanted markdown,
 //          merging consecutive references, and linking standard reference phrases.
 // -------------------------------------------------------------------------------------
 const sanitizeAssistantResponse = (text) => {
  // Reset the collected references for a new message
  collectedReferences = [];
 
  // Remove markdown headings and asterisks
  text = text.replace(/#+\s?/g, '');
  text = text.replace(/\*\*/g, '');
  // Remove any existing bracketed content (if any)
  text = text.replace(/\[[^\]]*\]/g, '');
 
  // Bold specific headings by wrapping them in <strong> tags:
  text = text.replace(/(Question Asked)/gi, '<strong>$1</strong>');
  text = text.replace(/(Extracted Insight)/gi, '<strong>$1</strong>');
  text = text.replace(/(Document Section\/Page)/gi, '<strong>$1</strong>');
  text = text.replace(/(Confidence Score)/gi, '<strong>$1</strong>');
  text = text.replace(/(Additional Notes)/gi, '<strong>$1</strong>');
 
  // 1) Merge adjacent reference markers into unified superscripts
  text = unifyConsecutiveReferences(text);
 
  // 2) Convert phrases like "See - Page X" into clickable links
  text = linkReferences(text);
 
  return text.trim();
 };
 
 
 // -------------------------------------------------------------------------------------
 // Function: createThreadWithMessage()
 // Purpose: Handles API communication with OpenAI by:
 //          - Creating a new thread.
 //          - Adding the user message to that thread.
 //          - Running the assistant on the thread and polling until complete.
 //          - Retrieving the assistant's response.
 // IMPORTANT: API keys in client-side code are insecure; move API calls to a secure backend.
 // -------------------------------------------------------------------------------------
 const createThreadWithMessage = async (userInput) => {
  const apiKey =
    '#####';   //Replace with your API key
  const assistantId = '######';  //Replace with your Assistant ID
  const baseUrl = `https://api.openai.com/v1/`;
 
  try {
    console.log('Creating thread...');
    // Create a new thread with a POST request
    const createThreadResponse = await fetch(`${baseUrl}/threads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({}),
    });
    const threadData = await createThreadResponse.json();
    console.log('Create Thread Response:', createThreadResponse.status, threadData);
 
    if (!createThreadResponse.ok) {
      console.error('Error creating thread:', threadData);
      return `Failed to create thread. Details: ${threadData}`;
    }
 
    const threadId = threadData.id;
    console.log('Thread created with ID:', threadId);
 
    console.log('Adding message to thread...');
    // Add the user's message to the thread
    const addMessageResponse = await fetch(`${baseUrl}/threads/${threadId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        role: 'user',
        content: userInput,
      }),
    });
    const messageData = await addMessageResponse.json();
 
    if (!addMessageResponse.ok) {
      console.error('Error adding message to thread:', messageData);
      return `Failed to add message to thread. Details: ${JSON.stringify(messageData)}`;
    }
 
    console.log('Message added to thread:', messageData);
 
    console.log('Running assistant on thread...');
    // Trigger the assistant to process the thread
    const runResponse = await fetch(`${baseUrl}/threads/${threadId}/runs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        assistant_id: assistantId,
      }),
    });
    const runData = await runResponse.json();
 
    if (!runResponse.ok) {
      console.error('Error running assistant on thread:', runData);
      return `Failed to run assistant on thread. Details: ${JSON.stringify(runData)}`;
    }
 
    const runId = runData.id;
    console.log('Run started with ID:', runId);
 
    console.log('Polling run until finished...');
    // Poll until the assistant's run is complete or failed
    let runStatus = runData.status;
    while (runStatus !== 'completed' && runStatus !== 'failed') {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const pollResponse = await fetch(`${baseUrl}/threads/${threadId}/runs/${runId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'OpenAI-Beta': 'assistants=v2',
        },
      });
      const pollData = await pollResponse.json();
      if (!pollData.status) {
        console.error('Unexpected poll data:', pollData);
        return 'Failed to retrieve run status.';
      }
      runStatus = pollData.status;
    }
 
    if (runStatus === 'failed') {
      console.error('Run failed.');
      return 'Assistant failed to process the thread.';
    }
 
    console.log('Fetching assistant response...');
    // Once the run is complete, fetch the messages (which include the assistant's response)
    const getMessagesResponse = await fetch(`${baseUrl}/threads/${threadId}/messages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'OpenAI-Beta': 'assistants=v2',
      },
    });
    const messagesData = await getMessagesResponse.json();
    console.log('Received messages data:', messagesData);
 
    if (!getMessagesResponse.ok) {
      console.error('Error fetching assistant response:', messagesData);
      return `Failed to fetch assistant response. Status: ${getMessagesResponse.status}, Details: ${JSON.stringify(messagesData)}`;
    }
 
    // Find the assistant's message from the list and return its text content
    if (messagesData && Array.isArray(messagesData.data) && messagesData.data.length > 0) {
      const assistantMessage = messagesData.data.find((msg) => msg.role === 'assistant');
      if (assistantMessage && assistantMessage.content && assistantMessage.content[0]?.text?.value) {
        return assistantMessage.content[0].text.value || 'No response from assistant.';
      } else {
        console.error('No content in assistant message:', assistantMessage);
        return 'No response from assistant.';
      }
    } else {
      console.error('No messages or invalid data structure:', messagesData);
      return `No messages found or the response structure is unexpected. ${JSON.stringify(messagesData)}`;
    }
  } catch (error) {
    console.error('Error occurred while processing request:', error.message, error.stack);
    return `An error occurred while processing your request: ${error.message}`;
  }
 };
 
 // -----------------------------------------------------
 // Chat Widget State Variables
 // -----------------------------------------------------
 let chatButtonVisible = true;
 let chatboxVisible = false;
 let isDragging = false;
 let preventClick = false;
 
 // -----------------------------------------------------
 // Function: setupChatWidget()
 // Purpose: Initialize the chat widget by loading fonts/icons, creating the chat bubble,
 //          and setting up the chatbox with its UI elements and event listeners.
 // -----------------------------------------------------
 const setupChatWidget = () => {
  loadGoogleFont();
  loadFontAwesome();
  const btn = createButton();
  const {
    chatbox,
    chatMessagesContainer,
    header,
    chatboxContent,
    input,
    sendIcon,
    fileDisplayContainer,
    fileInput,
  } = createChatbox();
 
  // Toggle chatbox visibility when the chat bubble button is clicked
  btn.onclick = () => {
    if (preventClick) {
      preventClick = false;
      return;
    }
    if (!isDragging) {
      chatboxVisible = !chatboxVisible;
      chatbox.style.display = chatboxVisible ? 'block' : 'none';
      if (chatboxVisible) {
        btn.innerHTML = '<i class="fa-solid fa-angle-down" style="font-size: 24px;"></i>';
        btn.title = 'Close Chat';
      } else {
        btn.innerHTML = `
          <img
            src="https://precision.fda.gov/assets/presskit/pfda.favicon.white.688x688.png"
            alt="PrecisionFDA Logo"
            style="width: 70px; height: 70px; object-fit: cover; border-radius: 50%;"
          >
        `;
        btn.title = 'Open Chat';
      }
      adjustChatboxPosition();
    }
  };
 
  // -------------------------------
  // Chat header button actions
  // -------------------------------
  const clearBtn = header.querySelector('button:nth-child(3)');
  const expandBtn = header.querySelector('button:nth-child(1)');
 
  // Clear chat messages when clearBtn is clicked (with confirmation)
  clearBtn.onclick = (event) => {
    event.stopPropagation();
    if (confirm('Are you sure you want to clear the chat content?')) {
      chatMessagesContainer.innerHTML = '';
      resetFileDisplayContainer();
    }
  };
 
  // Expand or shrink the chatbox when expandBtn is clicked
  expandBtn.onclick = (event) => {
    event.stopPropagation();
    const isExpanded = chatbox.style.width === '80%';
    if (isExpanded) {
      chatbox.style.width = '300px';
      chatbox.style.height = '400px';
      adjustChatboxPosition();
    } else {
      chatbox.style.width = '80%';
      chatbox.style.height = '80%';
      chatbox.style.top = '10%';
      chatbox.style.left = '10%';
      chatbox.style.right = '10%';
      chatbox.style.bottom = '10%';
      chatbox.style.margin = 'auto';
      chatbox.style.position = 'fixed';
    }
    expandBtn.innerHTML = isExpanded ? '<i class="fa fa-expand"></i>' : '<i class="fa fa-compress"></i>';
  };
 
  // -----------------------------------------------------
  // Function: sendMessage()
  // Purpose: Handle sending a user message:
  //          - Append the user message.
  //          - Show a "thinking" indicator.
  //          - Call the API and display the chatbot's response.
  // -----------------------------------------------------
  const sendMessage = async () => {
    if (input.value.trim() !== '') {
      const userMessage = input.value;
      input.value = '';
      sendIcon.style.color = 'gray';
 
      // Create and display the user's message in the chat window
      const message = createMessage(userMessage, 'user');
      chatMessagesContainer.appendChild(message);
 
      // Add a "thinking" message to simulate the chatbot processing
      const thinkingMessage = createThinkingMessage();
      chatMessagesContainer.appendChild(thinkingMessage);
      chatMessagesContainer.scrollTop =
        chatMessagesContainer.scrollHeight - chatMessagesContainer.clientHeight;
 
      try {
        // Call the API to process the message and create a thread
        const response = await createThreadWithMessage(userMessage);
        // Remove the thinking indicator once a response is received
        chatMessagesContainer.removeChild(thinkingMessage);
 
        // Sanitize the assistant's response to merge references and clean up text
        const sanitizedResponse = sanitizeAssistantResponse(response);
        const chatbotMessage = createMessage(sanitizedResponse, 'chatbot');
        chatMessagesContainer.appendChild(chatbotMessage);
      } catch (error) {
        chatMessagesContainer.removeChild(thinkingMessage);
        const errorMessage = createMessage(
          'Sorry, there was an error processing your request.',
          'chatbot',
          true
        );
        chatMessagesContainer.appendChild(errorMessage);
      }
      // Scroll to the bottom of the chat messages
      chatMessagesContainer.scrollTop =
        chatMessagesContainer.scrollHeight - chatMessagesContainer.clientHeight;
      input.focus();
      resetFileDisplayContainer();
    }
  };
 
  // Change the send icon color based on whether there is text in the input field
  input.oninput = () => {
    sendIcon.style.color = input.value.trim() ? COLORS.primary : 'gray';
  };
 
  // Allow sending the message with the "Enter" key
  input.onkeydown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };
 
  // Bind send action to the send icon click
  sendIcon.onclick = sendMessage;
 
  // Keyboard shortcuts for various actions
  document.addEventListener('keydown', (event) => {
    if (event.shiftKey && event.key === 'N') {
      event.preventDefault();
      btn.click();
      input.focus();
    } else if (event.shiftKey && event.key === 'C') {
      event.preventDefault();
      clearBtn.click();
    } else if (event.shiftKey && event.key === '|') {
      event.preventDefault();
      expandBtn.click();
    } else if (event.shiftKey && event.key === '!') {
      event.preventDefault();
      toggleChatVisibility();
    } else if (event.shiftKey && event.key === '}') {
      event.preventDefault();
      toggleSidebar();
    }
  });
 
  // -----------------------------------------------------
  // Drag functionality for the chat bubble button
  // -----------------------------------------------------
  let initialX, initialY, offsetX = 0, offsetY = 0;
  btn.onmousedown = (e) => {
    if (!chatboxVisible) {
      isDragging = false;
      initialX = e.clientX - offsetX;
      initialY = e.clientY - offsetY;
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', stopDrag);
      btn.style.transition = 'none';
      e.preventDefault();
    }
  };
 
  const handleDrag = (e) => {
    isDragging = true;
    offsetX = e.clientX - initialX;
    offsetY = e.clientY - initialY;
    setTranslate(offsetX, offsetY, btn);
  };
 
  const stopDrag = () => {
    if (isDragging) {
      preventClick = true;
    }
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
    btn.style.transition = 'all 0.3s ease';
    adjustChatboxPosition();
    isDragging = false;
  };
 
  // Helper to update the position of an element via CSS transform
  const setTranslate = (xPos, yPos, el) => {
    el.style.transform = `translate(${xPos}px, ${yPos}px)`;
  };
 
  // Adjust the chatbox position based on the chat bubble's location within the viewport
  const adjustChatboxPosition = () => {
    const bubbleRect = btn.getBoundingClientRect();
    const chatboxRect = chatbox.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const bubbleCenterX = bubbleRect.left + bubbleRect.width / 2;
    const bubbleCenterY = bubbleRect.top + bubbleRect.height / 2;
    const buffer = 20;
 
    // Position chatbox to the right or left depending on where the bubble is
    if (bubbleCenterX < viewportWidth / 2) {
      chatbox.style.left = `${Math.min(
        bubbleRect.right + buffer,
        viewportWidth - chatboxRect.width
      )}px`;
      chatbox.style.right = 'auto';
    } else {
      chatbox.style.left = 'auto';
      chatbox.style.right = `${Math.min(
        viewportWidth - bubbleRect.left + buffer,
        viewportWidth - chatboxRect.width
      )}px`;
    }
 
    // Position chatbox above or below depending on the bubble's vertical location
    if (bubbleCenterY < viewportHeight / 2) {
      chatbox.style.top = `${Math.min(
        bubbleRect.bottom + buffer,
        viewportHeight - chatboxRect.height
      )}px`;
      chatbox.style.bottom = 'auto';
    } else {
      chatbox.style.top = 'auto';
      chatbox.style.bottom = `${Math.min(
        viewportHeight - bubbleRect.top + buffer,
        viewportHeight - chatboxRect.height
      )}px`;
    }
  };
 
  // Append the chat bubble button and chatbox to the document body
  document.body.appendChild(btn);
  document.body.appendChild(chatbox);
 };
 
 // -----------------------------------------------------
 // Function: toggleChatVisibility()
 // Purpose: Toggle the visibility of both the chat bubble button and the chatbox.
 // -----------------------------------------------------
 const toggleChatVisibility = () => {
  const btn = document.querySelector('button');
  const chatbox = document.querySelector('div[style*="position: fixed"]');
  chatButtonVisible = !chatButtonVisible;
  btn.style.display = chatButtonVisible ? 'flex' : 'none';
  chatbox.style.display = chatButtonVisible && chatboxVisible ? 'block' : 'none';
 };
 
 // -----------------------------------------------------
 // Function: resetFileDisplayContainer()
 // Purpose: Reset the file upload UI elements to their default state.
 // -----------------------------------------------------
 const resetFileDisplayContainer = () => {
  const fileDisplayContainer = document.querySelector('#fileDisplayContainer');
  const filePreviewName = document.querySelector('#filePreviewName');
  fileDisplayContainer.style.display = 'none';
  filePreviewName.textContent = 'No file chosen';
  const fileInput = document.querySelector('#fileInput');
  fileInput.value = '';
 };
 
 // -----------------------------------------------------
 // Function: createChatbox()
 // Purpose: Build the complete chatbox UI, including header, message container, input area, and file upload section.
 // -----------------------------------------------------
 const createChatbox = () => {
  // Main chatbox container
  const chatbox = createElement(
    'div',
    `
      width: 300px;
      height: 400px;
      position: fixed;
      bottom: 110px;
      right: 20px;
      background-color: ${COLORS.secondary};
      box-shadow: 0px 10px 15px rgba(0,0,0,0.2);
      overflow: hidden;
      padding: 0;
      box-sizing: border-box;
      border-radius: 15px;
      display: none;
      font-family: 'Proxima Nova', Helvetica, Arial, sans-serif;
      transition: all 0.3s ease;
      z-index: 1001;
      font-size: 1.05em;
    `
  );
 
  // Container for chat content
  const chatboxContent = createElement(
    'div',
    `
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: ${COLORS.secondary};
    `
  );
 
  // Header section with title and action buttons
  const header = createElement(
    'div',
    `
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      box-sizing: border-box;
      background-color: ${COLORS.primary};
      flex-shrink: 0;
      border-bottom: 1px solid #eee;
      font-size: 1.05em;
    `
  );
 
  const expandBtn = createExpandButton();
  const clearBtn = createClearButton();
  const title = createElement(
    'div',
    `
      font-weight: bold;
      font-size: 18px;
      color: ${COLORS.secondary};
      flex-grow: 1;
      text-align: center;
    `,
    'PrecisionFDA AI Agent'
  );
  header.appendChild(expandBtn);
  header.appendChild(title);
  header.appendChild(clearBtn);
 
  // Container for chat messages
  const chatMessagesContainer = createElement(
    'div',
    `
      overflow-y: auto;
      flex-grow: 1;
      padding: 10px;
      display: flex;
      flex-direction: column;
      background-color: ${COLORS.secondary};
    `
  );
 
  // Input wrapper and file upload display container
  const inputWrapper = createElement(
    'div',
    `
      width: 100%;
      box-sizing: border-box;
      padding: 10px 10px 0 10px;
      background-color: ${COLORS.secondary};
      position: relative;
    `
  );
 
  const fileDisplayContainer = createElement(
    'div',
    `
      display: flex;
      align-items: center;
      padding: 5px 10px;
      box-sizing: border-box;
      background-color: #f1f1f1;
      border-radius: 10px;
      position: absolute;
      bottom: 90px;
      left: 10px;
      max-width: calc(100% - 40px);
      white-space: normal;
      word-wrap: break-word;
      display: none;
      z-index: 1000;
    `,
    '',
    { id: 'fileDisplayContainer' }
  );
 
  const filePreviewIcon = createElement(
    'i',
    `
      font-size: 16px;
      margin-right: 5px;
      color: gray;
    `,
    '',
    { class: 'fa fa-file' }
  );
 
  const filePreviewName = createElement(
    'span',
    'font-size: 0.9em;',
    'No file chosen',
    { id: 'filePreviewName' }
  );
  const removeFileIcon = createElement(
    'i',
    `
      font-size: 16px;
      margin-left: 10px;
      color: gray;
      cursor: pointer;
      display: none;
    `,
    '',
    { class: 'fa fa-times' }
  );
 
  // Assemble the file display container with its components
  fileDisplayContainer.appendChild(filePreviewIcon);
  fileDisplayContainer.appendChild(filePreviewName);
  fileDisplayContainer.appendChild(removeFileIcon);
 
  // Show remove icon on hover
  fileDisplayContainer.onmouseenter = () => {
    removeFileIcon.style.display = 'inline';
  };
  fileDisplayContainer.onmouseleave = () => {
    removeFileIcon.style.display = 'none';
  };
  removeFileIcon.onclick = () => {
    resetFileDisplayContainer();
  };
 
  // Container for the input field and associated icons
  const inputContainer = createElement(
    'div',
    `
      width: 100%;
      display: flex;
      align-items: center;
      padding: 0 10px;
      box-sizing: border-box;
      background-color: ${COLORS.secondary};
      border-radius: 25px;
      box-shadow: 0 1px 1px rgba(0,0,0,0.1);
      border: 1px solid #ddd;
      margin-bottom: 5px;
      font-size: 1.05em;
    `
  );
 
  const input = createElement(
    'input',
    `
      flex-grow: 1;
      padding: 10px;
      box-sizing: border-box;
      margin-right: 5px;
      border-radius: 25px;
      font-family: 'Proxima Nova', Helvetica, Arial, sans-serif;
      font-size: 0.9em;
      border: none;
      outline: none;
      background-color: #f9f9f9;
    `,
    '',
    { placeholder: 'How can I help you?' }
  );
 
  // Hidden file input for uploads
  const fileInput = createElement('input', '', '', {
    type: 'file',
    style: 'display: none;',
    id: 'fileInput',
  });
 
  // Send icon to trigger sending a message
  const sendIcon = createElement(
    'i',
    `
      font-size: 20px;
      cursor: pointer;
      margin-left: 10px;
      color: gray;
      align-self: center;
    `,
    '',
    { class: 'fa fa-arrow-up' }
  );
 
  // Upload icon to trigger file selection
  const uploadIcon = createElement(
    'i',
    `
      font-size: 20px;
      cursor: pointer;
      margin-right: 10px;
      color: gray;
    `,
    '',
    { class: 'fa fa-paperclip' }
  );
 
  inputContainer.appendChild(uploadIcon);
  inputContainer.appendChild(input);
  inputContainer.appendChild(sendIcon);
  inputContainer.appendChild(fileInput);
 
  // Append the file display container to the input wrapper
  inputWrapper.appendChild(fileDisplayContainer);
  inputWrapper.appendChild(inputContainer);
 
  // Label to remind users about privacy (chat content not used for model training)
  const label = createElement(
    'div',
    `
      font-size: 0.78em;
      color: #888;
      text-align: center;
      margin-bottom: 10px;
    `,
    'PrecisionFDA chats are not used to train our models. Please verify important info.'
  );
  inputWrapper.appendChild(label);
 
  // Assemble the chatbox content by appending header, messages, and input area
  chatboxContent.appendChild(header);
  chatboxContent.appendChild(chatMessagesContainer);
  chatboxContent.appendChild(inputWrapper);
  chatbox.appendChild(chatboxContent);
 
  // Bind click event to the upload icon to trigger the hidden file input
  uploadIcon.onclick = () => {
    fileInput.click();
  };
 
  // Update the file preview display when a file is selected
  fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (file) {
      filePreviewName.textContent = file.name;
      fileDisplayContainer.style.display = 'flex';
      chatMessagesContainer.scrollTop =
        chatMessagesContainer.scrollHeight - chatMessagesContainer.clientHeight;
    }
  };
 
  return {
    chatbox,
    chatMessagesContainer,
    header,
    chatboxContent,
    input,
    sendIcon,
    fileDisplayContainer,
    fileInput,
  };
 };
 
 // -----------------------------------------------------
 // Function: addCustomCSS()
 // Purpose: Add minimal CSS for custom link styling used in the assistant responses.
 // -----------------------------------------------------
 const addCustomCSS = () => {
  const style = document.createElement('style');
  style.textContent = `
    .link-yes, .link-no {
        padding: 5px 10px;
        border-radius: 15px;
        text-decoration: none;
        font-weight: bold;
        font-size: 16px;
    }
    .link-yes {
        background-color: ${COLORS.linkYesBg};
        color: ${COLORS.linkYesColor};
    }
    .link-no {
        background-color: ${COLORS.linkNoBg};
        color: ${COLORS.linkNoColor};
    }
  `;
  document.head.appendChild(style);
 };
 
 // -----------------------------------------------------
 // Initialize Chat Widget and add custom styles/animations
 // -----------------------------------------------------
 setupChatWidget();
 addCustomCSS();
 
 // Add thinking animation CSS for the animated dots
 const addThinkingAnimationCSS = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    .thinking-dots span {
        display: inline-block;
        font-size: 1.2em;
        animation: bounce 0.6s infinite;
    }
    .thinking-dots span:nth-child(2) {
        animation-delay: 0.2s;
    }
    .thinking-dots span:nth-child(3) {
        animation-delay: 0.4s;
    }
  `;
  document.head.appendChild(style);
 };
 addThinkingAnimationCSS();
 
 // -----------------------------------------------------
 // Project Details Log
 // -----------------------------------------------------
 console.log('PrecisionFDA AI Agent - Version 1.4.2 (stable) - Last updated: Feb 27, 2025');
 
 
 
 
 