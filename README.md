
### How to install for development

    npm install && bower install
    
### How to use

Load unpacked extension in Chrome with development flag enabled.
When you visit `www.messenger.com`, the widget is automatically activated
and calls the backend (currently mocked and randomized) and then shows the
suggested content injected along the chat input box.

If you want to edit widget options, just right click on widget icon and 
select `Options`. Currently you can only edit context size (this is really
a prototype or proof of concept, and should be changed later).
