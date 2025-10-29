document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const terminal = document.getElementById('terminal');
    const resumeSection = document.getElementById('resume-section');
    const projectsSection = document.getElementById('projects-section');
  
  const commands = ['help', 'about', 'resume', 'projects', 'contact', 'clear'];
  let suggestions = [];
  const history = [];
  let historyIndex = -1; 
  
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const val = input.value;
        handleCommand(val);
        if (val.trim() !== '') {
          history.push(val);
          historyIndex = history.length; 
        }
        input.value = '';
        suggestions = [];
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (history.length === 0) return;
        if (historyIndex === -1) historyIndex = history.length;
        if (historyIndex > 0) {
          historyIndex -= 1;
          input.value = history[historyIndex];
        }
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (history.length === 0) return;
        if (historyIndex === -1) historyIndex = history.length;
        if (historyIndex < history.length - 1) {
          historyIndex += 1;
          input.value = history[historyIndex];
        } else {
          historyIndex = history.length;
          input.value = '';
        }
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
              <li>resume - Display my resume</li>
              <li>projects - Display my projects</li>
              <li>contact - Display contact information</li>
              <li>clear - Clear the terminal</li>
            </ul>
          `;
          break;
        case 'about':
          response = `<p>Hi, This is Debjit. I'm studying Computer Science at KIIT in Bhubaneswar. I work mostly with Python and I love data science. When I'm not coding, I try small projects, read about new tech, or go to meetups to learn from others. I like learning by doing — if something's interesting, I jump in and build it.</p>`;
          break;
        case 'contact':
          response = `
            <p>Contact Information:</p>
            <ul>
              <li>GitHub: <a href="https://github.com/mystichronicle" target="_blank">https://github.com/mystichronicle</a></li>
              <li>Facebook: <a href="https://www.facebook.com/mystichronicle" target="_blank">https://www.facebook.com/mystichronicle</a></li>
              <li>LinkedIn: <a href="https://www.linkedin.com/in/mystichronicle" target="_blank">https://www.linkedin.com/in/mystichronicle</a></li>
              <li>X: <a href="https://www.x.com/mystichronicle" target="_blank">https://www.x.com/mystichronicle</a></li>
              <li>Mastodon: <a href="https://mastodon.social/@mystichronicle" target="_blank" rel="me">https://mastodon.social/@mystichronicle</a></li>
            </ul>
          `;
          break;
        
        
        case 'resume':
          terminal.style.display = 'none';
          projectsSection.style.display = 'none';
          resumeSection.style.display = 'block';
          response = `<p>Loading resume...</p>`;
          break;
        case 'projects':
          terminal.style.display = 'none';
          resumeSection.style.display = 'none';
          projectsSection.style.display = 'block';
          const projectsList = document.getElementById('projects-list');
          projectsList.innerHTML = '<p>Loading projects...</p>';
          
          fetch('https://api.github.com/users/mystichronicle/repos?sort=created&direction=desc')
            .then(response => response.json())
            .then(data => {
              if (data && Array.isArray(data)) {
                if (data.length === 0) {
                  projectsList.innerHTML = '<p>No public repositories found.</p>';
                } else {
                  projectsList.innerHTML = ''; 
                  data.forEach(repo => {
                    const projectItem = document.createElement('div');
                    projectItem.className = 'project-item';
                    projectItem.innerHTML = `<h3>${repo.name}</h3>
                      <p>${repo.description ? repo.description : ''}</p>
                      <p><a href="${repo.html_url}" target="_blank">View Project</a></p>`;
                    projectsList.appendChild(projectItem);
                  });
                }
              } else {
                projectsList.innerHTML = '<p>Error loading projects.</p>';
              }
            })
            .catch(error => {
              console.error(error);
              projectsList.innerHTML = '<p>Error loading projects.</p>';
            });
          response = `<p>Loading projects...</p>`;
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
  
    document.getElementById('back-to-terminal').addEventListener('click', () => {
      resumeSection.style.display = 'none';
      terminal.style.display = '';
    });
  
    document.getElementById('back-to-terminal-projects').addEventListener('click', () => {
      projectsSection.style.display = 'none';
      terminal.style.display = '';
    });
  });
  