# Semantic FAQ search API using OpenAI embeddings

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A semantic FAQ search API using OpenAI embeddings. It receives a user question, compares it against a predefined list of FAQs using vector similarity, and returns the most relevant answer.

## Project setup

```bash
$ npm install
```

## 🔐 Environment Variables (.env)

To get started, copy the example environment file and rename it:

```bash
cp .env.example .env
```

Then, open the .env file and replace the placeholder with your actual OpenAI API key:

OPENAI_API_KEY=your_openai_api_key_here

You can generate your OpenAI API key by logging into your account and visiting:

👉 https://platform.openai.com/account/api-keys

⚠️ Keep your API key secure. Never commit .env files or sensitive credentials to version control.

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Resources

-

## Stay in touch

- LinkedIn - [Édipo Juan](https://www.linkedin.com/in/edipojuan/)

## Author

| [<img src="https://avatars1.githubusercontent.com/u/9813896?v=4&s=115"><br><sub>@edipojuan</sub>](https://github.com/edipojuan) |
| :-----------------------------------------------------------------------------------------------------------------------------: |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
