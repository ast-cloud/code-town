An online coding platform created in Next.js. The project contains 2 main next.js apps for user side and admin side. Users can view and solve problems in 4 languages (C, C++, Java, Python).
For submitting a solution, user's code is sent to another component called CodeRunner (https://github.com/ast-cloud/code-runner), which is a simple express server running in a dockerised environment in an AWS EC2 instance.

A monorepo (Turborepo) is used to host both the apps in a single repository.

React state management library used - Recoil

Typescript is used as the primary language.

User side app - Cookie based authentication is implemented using next-auth library.

Admin side app - Localstorage is used for storing JWT session tokens for authentication.

UI library - React MUI

Fully responsive using Flexbox and MediaQueries.

Database - MongoDB

Axios library is used as an HTTP client to make REST API calls.

Deployed at Vercel -

Admin app - https://code-town-admin.vercel.app/

User side - https://code-town-users.vercel.app/