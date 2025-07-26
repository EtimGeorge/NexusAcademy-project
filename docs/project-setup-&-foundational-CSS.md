Generated code
### **Document 4: Project Setup & Foundational CSS**
This document provides the exact initial steps and code to set up the project structure and styling foundation in your IDE (e.g., VS Code).

```markdown
# Project Setup & Foundational CSS
## Nexus Academy - Version 1.0

**Author:** AI CPO/CTO
**Purpose:** To create the initial file structure, HTML shell, and global CSS required to begin development.

---

### 1. Instructions: Initial Project Setup

1.  **Create the Project Folder:** Open your terminal or file explorer and create a new folder for the project.
    ```bash
    mkdir nexus-academy
    cd nexus-academy
    ```
2.  **Create the File Structure:** In your IDE (VS Code), create the following folders and files. This matches the component architecture from the UI/UX document.
    ```
    /nexus-academy
    |-- index.html
    |-- /src
    |   |-- /assets
    |   |   |-- /images
    |   |-- /components
    |   |-- /pages
    |   |-- /services
    |   |-- app.js
    |   |-- style.css
    |   |-- reset.css
    ```
3.  **Open in VS Code:** If you haven't already, open the `nexus-academy` folder in your IDE.
    ```bash
    code .
    ```

### 2. Code: `index.html` (The Application Shell)
This is the single HTML file that will be served. All other "pages" will be dynamically loaded into the `<main id="root"></main>` element by our JavaScript router.

*   **Location:** `/index.html`
*   