// Typewriter Js Plugin for my name
let intro = document.getElementById("name");
let typewriter = new Typewriter(intro, {
  strings: "to Andiswa Dlamini's",
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


const readMore = (event) => {
    event.preventDefault();
    let hiddenElement = document.querySelector('.hidden');
    hiddenElement.classList.toggle('.hidden');
}   

 
   const chatBubbleElement = document.getElementById("chat-bubble-icon");
  const chatBotElement = document.getElementById("hide-popup");
  chatBubbleElement.addEventListener('click', event => {
    chatBotElement.classList.toggle("hide-popup");

  });

  // handle outgoing message display
    const msgInput = document.querySelector(".message-input");
    const chatBody = document.querySelector(".chat-body");
    const sendbtn = document.querySelector(".send-btn");


   // API setup
    const apiKEY = "AIzaSyAzY7b0rok5rGVp-CemBfZnEk9G5hjhIxA";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKEY}`;

    const userData = {
      message:null
    }



  const msgElement = (content, ...classes) => {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", ...classes);
    msgDiv.innerHTML = content;
    return msgDiv;
  }

  const botResponse = async (incomingMsgDiv) => {

    const msgBotElement = incomingMsgDiv.querySelector(".message-text");

    async function loadData() {
      const response = await fetch("fata/about.json");
      const data = await response.json();
      return data;
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [
            {
              text: `Your name is Neko. You are Andiswas AI assistant.
                   Your job is to answer questions about skills, experience, and projects.Information about Andiswa:

                   Use the information below to answer questions:

                  ${JSON.stringify(data, null, 2)}

                  // - IT student at Richfield
                  // - Skilled in JavaScript, Python, HTML, CSS
                  // - Built AI chatbot interfaces and web applications
                  // - Experienced in AI data training and linguistic QA
                  // - Speaks English, Zulu, Xhosa, and Sotho

                  Always answer professionally and clearly.
                  If you do not know the answer, say "I don’t have that information yet. You can learn more by contacting Andiswa.".`
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
      const response = await fetch(apiUrl, requestOptions);
      const data = await response.json();
      // console.log("API response:", data);
      // check for errors in response
      if(!response.ok) throw new Error(data.error.message);

      // extract bot response from API data
      const apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      msgBotElement.textContent = apiResponse;
    } catch (error) {
    console.log(error);
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
    onClickOutside: (e) => {
      if (e.target.id === "emoji-btn"){
        document.body.classList.toggle("show-emoji-picker");
      }
    }
  });

  document.querySelector(".chat-form").appendChild(picker);
  // document.body.appendChild(picker)

sendbtn.addEventListener("click", (e) => {
    e.preventDefault(); 

});

  const roadmaplinkElement = document.getElementById("roadmap-link");
  const roadmapSectionElement = document.getElementById("roadmap-section");
  roadmaplinkElement.addEventListener('click', event => {
    const roadmapPrompt = " ";
    roadmapSectionElement.classList.toggle("roadmap-section-enabled");

    sendMsg(roadmapPrompt);
    // msgInput.value = roadmapPrompt;

  });


// readMore();