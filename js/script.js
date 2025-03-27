document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const terminal = document.getElementById('terminal');
    const resumeSection = document.getElementById('resume-section');
    const projectsSection = document.getElementById('projects-section');
  
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
              <li>resume - Display my resume</li>
              <li>projects - Display my projects</li>
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
              <li>GitHub: <a href="https://github.com/mystichronicle" target="_blank">https://github.com/mystichronicle</a></li>
              <li>Facebook: <a href="https://www.facebook.com/mystichronicle" target="_blank">https://www.facebook.com/mystichronicle</a></li>
              <li>LinkedIn: <a href="https://www.linkedin.com/in/mystichronicle" target="_blank">https://www.linkedin.com/in/mystichronicle</a></li>
              <li>X: <a href="https://www.x.com/mystichronicle" target="_blank">https://www.x.com/imdebjitmandal</a></li>
              <li>Threads: <a href="https://threads.net/@mystichronicle" target="_blank">https://threads.net/@mystichronicle</a></li>
            </ul>
          `;
          break;
        case 'skills':
          response = `
            <p>My works are based on the following:</p>
            <ul>
              <li><a href="https://github.com/mystichronicle?tab=repositories&q=&language=java" target="_blank">JAVA</a></li>
              <li><a href="https://github.com/mystichronicle?tab=repositories&q=&language=python" target="_blank">Python</a></li>
              <li><a href="https://github.com/mystichronicle?tab=repositories&q=&type=&language=c" target="_blank">C</a></li>
              <li><a href="https://github.com/mystichronicle?tab=repositories&q=&type=&language=c%2B%2B&sort=" target="_blank">C++</a></li>
              <li><a href="https://github.com/mystichronicle?tab=repositories&q=&type=&language=go&sort=" target="_blank">GoLang</a></li>
              <li><a href="https://github.com/mystichronicle?tab=repositories&q=&type=&language=rust&sort=" target="_blank">Rust</a></li>
              <li><a href="https://github.com/mystichronicle?tab=repositories&q=&type=&language=html&sort=" target="_blank">HTML</a></li>
              <li><a href="https://github.com/mystichronicle?tab=repositories&q=&type=&language=html&sort=" target="_blank">CSS</a></li>
              <li><a href="https://github.com/mystichronicle?tab=repositories&q=&type=&language=html&sort=" target="_blank">JavaScript</a></li>
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
          // Hide terminal and projects sections; show resume section
          terminal.style.display = 'none';
          projectsSection.style.display = 'none';
          resumeSection.style.display = 'block';
          response = `<p>Loading resume...</p>`;
          break;
        case 'projects':
          // Hide terminal and resume sections; show projects section
          terminal.style.display = 'none';
          resumeSection.style.display = 'none';
          projectsSection.style.display = 'block';
          // Display loading text in projects section
          const projectsList = document.getElementById('projects-list');
          projectsList.innerHTML = '<p>Loading projects...</p>';
          
          // Fetch public repositories from GitHub sorted by creation date (latest to earliest)
          fetch('https://api.github.com/users/mystichronicle/repos?sort=created&direction=desc')
            .then(response => response.json())
            .then(data => {
              if (data && Array.isArray(data)) {
                if (data.length === 0) {
                  projectsList.innerHTML = '<p>No public repositories found.</p>';
                } else {
                  projectsList.innerHTML = ''; // Clear the loading message
                  data.forEach(repo => {
                    // Create a project item for each repository
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
  
    // Back button functionality for resume section
    document.getElementById('back-to-terminal').addEventListener('click', () => {
      resumeSection.style.display = 'none';
      terminal.style.display = 'block';
    });
  
    // Back button functionality for projects section
    document.getElementById('back-to-terminal-projects').addEventListener('click', () => {
      projectsSection.style.display = 'none';
      terminal.style.display = 'block';
    });
  });
  