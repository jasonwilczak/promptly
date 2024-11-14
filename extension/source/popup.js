document.addEventListener('DOMContentLoaded', function() {
  const repoUrlInput = document.getElementById('repo-url');
  const saveButton = document.getElementById('save-settings');
  const searchInput = document.getElementById('search-input');
  const tagsContainer = document.getElementById('tags-container');
  const promptsContainer = document.getElementById('prompts-container');
  
  let allPrompts = [];
  let activeTags = new Set();

  // Load saved repository URL
  chrome.storage.sync.get(['repoUrl'], function(result) {
    if (result.repoUrl) {
      repoUrlInput.value = result.repoUrl;
      fetchPrompts(result.repoUrl);
    }
  });

  // Save repository URL
  saveButton.addEventListener('click', function() {
    const repoUrl = repoUrlInput.value;
    chrome.storage.sync.set({ repoUrl: repoUrl }, function() {
      fetchPrompts(repoUrl);
    });
  });

  // Search input handler
  searchInput.addEventListener('input', filterPrompts);

  async function fetchPrompts(repoUrl) {
    try {
      const rawUrl = convertToRawUrl(repoUrl);
      const response = await fetch(rawUrl);
      const data = await response.json();
      
      allPrompts = data.prompts;
      
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
      filterPrompts();
    } catch (error) {
      promptsContainer.innerHTML = `<p style="color: red;">Error fetching prompts: ${error.message}</p>`;
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
      
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-btn';
      copyButton.textContent = 'Copy';
      copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(prompt.text);
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
          copyButton.textContent = 'Copy';
        }, 1500);
      });
      
      promptCard.appendChild(promptText);
      promptCard.appendChild(promptTags);
      promptCard.appendChild(copyButton);
      promptsContainer.appendChild(promptCard);
    });
  }

  function convertToRawUrl(repoUrl) {
    return repoUrl
      .replace('github.com', 'raw.githubusercontent.com')
      .replace('/blob/', '/');
  }
});
