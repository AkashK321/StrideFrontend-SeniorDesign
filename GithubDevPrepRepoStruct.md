# Repository File Structure
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

# Standards & Documentation References
## Frontend
Our frontend is built using React Native with Expo. We follow the file structure detailed by Expo Router for organizing screens and navigation. For more information, refer to the [Expo Router Documentation](https://docs.expo.dev/router/introduction/).

## Backend
The backend infrastructure is created using AWS CDK in Python with the core backend lambda handler created in Kotlin to achieve better runtime performance. 
We follow the best practices for AWS CDK projects as outlined in their [documentation](https://docs.aws.amazon.com/cdk/v2/guide/best-practices.html)
