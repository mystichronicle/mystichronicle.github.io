document.addEventListener('DOMContentLoaded', () => {
    // Constants
    const CONFIG = {
      githubUsername: 'mystichronicle',
      githubApiUrl: 'https://api.github.com/users/',
      displayStates: {
        NONE: 'none',
        BLOCK: 'block',
        EMPTY: ''
      },
      focusDelay: 100
    };
    
    // Cache DOM elements
    const DOM = {
      input: document.getElementById('input'),
      output: document.getElementById('output'),
      terminal: document.getElementById('terminal'),
      resumeSection: document.getElementById('resume-section'),
      projectsSection: document.getElementById('projects-section'),
      projectsList: document.getElementById('projects-list'),
      backToTerminalBtn: document.getElementById('back-to-terminal'),
      backToTerminalProjectsBtn: document.getElementById('back-to-terminal-projects')
    };
  
    // State
    const state = {
      commands: ['help', 'about', 'resume', 'projects', 'contact', 'clear'],
      suggestions: [],
      history: [],
      historyIndex: -1 // -1 indicates we're not navigating history
    };
    
    // Utility functions
    const sanitizeHTML = (str) => {
      const temp = document.createElement('div');
      temp.textContent = str;
      return temp.innerHTML;
    };
    
    const showSection = (sectionToShow) => {
      const sections = [DOM.terminal, DOM.resumeSection, DOM.projectsSection];
      sections.forEach(section => {
        section.style.display = section === sectionToShow ? CONFIG.displayStates.BLOCK : CONFIG.displayStates.NONE;
      });
      if (sectionToShow === DOM.terminal) {
        restoreFocus();
      }
    };
    
    const restoreFocus = () => {
      setTimeout(() => DOM.input.focus(), CONFIG.focusDelay);
    }; 
    
    // Event handlers
    const navigateHistory = (direction) => {
      if (state.history.length === 0) return;
      if (state.historyIndex === -1) state.historyIndex = state.history.length;
      
      if (direction === 'up' && state.historyIndex > 0) {
        state.historyIndex -= 1;
        DOM.input.value = state.history[state.historyIndex];
      } else if (direction === 'down') {
        if (state.historyIndex < state.history.length - 1) {
          state.historyIndex += 1;
          DOM.input.value = state.history[state.historyIndex];
        } else {
          state.historyIndex = state.history.length;
          DOM.input.value = '';
        }
      }
    };
  
    DOM.input.addEventListener('keydown', (event) => {
      const keyHandlers = {
        'Enter': () => {
          const val = DOM.input.value;
          handleCommand(val);
          if (val.trim() !== '') {
            state.history.push(val);
            state.historyIndex = state.history.length;
          }
          DOM.input.value = '';
          clearSuggestions();
          state.suggestions = [];
        },
        'ArrowUp': () => {
          event.preventDefault();
          navigateHistory('up');
        },
        'ArrowDown': () => {
          event.preventDefault();
          navigateHistory('down');
        },
        'Tab': () => {
          event.preventDefault();
          autoComplete();
        }
      };
      
      if (keyHandlers[event.key]) {
        keyHandlers[event.key]();
      } else if (!event.ctrlKey && !event.metaKey && !event.altKey) {
        setTimeout(() => showSuggestions(DOM.input.value), 0);
      }
    });
    
    // Command definitions
    const commandHandlers = {
      help: () => `
        <p>Available commands:</p>
        <ul>
          <li>about - Display information about me</li>
          <li>resume - Display my resume</li>
          <li>projects - Display my projects</li>
          <li>contact - Display contact information</li>
          <li>clear - Clear the terminal</li>
        </ul>
      `,
      
      about: () => `<p>Hi, This is Debjit. I'm studying Computer Science at KIIT in Bhubaneswar. I work mostly with Python and I love Data Science. It's my privilege to share my interests, stories, and skills with you. I really hope you'll enjoy browsing my site and I'd love to hear your feedback.</p>`,
      
      contact: () => {
        const links = [
          { name: 'GitHub', url: `https://github.com/${CONFIG.githubUsername}` },
          { name: 'LinkedIn', url: `https://www.linkedin.com/in/${CONFIG.githubUsername}` },
          { name: 'X', url: `https://www.x.com/${CONFIG.githubUsername}` },
          { name: 'Mastodon', url: `https://mastodon.social/@${CONFIG.githubUsername}`, rel: 'noopener noreferrer me' }
        ];
        
        const linksList = links.map(link => 
          `<li>${link.name}: <a href="${link.url}" target="_blank" rel="${link.rel || 'noopener noreferrer'}">${link.url}</a></li>`
        ).join('');
        
        return `
          <p>Contact Information:</p>
          <ul>${linksList}</ul>
        `;
      },
      
      resume: () => {
        showSection(DOM.resumeSection);
        return `<p>Loading resume...</p>`;
      },
      
      projects: () => {
        showSection(DOM.projectsSection);
        loadGitHubProjects();
        return `<p>Loading projects...</p>`;
      },
      
      clear: () => {
        DOM.output.innerHTML = '';
        return null; // Special case: no output
      }
    };
    
    const loadGitHubProjects = () => {
      DOM.projectsList.innerHTML = '<p class="loading">Loading projects...</p>';
      
      const apiUrl = `${CONFIG.githubApiUrl}${CONFIG.githubUsername}/repos?sort=created&direction=desc`;
      
      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          if (!data || !Array.isArray(data)) {
            DOM.projectsList.innerHTML = '<p>Error: Invalid data received from API.</p>';
            return;
          }
          
          if (data.length === 0) {
            DOM.projectsList.innerHTML = '<p>No public repositories found.</p>';
            return;
          }
          
          DOM.projectsList.innerHTML = '';
          data.forEach(repo => {
            const projectItem = createProjectItem(repo);
            DOM.projectsList.appendChild(projectItem);
          });
        })
        .catch(error => {
          console.error('Failed to fetch projects:', error);
          const errorMsg = error.message.includes('status: 403')
            ? 'GitHub API rate limit exceeded. Please try again later.'
            : 'Failed to load projects. Please check your internet connection.';
          DOM.projectsList.innerHTML = `<p>Error: ${sanitizeHTML(errorMsg)}</p>`;
        });
    };
    
    const createProjectItem = (repo) => {
      const projectItem = document.createElement('div');
      projectItem.className = 'project-item';
      const repoName = sanitizeHTML(repo.name);
      const repoDesc = repo.description ? sanitizeHTML(repo.description) : 'No description available';
      const repoUrl = sanitizeHTML(repo.html_url);
      
      projectItem.innerHTML = `
        <h3>${repoName}</h3>
        <p>${repoDesc}</p>
        <p><a href="${repoUrl}" target="_blank" rel="noopener noreferrer">View Project</a></p>
      `;
      
      return projectItem;
    };
    
    const addOutput = (command, response) => {
      const newOutput = document.createElement('div');
      newOutput.innerHTML = `<p class="command">> ${sanitizeHTML(command)}</p>${response}`;
      DOM.output.appendChild(newOutput);
      DOM.output.scrollTop = DOM.output.scrollHeight;
    };
  
    function handleCommand(command) {
      const cmd = command.trim().toLowerCase();
      const handler = commandHandlers[cmd];
      
      if (handler) {
        const response = handler();
        if (response !== null) {
          addOutput(command, response);
        }
      } else {
        const response = `<p>Command not found: ${sanitizeHTML(command)}</p>`;
        addOutput(command, response);
      }
    }
  
    function showSuggestions(inputValue) {
      clearSuggestions();
      const value = inputValue.trim().toLowerCase();
      
      if (value === '') {
        state.suggestions = [];
        return;
      }
      
      state.suggestions = state.commands.filter(cmd => cmd.startsWith(value));
      
      if (state.suggestions.length > 0 && state.suggestions[0] !== value) {
        const suggestionElement = document.createElement('p');
        suggestionElement.className = 'suggestion';
        suggestionElement.textContent = state.suggestions.join(', ');
        suggestionElement.setAttribute('aria-live', 'polite');
        DOM.output.appendChild(suggestionElement);
      }
    }
  
    function clearSuggestions() {
      const suggestionElements = document.querySelectorAll('.suggestion');
      suggestionElements.forEach(el => el.remove());
    }
  
    function autoComplete() {
      if (state.suggestions.length === 1) {
        DOM.input.value = state.suggestions[0];
        clearSuggestions();
        state.suggestions = [];
      }
    }
    
    // Setup back button handlers
    const setupBackButtons = () => {
      DOM.backToTerminalBtn.addEventListener('click', () => showSection(DOM.terminal));
      DOM.backToTerminalProjectsBtn.addEventListener('click', () => showSection(DOM.terminal));
    };
    
    // Initialize
    setupBackButtons();
  });
  