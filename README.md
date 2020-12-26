# RECIP: a web-based REmote-Controlled Interactive Presentation System

A proof of concept (proof of feasibility) school project.

The project has an [Electron](https://www.electronjs.org/)-compiled simple desktop editor that can edit and generate a standalone HTML file as a PowerPoint-like presentation, all resources, including [Reveal.js](https://revealjs.com/) library and images, are included in this file. It can be executed by any modern browser like a normal HTML web page file. After opening the file, user can use a mobile web app to control the page navigation of the presentation file. Remote control works with [Node.js](https://nodejs.org/) server and [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API).

[**Partially functional online preview of the editor**](https://recip.tomchen.org/) (it can't save or open files)

[**Download the fully functional desktop editor**](https://github.com/tomchen/recip/releases/download/v1.0/recip_windows_v1.0.7z) (only Windows version is compiled)

Done years ago, it uses old-school [jQuery](https://jquery.com/) and [imperative programming](https://en.wikipedia.org/wiki/Imperative_programming), which work fine for the small POC project. For a serious project where scalability and maintainability are required, [React.js](https://reactjs.org/) or other [declarative](https://en.wikipedia.org/wiki/Declarative_programming) [JS frameworks](https://en.wikipedia.org/wiki/Comparison_of_JavaScript_frameworks) and [state](https://reactjs.org/docs/state-and-lifecycle.html) management tools could be used.
