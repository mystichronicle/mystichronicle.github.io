document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input');
    const output = document.getElementById('output');

    const commands = ['help', 'about', 'contact', 'skills', 'resume', 'projects', 'clear'];
    let suggestions = [];

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleCommand(input.value);
            input.value = '';
            suggestions = [];
        } else if (event.key === 'Tab') {
            event.preventDefault();
            autoComplete();
        } else {
            showSuggestions(input.value);
        }
    });

    function handleCommand(command) {
        const cmd = command.trim().toLowerCase();
        let response = '';

        switch (cmd) {
            case 'help':
                response = `
                <p>Available commands:</p>
                <ul>
                    <li>about - Display information about me</li>
                    <li>contact - Display contact information</li>
                    <li>skills - Display my skills</li>
                    <li>resume - Display the link to my resume</li>
                    <li>projects - Display a list of my projects</li>
                    <li>clear - Clear the terminal</li>
                </ul>
                `;
                break;
            case 'about':
                response = `<p>Hi, I'm Debjit Mandal, currently pursuing B.Tech in Computer Science and Engineering at Kalinga Institute of Industrial Technology, Bhubaneswar, Odisha, India. I have a passion for coding and I'm always looking to improve my skills and knowledge.</p>`;
                break;
            case 'contact':
                response = `
                <p>Contact Information:</p>
                <ul>
                    <li>GitHub: <a href="https://github.com/opulentloop" target="_blank">https://github.com/opulentloop</a></li>
                    <li>Facebook: <a href="https://www.facebook.com/opulentloop" target="_blank">https://www.facebook.com/opulentloop</a></li>
                    <li>LinkedIn: <a href="https://www.linkedin.com/in/opulentloop" target="_blank">https://www.linkedin.com/in/opulentloop</a></li>
                    <li>X: <a href="https://www.x.com/opulentloop" target="_blank">https://www.x.com/imdebjitmandal</a></li>
                    <li>Fosstodon: <a href="https://fosstodon.org/@opulentloop" target="_blank">https://fosstodon.org/@opulentloop</a></li>
                </ul>
                `;
                break;
            case 'skills':
                response = `
                <p>My works are based on the following:</p>
                <ul>
                    <li>
                    <a
                        href="https://github.com/opulentloop?tab=repositories&q=&language=java" target="_blank"
                        >JAVA</a
                    >
                    </li>
                
                    <li>
                    <a
                        href="https://github.com/opulentloop?tab=repositories&q=&language=python" target="_blank"
                        >Python</a
                    >
                    </li>
                
                    <li>
                    <a
                        href="https://github.com/opulentloop?tab=repositories&q=&type=&language=c&sort=" target="_blank"
                        >C</a
                    >
                    </li>
                
                    <li>
                    <a
                        href="https://github.com/opulentloop?tab=repositories&q=&type=&language=c%2B%2B&sort=" target="_blank"
                        >C++</a
                    >
                    </li>
                
                    <li>
                    <a
                        href="https://github.com/opulentloop?tab=repositories&q=&type=&language=go&sort=" target="_blank"
                        >GoLang</a
                    >
                    </li>
                
                    <li>
                    <a
                        href="https://github.com/opulentloop?tab=repositories&q=&type=&language=rust&sort=" target="_blank"
                        >Rust</a
                    >
                    </li>
                
                    <li>
                    <a
                        href="https://github.com/opulentloop?tab=repositories&q=&type=&language=html&sort=" target="_blank"
                        >HTML</a
                    >
                    </li>
                
                    <li>
                    <a
                        href="https://github.com/opulentloop?tab=repositories&q=&type=&language=html&sort=" target="_blank"
                        >CSS</a
                    >
                    </li>
                
                    <li>
                    <a
                        href="https://github.com/opulentloop?tab=repositories&q=&type=&language=html&sort=" target="_blank"
                        >JavaScript</a
                    >
                    </li>
                
                    <li><a href="#">SQL</a></li>
                
                    <li><a href="#">MongoDB</a></li>
                
                    <li><a href="#">Git/GitHub</a></li>
                
                    <li><a href="#">Flask</a></li>
                
                    <li><a href="#">Django</a></li>
                
                    <li><a href="#">Data Science</a></li>
                
                    <li><a href="#">Data Analytics</a></li>
                
                    <li><a href="#">AI & ML</a></li>
                </ul>
                `;
                break;
            case 'resume':
                response = `<p>Redirecting to my Resume...</p>`;
                setTimeout(() => {
                    window.open("/assets/resume/Debjit's Resume.pdf", '_blank');
                }, 1000);
                break;
            case 'projects':
                response = `<p>Redirecting to my projects page...</p>`;
                setTimeout(() => {
                    window.open('https://opulentloop.github.io/gitfolio', '_blank');
                }, 1000);
                break;
            case 'clear':
                output.innerHTML = '';
                return;
            default:
                response = `<p>Command not found: ${command}</p>`;
                break;
        }

        const newOutput = document.createElement('div');
        newOutput.innerHTML = `<p class="command">> ${command}</p>${response}`;
        output.appendChild(newOutput);
        output.scrollTop = output.scrollHeight;
    }

    function showSuggestions(inputValue) {
        const value = inputValue.trim().toLowerCase();
        suggestions = commands.filter(cmd => cmd.startsWith(value));
        const suggestionText = suggestions.length > 0 ? suggestions.join(' ') : '';
        const suggestionElement = document.createElement('p');
        suggestionElement.className = 'suggestion';
        suggestionElement.textContent = suggestionText;
        clearSuggestions();
        output.appendChild(suggestionElement);
    }

    function clearSuggestions() {
        const suggestionElements = document.querySelectorAll('.suggestion');
        suggestionElements.forEach(el => el.remove());
    }

    function autoComplete() {
        if (suggestions.length === 1) {
            input.value = suggestions[0];
        }
    }
});
