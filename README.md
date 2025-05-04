<p align="center">
  <img src="assets/logo.png" alt="icon-sync" height=300 />
</p>
Simplify your design-to-development workflow by seamlessly integrating Figma with GitHub, ensuring Figma remains your single source of truth.

## 1. Introduction
`icon-sync` is a powerful tool designed to bridge the gap between design and development. 
It enables effortless synchronization of icon assets from Figma directly into a GitHub repository. 
With minimal setup and a highly intuitive workflow, `icon-sync` ensures that design assets remain version-controlled, up-to-date, and accessible to the entire product team.

## 2. Why icon-sync?
Managing design assets—especially icons—can become chaotic across growing teams and projects. 
Designers work in Figma, while developers often rely on versioned assets stored in GitHub. This disconnect can lead to:

- Outdated assets being used in production.
- Manual, error-prone handoffs.
- Lack of traceability in design changes.

`icon-sync` solves these issues by automating the synchronization of icons from Figma to GitHub, removing the need for repetitive manual exports and uploads. 
It aligns the design and engineering workflows and helps establish Figma as the canonical source for icon assets.

## 3. Features
- 🎯 **One-Click GitHub Integration**
  Push your icons from Figma to GitHub in a single action. No more file downloads or commit commands.

- 🧠 **Smart Change Detection**
  Only changed or new icons are processed, ensuring minimal diffs and cleaner version history.

- 🔁 **Automated Pull Request Generation**
  Every sync automatically generates a pull request containing updated icons and metadata, complete with commit messages and diffs.

## 4. Installation & Configuration
> ⚙️ Prerequisites:
>
> * Install `icon-sync` Figma plugin
> * A GitHub access token 

### Step 1: Install the Plugin
Install the `icon-sync` Figma plugin from the Figma community.

### Step 2: GitHub Access Token Setup

To use `icon-sync`, you must provide a **GitHub Access Token**. There are two options depending on your preference and security requirements:

#### Option 1: Personal Access Token (Classic)
If you're using a **Personal Access Token**, make sure to grant the **repo**.

> ⚠️ This approach is simple but grants **broad access** to your repositories. Use with caution if you have sensitive data or multiple repositories under the same account.

#### Option 2: Fine-Grained Personal Access Token (Recommended)
If you're using a **Fine-Grained Access Token**, you'll need to specify **individual repository permissions**. Make sure to select the following:

- **Contents** → `Read and write`
  Allows access to files and blobs in the repository, which is required for uploading icons.

- **Metadata** → `Read-only`
  Allows the plugin to retrieve basic repository information.

- **Pull Requests** → `Read and write`
  Enables the plugin to automatically create and update pull requests.

## 5. Usage
Once installed and configured, using `icon-sync` is straightforward.

### Step 1: Environment Setup
After launching the `icon-sync` plugin, navigate to the **GitHub** tab.

You’ll see several input fields you need to fill out:
- **Owner** – your GitHub username or organization name
- **API Key** – your GitHub access token
- **Main Branch Name** – usually `main` or `master`
- **Compare Branch Name** – a branch to create for the pull request (e.g., `icon/update`)
- **Repository Name** – the target GitHub repository
- **Store Path** – the directory in the repo where icons should be stored (e.g., `icons/`)

Once you complete these fields, you’re ready to import icons.

> Note: These settings are saved locally after the first setup, so you won’t need to re-enter them every time you open the plugin.

### Step 2: Import Icons from Figma
You have **two options** to import icons from your Figma file:

#### Option 1: Auto-Import from Current Page
As soon as the plugin launches, it will automatically scan the **current Figma page** and import all icons that are structured as components.

#### Option 2: Frame-Based Import
Alternatively, you can:

1. Create a Frame in your Figma file.
2. Select the Frame.
3. Click the **"Import Icons"** button in the plugin.

This will import only the icons **within the selected Frame**.

### Step 3: Deploy to GitHub
Once you've finished both steps above, you're ready to **deploy** your icons to GitHub.

- Click the **Deploy** button to start the upload process.
- `icon-sync` will automatically commit the icons and open a pull request in your repository.
- After deployment, a **"Go to GitHub"** button will appear. Click it to jump directly to the pull request and review the changes.

## 6. License

[License](./LICENSE)
