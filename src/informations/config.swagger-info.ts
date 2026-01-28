/**
 * Contains metadata information for the Swagger documentation of the API.
 *
 * @property {string} title - The title of the application.
 * @property {string} description - A brief description of the API.
 * @property {string} docPath - The path where the API documentation can be found.
 * @property {Object} author - Information about the author of the API.
 * @property {string} author.name - The name of the author.
 * @property {string} author.email - The email address of the author.
 * @property {string} author.url - The URL to the author's website or profile.
 */
export const swaggerInfo = {
  title: 'lbm295 - Todo App',
  description:
    'Einfaches Backend für eine Todo App mit NestJS, TypeORM und SQLite',
  docPath: 'docs',
  author: {
    name: 'Louis Wenk',
    email: 'lw@hli.ch',
    url: 'https://hli.ch',
  },
} as const;
