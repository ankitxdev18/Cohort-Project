// Chat logic — handles sending messages and simple rendering
// Mobile-first, no framework. Progressive enhancement friendly.

(function () {
    const form = document.querySelector('#composer-form');
    const textarea = document.querySelector('#composer-input');
    const list = document.querySelector('#messages');

    // Sidebar elements
    const sidebar = document.querySelector('#sidebar');
    const sidebarOpen = document.querySelector('#sidebar-open');
    const sidebarClose = document.querySelector('#sidebar-close');
    const sidebarBackdrop = document.querySelector('#sidebar-backdrop');

    if (sidebar && sidebarOpen && sidebarClose && sidebarBackdrop) {
        const setSidebar = (open) => {
            sidebar.dataset.open = String(open);
            sidebarBackdrop.dataset.open = String(open);
            document.body.style.overflow = open ? 'hidden' : '';
        };
        sidebarOpen.addEventListener('click', () => setSidebar(true));
        sidebarClose.addEventListener('click', () => setSidebar(false));
        sidebarBackdrop.addEventListener('click', () => setSidebar(false));
    }

    if (!form || !textarea || !list) return;

    // Enter to send (Shift+Enter for newline)
    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            form.requestSubmit();
        }
    });

    // Auto-resize textarea
    const autoresize = () => {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    };
    textarea.addEventListener('input', autoresize);
    window.addEventListener('load', autoresize);

    const createMessage = ({ role, content }) => {
        const li = document.createElement('li');
        li.className = `message ${role === 'user' ? 'message--user' : ''}`;
        li.innerHTML = `
      ${role === 'user' ? '' : '<div class="avatar">G</div>'}
      <div class="bubble"><p></p></div>
      ${role === 'user' ? '<div class="avatar avatar--user">U</div>' : ''}
    `;
        li.querySelector('p').textContent = content;
        return li;
    };

    const createTyping = () => {
        const li = document.createElement('li');
        li.className = 'message';
        li.innerHTML = `
      <div class="avatar">G</div>
      <div class="bubble"><div class="typing"><span></span><span></span><span></span></div></div>
    `;
        return li;
    };

    const scrollToBottom = () => {
        const container = document.querySelector('.messages');
        if (container) container.scrollTop = container.scrollHeight;
    };

    // Demo responder — replace with real API call later
    const fakeReply = async (text) => {
        await new Promise(r => setTimeout(r, 650));
        return `You said: ${text}`;
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = textarea.value.trim();
        if (!text) return;

        // Render user message
        const userMsg = createMessage({ role: 'user', content: text });
        list.appendChild(userMsg);
        textarea.value = '';
        autoresize();
        scrollToBottom();


        scrollToBottom();

        try {
            socket.emit('ai-message', text)
        } catch (err) {
            typing.remove();
            console.error(err);
            const errorMsg = createMessage({ role: 'assistant', content: 'Something went wrong. Please try again.' });
            list.appendChild(errorMsg);
            scrollToBottom();
        }
    });

    socket.on("ai-message-response", (message) => {

        const messageItem = createMessage({
            role: "assistant",
            content: message
        })

        list.appendChild(messageItem);

    })
})();
