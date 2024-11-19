# LLM Prompts Chrome Extension

A Chrome extension that provides easy access to LLM (Large Language Model) prompts stored in a GitHub repository. Features include real-time search, tag filtering, and easy copying of prompts.


## Features

- 🔍 **Real-time Search**: Instantly filter prompts as you type
- 🏷️ **Tag Filtering**: Filter prompts by clicking on tags
- 📋 **One-Click Copy**: Easily copy prompts to your clipboard
- 🎯 **Combined Filtering**: Use both search and tags simultaneously
- 📱 **Responsive Design**: Clean, user-friendly interface
- ⚡ **Fast Loading**: Efficient prompt loading and filtering

## Installation


### From Store
1. Go to Chrome Web Store
2. Search for `promptly`
3. Install and use as normal

### From Source
1. Clone this repository:
   ```bash
   git clone https://github.com/jasonwilczak/promptly.git
   ```
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the extension directory

## Usage

1. Click the extension icon in your Chrome toolbar
4. Use the search bar to filter prompts by text
5. Click tags to filter prompts by category
6. Click "Copy" on any prompt to copy it to your clipboard

## Repository Structure

```
├── manifest.json
├── popup.html
├── popup.js
├── icon48.png
└── icon128.png
```

## Prompt JSON Structure

Create a `prompts.json` file in your GitHub repository with the following structure:

```json
{
  "prompts": [
    {
      "text": "Your prompt text here",
      "tags": ["tag1", "tag2", "tag3"]
    }
  ]
}
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/my-new-feature
   ```
3. Make your changes
4. Write or update tests if necessary
5. Run tests if available
6. Commit your changes:
   ```bash
   git commit -am 'Add some feature'
   ```
7. Push to the branch:
   ```bash
   git push origin feature/my-new-feature
   ```
8. Create a Pull Request

### Code Style Guidelines

- Use consistent indentation (2 spaces)
- Follow JavaScript ES6+ conventions
- Add comments for complex logic
- Use meaningful variable and function names
- Keep functions small and focused
- Write clean, maintainable code

### Commit Message Guidelines

- Use clear, descriptive commit messages
- Start with a verb in present tense
- Keep the first line under 50 characters
- Add details in the commit body if necessary
- Reference issues when applicable

Example:
```
Add tag filtering functionality

- Implement tag toggle mechanism
- Add active state styling for tags
- Update prompt filtering logic
Fixes #123
```

## Feature Requests and Bug Reports

- Use the GitHub Issues tab to report bugs or request features
- Include clear descriptions and steps to reproduce for bugs
- For feature requests, explain the use case and expected behavior

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icon designs from claudi.ai
- Inspired by the internet

## Support

If you need help or have questions:
1. Check existing GitHub issues
2. Create a new issue with a detailed description
3. Use the "Help Wanted" tag for contribution opportunities

---

Built with ❤️ by Jason Wilczak & claude.ai 😊