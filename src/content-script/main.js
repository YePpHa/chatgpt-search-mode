import { getMessageList, getMessages, getNewChatButton, sendMessage } from "./page.js";
import { DEFAULT_PROMPT } from "./prompt.js";
import { search } from "./search.js";
import { createNewSearchChatButton } from "./ui.js";
import { debounce, sleep } from "./utils.js";

const newSearchChatButton = createNewSearchChatButton();
newSearchChatButton.addEventListener("click", async () => {
  getNewChatButton().click();

  // Wait for the empty chat page to load
  while (location.pathname !== "/chat") {
    await sleep(10);
  }
  await sleep(100);

  sendMessage(DEFAULT_PROMPT
    .replace(/{date}/, (new Date()).toUTCString())
    .replace(/{timezone}/, Intl.DateTimeFormat().resolvedOptions().timeZone)
  );
});

const messageList = getMessageList();
const observer = new MutationObserver(debounce(async () => {
  const messages = getMessages();
  for (const message of messages) {
    if (!message.isUser) {
      continue;
    }
    if (!message.contentAsPlainText.includes("Current date: ") || !message.contentAsPlainText.includes("Search results:")) {
      continue;
    }
    if (message.element.classList.contains("search-chat")) {
      continue;
    }
    message.contentElement.style.opacity = "0";
    message.contentElement.style.overflow = "hidden";
    message.contentElement.style.height = "0px";
    message.contentElement.style.cursor = "pointer";
    const fn = () => {
      message.contentElement.style.opacity = "";
      message.contentElement.style.overflow = "";
      message.contentElement.style.height = "";
      message.contentElement.style.cursor = "";
      message.contentElement.removeEventListener("click", fn);
    };
    message.contentElement.addEventListener("click", fn);
  }

  const lastMessage = messages[messages.length - 1];
  if (!lastMessage) {
    return;
  }

  if (lastMessage.isStreaming) {
    return;
  }

  if (!lastMessage.isChatGPT) {
    return;
  }

  const lastMessageContent = lastMessage.contentAsPlainText.trim();
  const searchQueries = lastMessageContent
    .split(/[\r\n]+/g)
    .map(x => x.trim().match(/^{search}(.*?)$/))
    .filter(x => !!x)
    .map(x => x[1].trim());
  if (searchQueries.length === 0) {
    return;
  }
  console.log(searchQueries);

  const searchResults = (await Promise.all(searchQueries.map(x => search(x)))).flat(1);
  const searchResultsAsText = searchResults.map(x => `Title: ${x.title}\nBody: ${x.body}\nURL: ${x.href}`).join(`\n-----\n`);

  // Remind ChatGPT of the original question from the user. Seems like the search query can confuse it a bit.
  const extraReminder = /*messages[messages.length - 2] ? "\n\n\nOriginal message: " + messages[messages.length - 2].contentAsPlainText + "\n\nDo not make a search query on your next reply." : */"";

  sendMessage("Current date: " + (new Date()).toUTCString() + "\nSearch results:\n\n" + searchResultsAsText + extraReminder);
}, 100));
observer.observe(messageList, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["class"] });

(async () => {
  while (true) {
    if (!newSearchChatButton.parentElement) {
      const newChatButton = getNewChatButton();
      const menu = newChatButton.parentElement;
      menu.insertBefore(newSearchChatButton, newChatButton.nextSibling);
    }
    await sleep(1000);
  }
})();