// Typewriter Js Plugin for my name
let intro = document.getElementById("name");
let typewriter = new Typewriter(intro, {
  strings: "Andiswa Dlamini's",
  autoStart: true,
  cursor: "",
  
});


let job = document.getElementById("job");
let title = new Typewriter(job, {
  strings: "Portfolio",
  delay: 500,
  autoStart: true,
  cursor: "",
  
});


// const readMore = (event) => {
//     event.preventDefault();
//     let hiddenElement = document.querySelector('.hidden');
//     hiddenElement.classList.toggle('.hidden');
// }   

 
   const chatBubbleElement = document.getElementById("chat-bubble-icon");
  const chatBotElement = document.getElementById("hide-popup");
  chatBubbleElement.addEventListener('click', event => {
    chatBotElement.classList.toggle("hide-popup");

  });

  // handle outgoing message display
    const msgInput = document.querySelector(".message-input");
    const chatBody = document.querySelector(".chat-body");
    const sendbtn = document.querySelector(".send-btn");


   const chatbotFallback = "I don't have that information yet. You can learn more by contacting Andiswa on LinkedIn.";

   async function loadAboutMe() {
     const res = await fetch("./about.json");
     if (!res.ok) throw new Error("Could not load about.json");
     return res.json();
   }

   function buildSystemPrompt(aboutMe) {
     return `You are Neko, the AI assistant on Andiswa Dlamini's portfolio website.
Answer questions about Andiswa using the JSON below. Read all sections for relevant facts, and answer in your own natural wording. If it contains some relevant details, share them even if another detail is missing. Use this exact response only when the JSON has no relevant information for the personal question: "I don't have that information yet. You can learn more by contacting Andiswa on LinkedIn."

Respond naturally to greetings, acknowledgements, and casual short messages; do not use the personal-information fallback for them. For unrelated questions, briefly redirect the visitor to Andiswa's work. Keep replies concise and easy to follow, using paragraphs or a short list when useful. 

ANDISWA'S INFORMATION (JSON):
${JSON.stringify(aboutMe, null, 2)}`;
   }

    const userData = {
      message:null
    }



  const msgElement = (content, ...classes) => {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", ...classes);
    msgDiv.innerHTML = content;
    return msgDiv;
  }

  const renderBotResponse = (messageElement, response) => {
    const fragment = document.createDocumentFragment();
    const lines = response.trim().split(/\r?\n/);
    let paragraphLines = [];
    let currentList = null;

    const flushParagraph = () => {
      if (!paragraphLines.length) return;
      const paragraph = document.createElement("p");
      paragraph.className = "response-paragraph";
      paragraph.textContent = paragraphLines.join(" ");
      fragment.appendChild(paragraph);
      paragraphLines = [];
    };

    for (const line of lines) {
      const trimmedLine = line.trim();
      const headingMatch = trimmedLine.match(/^#{1,3}\s+(.+)$/);
      const listMatch = trimmedLine.match(/^[-*]\s+(.+)$/);

      if (!trimmedLine) {
        flushParagraph();
        currentList = null;
      } else if (headingMatch) {
        flushParagraph();
        currentList = null;
        const heading = document.createElement("h3");
        heading.className = "response-heading";
        heading.textContent = headingMatch[1];
        fragment.appendChild(heading);
      } else if (listMatch) {
        flushParagraph();
        if (!currentList) {
          currentList = document.createElement("ul");
          currentList.className = "response-list";
          fragment.appendChild(currentList);
        }
        const item = document.createElement("li");
        item.textContent = listMatch[1];
        currentList.appendChild(item);
      } else {
        currentList = null;
        paragraphLines.push(trimmedLine);
      }
    }

    flushParagraph();
    messageElement.replaceChildren(fragment);
  }

  const botResponse = async (incomingMsgDiv) => {
    const msgBotElement = incomingMsgDiv.querySelector(".message-text");
    let aboutMe;

    try {
      aboutMe = await loadAboutMe();
    } catch (error) {
      console.error(error);
      msgBotElement.textContent = chatbotFallback;
      incomingMsgDiv.classList.remove("thinking");
      chatBody.scrollTo({top: chatBody.scrollHeight, behavior: "smooth"});
      return;
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
        
            {
                  text: buildSystemPrompt(aboutMe)
            }
          ]
        },
        contents: [{
          parts: 
          [{
            text: userData.message
          }]
        }]
      })
    }
  


    try {
      // send request to Gemini API
      const response = await fetch("/.netlify/functions/chat", requestOptions);
      const data = await response.json();
      // console.log("API response:", data);
      // check for errors in response
      if(!response.ok) throw new Error(data.error.message);

      // extract bot response from API data
      const apiResponse = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/^[ \t]*\*[ \t]+/gm, "- ")
        .trim();
      renderBotResponse(msgBotElement, apiResponse);
    } catch (error) {
    console.error(error);
    msgBotElement.textContent = chatbotFallback;
  } finally {
    incomingMsgDiv.classList.remove("thinking")
    chatBody.scrollTo({top: chatBody.scrollHeight, behavior: "smooth"});

  }
}



  const sendMsg = (userMsg) => { //add sendMsg = (e) hr e.prevent default
    // create and display outgoing message bubble
    userData.message = msgInput.value.trim();
    const msgContent = `<div class="message-text"></div>`;
    const outgoingMsgDiv = msgElement(msgContent, "user-message");
    outgoingMsgDiv.querySelector(".message-text").textContent = userData.message;
    chatBody.appendChild(outgoingMsgDiv);
    // scroll chat to bottom
    chatBody.scrollTo({top: chatBody.scrollHeight, behavior: "smooth"});

    // Simulate bot response after a delay
    setTimeout(() => {
      const msgContent = `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
                                   <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
                                </svg>
                                <div class="message-text">
                                    <div class="thinking-indicator">
                                        <div class="dot"></div>
                                        <div class="dot"></div>
                                        <div class="dot"></div>
                                    </div>
                                </div>`;

       const incomingMsgDiv = msgElement(msgContent, "bot-message", "thinking");
      chatBody.appendChild(incomingMsgDiv);
      chatBody.scrollTo({top: chatBody.scrollHeight, behavior: "smooth"});
      botResponse(incomingMsgDiv);
    }, 1000);
  }
  // handling enter key press for sending messages
 
  msgInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();

        const userMsg = e.target.value.trim();
        console.log("User message:", userMsg);

        if (userMsg) {
            sendMsg(userMsg);
            msgInput.value = "";
        }
    }

  });

  //  const pickerOptions = { onEmojiSelect: console.log }
  //emoji picker setup
  const picker = new EmojiMart.Picker({
    theme: "light",
    skinTonePosition: "none",
    previewPosition: "none",
    onEmojiSelect: (emoji) => {
      const start = msgInput.selectionStart ?? msgInput.value.length;
      const end = msgInput.selectionEnd ?? start;
      msgInput.setRangeText(emoji.native, start, end, "end");
      msgInput.focus();
      document.body.classList.remove("show-emoji-picker");
    },
    onClickOutside: (e) => {
      if (e.target.id === "emoji-btn"){
        document.body.classList.toggle("show-emoji-picker");
      }
    }
  });

  document.querySelector(".chat-form").appendChild(picker);
  // document.body.appendChild(picker)

sendbtn.addEventListener("click", (e) => {
    e.preventDefault();     //REPETITIVE - NOT A GOOD PRACTISE DRY
    sendMsg();
    // msgInput.value = "";
});

  const roadmaplinkElement = document.getElementById("roadmap-link");
  roadmaplinkElement.addEventListener('click', event => {
    const roadmapPrompt = "Andiswa's roadmap";

    chatBotElement.classList.remove("hide-popup");
    msgInput.value = roadmapPrompt;

    sendMsg();
    
    msgInput.value = "";

  });

    const faqLink = document.getElementById("faqLink");
    faqLink.addEventListener('click', event => {
      document.getElementById("faq-text").classList.toggle("hidden");

  });

  const closeChatBtn = document.getElementById("close-chatbot");
  closeChatBtn.addEventListener('click', event => {
    chatBotElement.classList.add("hide-popup");

  });

