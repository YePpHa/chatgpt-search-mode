export function createNewSearchChatButton() {
  const newSearchChatButton = document.createElement("a");
  newSearchChatButton.className = "flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20";
  newSearchChatButton.textContent = "New Search Chat";

  return newSearchChatButton;
}