# ChatGPT with Web Search capabilities
This is just a fast and ugly way to implement search capabilities to ChatGPT
that I did in an evening.

## How does it work?
I've made a prompt that tells ChatGPT that it has access to search (see
`./src/content-script/prompt.js` for the prompt). This prompt makes it reply
with `{search} <query>` when it wants to search for something. The extension
then listens for this message and makes the search (makes a request to
`https://html.duckduckgo.com/html/?q=<query>`) in the background and sends the
results back to ChatGPT as a message. ChatGPT then answers the original question
with the additional information from the search results.

## How well does it work?
It really depends. It kind of wants to search for everything and sometimes the
search query it makes is not very good. This can degrade the answer a bit as
it's really dependent on the search results. So if it tries to search for
something but the answer is not in the search result then it will just make
things up (hallucinating).

I've tested it with asking how many episodes of `The Last of Us` TV series have
aired. But it then tries to search for `the last of us tv series episodes`. That
can make it a bit harder to get the correct search results which in the end can
cause it to answer incorrectly due to the poor quality of the search.

## How do I use it?
You need to build the extension and then install it in your browser. I've not
published it as it's just a proof of concept. It should work in both Firefox and
Chrome.

If you need to make a manifest v3 version just build like normal and then run
```bash
$ node bin/build-manifest.js --manifest 3 > dist/manifest.json
```

This will generate the `manifest.json` as a manifest v3 version.

After you've added it to your browser a new button will appear in the top left
just under the `New chat` button. Clicking on it will create a new chat with the
prompt pasted in.

Note: the extension actually looks for `{search} <query>` in all messages. So if
you get ChatGPT to write that in a chat it will also initiate a search even if
you haven't clicked on the `New Search Chat` button.

Note 2: the extension will hide the search results by default. If you click on
it it will expand and show the search results. This was done to make it easier
to navigate without getting distracted by the wall of search results.

## What's the next step?
- It would probably be an idea to try to optimise the prompt. It could probably be
able to make better search queries and figure out when it actually needs to
search for something.
- The current method to start a new chat with search is a bit hacky. It
currently dissapears sometimes. So making it more stable or figuring out a
better way to do the function.
