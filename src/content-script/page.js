export function getNewChatButton() {
  return document.querySelector("nav > a");
}

export function getChatTextarea() {
  return document.querySelector("textarea");
}

export function getMessageList() {
  return document.querySelector(".flex.flex-col.items-center.text-sm.dark\\:bg-gray-800");
}

/**
 * @returns {!Array<!{ element: !HTMLElement, contentElement: !HTMLElement, isStreaming: !boolean, isChatGPT: !boolean, isUser: !boolean, content: !string, contentAsPlainText: !string }>}
 */
export function getMessages() {
  const messageList = getMessageList();
  if (!messageList) {
    return [];
  }

  return Array.from(messageList.children)
    .filter((message) => !message.classList.contains("justify-center") && !message.classList.contains("flex-shrink-0"))
    .map((message) => {
      const isChatGPT = message.classList.contains("bg-gray-50");
      const isStreaming = !!message.querySelector(".result-streaming");

      const contentElement = message.querySelector(".whitespace-pre-wrap");

      return {
        element: message,
        contentElement,
        isStreaming,
        isChatGPT,
        isUser: !isChatGPT,
        content: contentElement ? contentElement.innerHTML : "",
        contentAsPlainText: contentElement ? contentElement.innerText : "",
      };
    });
}

/**
 * @returns {!string|null}
 */
export function getChatId() {
  const match = location.pathname.match(/^\/chat\/([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/);
  if (!match) {
    return null;
  }

  return match[1];
}

/**
 * @param {!string} message
 */
export function sendMessage(message) {
  const chatTextarea = getChatTextarea();
  chatTextarea.focus();

  const data = new DataTransfer();
  data.setData("text/plain", message);
  chatTextarea.dispatchEvent(new ClipboardEvent("paste", { clipboardData: data, bubbles: true, cancelable: true }));
  chatTextarea.value = message;

  chatTextarea.nextElementSibling.click();
}