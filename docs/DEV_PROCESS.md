# Development Process Documentation

## Table of Contents
1. [Repository Architecture](#repository-architecture)
2. [Branching / Workflow Model](#branching--workflow-model)
3. [Code Development & Review Policy](#code-development--review-policy)



## Repository Architecture

### Overview

This repository follows a full-stack architecture pattern with a React Native/Expo frontend and an AWS serverless backend. The backend infrastructure is defined using Infrastructure as Code (IaC) templates, and the project is organized to support both frontend and backend development workflows.

### Repository Structure

```
Stride/
├── .gitignore
├── README.md                        # Entry point documentation
├── aws_resources/                   # Backend Infrastructure & Logic
│   ├── app.py                       # AWS CDK App Entry Point (Python)
│   ├── cdk.json                     # CDK Context & Config
│   ├── requirements.txt             # Python Dependencies (CDK)
│   ├── source.bat                   # Environment setup script
│   ├── backend/                     # Business Logic (Lambda Functions)
│   │   ├── build.gradle.kts         # Kotlin Build Configuration
│   │   ├── settings.gradle.kts
│   │   └── src/main/kotlin/
│   │       └── com/handler/
│   │           └── Handler.kt       # Lambda Handler Entry Point
│   ├── cdk/                         # Infrastructure Definitions
│   │   └── cdk_stack.py             # Main CloudFormation Stack Definition
│   ├── schema_initializer/          # Database Migration/Setup
│   │   ├── handler.py
│   │   └── verify_db_init.py
│   └── tests/                       # Infrastructure Tests
│       └── unit/
│           └── test_cdk_stack.py
├── docs/                            # Project Documentation
│   ├── BackendSetup.md
│   ├── FrontendSetup.md
│   ├── Design_Document.pdf
│   └── DEV_PROCESS.md
└── frontend/                        # Mobile Application (React Native/Expo)
    ├── app.json                     # Expo Configuration
    ├── package.json                 # JS Dependencies
    ├── tsconfig.json                # TypeScript Configuration
    ├── app/                         # Application Screens & Routing
    │   ├── _layout.tsx              # Root Layout & Navigation Wrapper
    │   ├── index.tsx                # Home/Landing Screen
    │   ├── login.tsx                # Authentication Screen
    │   └── firebase.ts              # Firebase Configuration
    ├── assets/                      # Static Assets (Images/Fonts)
    │   └── images/
    └── .vscode/                     # Editor Settings

```

### Standards & Documentation References
#### Frontend
Our frontend is built using React Native with Expo. We follow the file structure detailed by Expo Router for organizing screens and navigation. For more information, refer to the [Expo Router Documentation](https://docs.expo.dev/router/introduction/).

#### Backend
The backend infrastructure is created using AWS CDK in Python with the core backend lambda handler created in Kotlin to achieve better runtime performance. 
We follow the best practices for AWS CDK projects as outlined in their [documentation](https://docs.aws.amazon.com/cdk/v2/guide/best-practices.html)


## Branching Strategy

This project uses a **Feature Branch Workflow** with a single main integration branch. All feature development occurs in dedicated branches that are linked to GitHub project issues.

### Main Branches

#### `main`
- **Purpose**: Production-ready code and stable releases
- **Protection**: Protected branch requiring PR approval and CI/CD checks
- **Merge Policy**: Only via Pull Requests that pass all checks
- **Deployment**: Automatically deployed to production/staging environments

### Branch Naming Convention

All feature branches must follow this naming pattern:

```
issue-[issue-number]-[short-description]
```

**Examples:**
- `issue-123-add-image-upload`
- `issue-456-implement-api-authentication`
- `issue-89-fix-camera-permissions`


### Workflow Process

1. **Issue Creation**
   - Create a GitHub issue describing the feature or bug fix
   - Assign issue to appropriate team member
   - Label appropriately (feature, bug, enhancement, etc.)

2. **Branch Creation**
   - Create a feature branch from `main`: `git checkout -b feature/[issue-number]-[description]`
   - Link branch to GitHub issue in PR description using: `Closes #123` or `Fixes #123`

3. **Development**
   - Make commits with clear, descriptive messages
   - Push branch to remote repository
   - Keep branch up-to-date with `main` by rebasing or merging

4. **Pull Request**
   - Create Pull Request targeting `main`
   - Reference the GitHub issue in PR title/description
   - Assign a reviewer (required)
   - Wait for CI/CD checks to pass
   - Address review feedback

5. **Merge**
   - After approval and passing CI/CD, merge via "Squash and Merge" or "Rebase and Merge"
   - Delete feature branch after merge




## Code Development & Review Policy

### Pull Request Requirements

All code changes must go through a Pull Request (PR) process before merging into `main`.

#### PR Creation Checklist

- [ ] Branch is named according to convention: `issue-[issue-number]-[description]`
- [ ] Branch is linked to a GitHub issue
- [ ] Code follows project style guidelines
- [ ] Tests are added/updated for new functionality
- [ ] All existing tests pass
- [ ] Documentation is updated if needed
- [ ] PR description includes:
  - Summary of changes
  - Reference to related issue (`Closes #123`)
  - Testing instructions (if applicable)
  - Screenshots (for UI changes)

### Code Review Process

#### Reviewer Assignment

- **Required**: Every PR must have at least one assigned reviewer
- **Assignment**: 
  - Automatically assigned based on code ownership (CODEOWNERS file)
  - Manually assigned by PR creator
  - Rotated among team members for fairness
- **Timeline**: Reviewers should respond within 24-48 hours

#### Review Criteria

Reviewers should check for:

1. **Functionality**
   - Code solves the stated problem
   - Edge cases are handled
   - No obvious bugs or logic errors

2. **Code Quality**
   - Follows project coding standards
   - Proper error handling
   - No code duplication
   - Appropriate comments and documentation

3. **Testing**
   - Adequate test coverage
   - Tests are meaningful and pass
   - Integration tests updated if needed

4. **Architecture**
   - Follows project architecture patterns
   - No unnecessary dependencies
   - Proper separation of concerns

5. **Security**
   - No sensitive data exposed
   - Input validation where appropriate
   - Follows security best practices

#### Review Feedback

- **Approval**: Reviewer approves PR when satisfied
- **Request Changes**: Reviewer requests changes with specific comments
- **Comments**: Use GitHub's review feature for line-by-line feedback
- **Discussion**: Use PR comments for questions and clarifications


#### Code Review Frequency

- **Daily Reviews**: Team members should review PRs daily
- **Response Time**: Aim for 24-48 hour review turnaround
- **Batch Reviews**: Review multiple related PRs together when possible

#### Branch Maintenance

- **Keep Updated**: Regularly rebase/merge `main` into feature branches
- **Clean Up**: Delete merged branches promptly
- **Naming**: Use descriptive branch names that indicate purpose



## Additional Resources

- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [AWS SAM Documentation](https://docs.aws.amazon.com/serverless-application-model/)
- [Expo Documentation](https://docs.expo.dev/)

---

**Document Version**: 1.0  
**Last Updated**: 2026 \
**Maintained By**: Stride Development Team

