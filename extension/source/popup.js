const variables = {
  promptsDataEndpoint : `https://github.com/jasonwilczak/promptly/blob/main/prompts/prompt-data.json`
}

document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search-input');
  const tagsContainer = document.getElementById('tags-container');
  const promptsContainer = document.getElementById('prompts-container');
  // Listen for pagination updates
  window.addEventListener('paginationUpdate', (event) => {
    renderPrompts(event.detail.data);
  });
  
  let allPrompts = [];
  let activeTags = new Set();
  const pagination = new Pagination({ pageSize: 10 });
  let isLoading = false;

  // Search input handler
  searchInput.addEventListener('input', filterPrompts);

  async function fetchPrompts(repoUrl) {
    try {
      setLoading(true);
      const rawUrl = convertToRawUrl(repoUrl);
      const response = await fetch(rawUrl);
      const data = await response.json();
      
      allPrompts = data.prompts;
      pagination.setData(allPrompts);
      // Extract unique tags
      const uniqueTags = new Set();
      allPrompts.forEach(prompt => {
        if (prompt.tags) {
          prompt.tags.forEach(tag => uniqueTags.add(tag));
        }
      });
      
      // Create tag filters
      renderTags(Array.from(uniqueTags));
      
      // Display prompts
      renderPrompts(pagination.getCurrentPageData());
    } catch (error) {
      promptsContainer.innerHTML = `<p style="color: red;">Error fetching prompts: ${error.message}</p>`;
    } finally {
      setLoading(false);
    }
  }

  function filterPrompts() {
    const searchTerm = searchInput.value.toLowerCase();
    
    pagination.filterData(prompt => {
      // Search text match
      const textMatch = prompt.text.toLowerCase().includes(searchTerm);
      
      // Tag filter match
      const tagMatch = activeTags.size === 0 || 
        (prompt.tags && prompt.tags.some(tag => activeTags.has(tag)));
      
      return textMatch && tagMatch;
    });

    renderPrompts(pagination.getCurrentPageData());
  }

  function setLoading(loading) {
    isLoading = loading;
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    
    if (loading) {
      promptsContainer.innerHTML = '';
      promptsContainer.appendChild(spinner);
    }
  }

  function renderTags(tags) {
    tagsContainer.innerHTML = '';
    tags.sort().forEach(tag => {
      const tagElement = document.createElement('span');
      tagElement.className = 'tag';
      tagElement.textContent = tag;
      tagElement.addEventListener('click', () => toggleTag(tag, tagElement));
      tagsContainer.appendChild(tagElement);
    });
  }

  function toggleTag(tag, element) {
    if (activeTags.has(tag)) {
      activeTags.delete(tag);
      element.classList.remove('active');
    } else {
      activeTags.add(tag);
      element.classList.add('active');
    }
    filterPrompts();
  }

  function filterPrompts() {
    const searchTerm = searchInput.value.toLowerCase();
    
    const filteredPrompts = allPrompts.filter(prompt => {
      // Search text match
      const textMatch = prompt.text.toLowerCase().includes(searchTerm);
      
      // Tag filter match
      const tagMatch = activeTags.size === 0 || 
        (prompt.tags && prompt.tags.some(tag => activeTags.has(tag)));
      
      return textMatch && tagMatch;
    });

    renderPrompts(filteredPrompts);
  }

  function renderPrompts(prompts) {
    promptsContainer.innerHTML = '';
    
    if (prompts.length === 0) {
      promptsContainer.innerHTML = '<div class="no-results">No prompts found</div>';
      return;
    }

    prompts.forEach(prompt => {
      const promptCard = document.createElement('div');
      promptCard.className = 'prompt-card';
      
      // Create header container for positioning
      const headerContainer = document.createElement('div');
      headerContainer.className = 'prompt-header';
      
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-btn';
      copyButton.innerHTML = `
        <span class="copy-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4.5C2 3.67157 2.67157 3 3.5 3H8.5C9.32843 3 10 3.67157 10 4.5V4.5C10 4.77614 9.77614 5 9.5 5H3.5C3.22386 5 3 4.77614 3 4.5V4.5Z" fill="currentColor"/>
            <path d="M2 6.5C2 6.22386 2.22386 6 2.5 6H9.5C9.77614 6 10 6.22386 10 6.5V6.5C10 6.77614 9.77614 7 9.5 7H2.5C2.22386 7 2 6.77614 2 6.5V6.5Z" fill="currentColor"/>
            <path d="M2.5 8C2.22386 8 2 8.22386 2 8.5C2 8.77614 2.22386 9 2.5 9H9.5C9.77614 9 10 8.77614 10 8.5C10 8.22386 9.77614 8 9.5 8H2.5Z" fill="currentColor"/>
            <path d="M2 10.5C2 10.2239 2.22386 10 2.5 10H9.5C9.77614 10 10 10.2239 10 10.5C10 10.7761 9.77614 11 9.5 11H2.5C2.22386 11 2 10.7761 2 10.5Z" fill="currentColor"/>
          </svg>
        </span>
        <span class="check-icon" style="display: none;">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" fill="currentColor"/>
          </svg>
        </span>
      `;

      let copying = false;
      copyButton.addEventListener('click', async () => {
        if (copying) return;
        copying = true;

        try {
          await navigator.clipboard.writeText(prompt.text);
          const copyIcon = copyButton.querySelector('.copy-icon');
          const checkIcon = copyButton.querySelector('.check-icon');
          
          copyIcon.style.display = 'none';
          checkIcon.style.display = 'block';
          copyButton.classList.add('copied');
          
          setTimeout(() => {
            copyIcon.style.display = 'block';
            checkIcon.style.display = 'none';
            copyButton.classList.remove('copied');
            copying = false;
          }, 1500);
        } catch (err) {
          console.error('Failed to copy text:', err);
          copying = false;
        }
      });
      
      headerContainer.appendChild(copyButton);
      promptCard.appendChild(headerContainer);
      
      const promptText = document.createElement('div');
      promptText.className = 'prompt-text';
      promptText.textContent = prompt.text;
      
      const promptTags = document.createElement('div');
      promptTags.className = 'prompt-tags';
      if (prompt.tags) {
        prompt.tags.forEach(tag => {
          const tagSpan = document.createElement('span');
          tagSpan.className = 'prompt-tag';
          tagSpan.textContent = tag;
          promptTags.appendChild(tagSpan);
        });
      }
      
      promptCard.appendChild(promptText);
      promptCard.appendChild(promptTags);
      promptsContainer.appendChild(promptCard);
    });
}

  function convertToRawUrl(repoUrl) {
    return repoUrl
      .replace('github.com', 'raw.githubusercontent.com')
      .replace('/blob/', '/');
  }


  fetchPrompts(variables.promptsDataEndpoint);
});
