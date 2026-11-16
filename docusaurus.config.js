// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {latteTheme, frappeTheme} from './src/theme/prism-catppuccin.js';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// KEVlar isn't exposed to the internet yet, so its tab points at the local
// instance during `npm start` and is left out of production builds. Once it
// has a public address, build with KEVLAR_URL=https://... to include it.
const kevlarUrl =
  process.env.KEVLAR_URL ||
  (process.env.NODE_ENV === 'production' ? null : 'http://localhost:3100');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'pikaroot',
  tagline: 'Offensive security notes, CTF writeups and a daily sudoku.',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // .md files are plain CommonMark (so `{` and `<` in writeups are safe);
  // .mdx files keep full MDX.
  markdown: {
    format: 'detect',
  },

  // Page-to-page transition on client-side navigation
  clientModules: ['./src/clientModules/routeTransition.js'],

  // Runs before first paint: the landing-page intro plays once per session,
  // so returning visitors never see it flash.
  headTags: [
    // Sharp vector tab icon for modern browsers (favicon.ico stays as fallback)
    {
      tagName: 'link',
      attributes: {rel: 'icon', type: 'image/svg+xml', href: '/img/logo.svg'},
    },
    // Home-screen icon on iOS / iPadOS
    {
      tagName: 'link',
      attributes: {rel: 'apple-touch-icon', href: '/img/apple-touch-icon.png'},
    },
    {
      tagName: 'script',
      attributes: {},
      innerHTML:
        "try{if(sessionStorage.getItem('pk-intro'))document.documentElement.setAttribute('data-intro-seen','')}catch(e){}",
    },
  ],

  plugins: [
    // Feeds the landing page with the CTF writeups and blog posts
    './plugins/site-index.js',
    [
      // Second docs instance for /ctfs, laid out like the /docs tutorial
      '@docusaurus/plugin-content-docs',
      {
        id: 'ctfs',
        path: 'ctfs',
        routeBasePath: 'ctfs',
        sidebarPath: './sidebarsCtfs.js',
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      },
    ],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  customFields: {
    // Mixed into the daily sudoku seed. Override with the SUDOKU_SALT env var.
    sudokuSalt: process.env.SUDOKU_SALT || '0a8ff07369345956f761178c4b60d1cedbbc03db2c31b465',
  },

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'pikaroot',
        logo: {
          alt: 'pikaroot Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'ctfsSidebar',
            docsPluginId: 'ctfs',
            position: 'left',
            label: 'CTFs',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {to: '/sudoku', label: 'Sudoku', position: 'left'},
          ...(kevlarUrl ? [{href: kevlarUrl, label: 'KEVlar', position: 'left'}] : []),
          {to: '/about', label: 'About', position: 'right'},
          {
            href: 'https://github.com/pikaroot',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Explore',
            items: [
              {label: 'CTF Writeups', to: '/ctfs'},
              {label: 'Blog', to: '/blog'},
              {label: 'Daily Sudoku', to: '/sudoku'},
              {label: 'About', to: '/about'},
            ],
          },
          {
            title: 'Browse',
            items: [
              {label: 'Writeups by tag', to: '/ctfs/tags'},
              {label: 'Posts by tag', to: '/blog/tags'},
              {label: 'Blog archive', to: '/blog/archive'},
              // pathname:// marks a static file (not a page route) for the link checker
              {label: 'RSS feed', href: 'pathname:///blog/rss.xml'},
            ],
          },
          {
            title: 'Connect',
            items: [
              {label: 'LinkedIn', href: 'https://www.linkedin.com/in/limweixun/'},
              {label: 'GitHub', href: 'https://github.com/pikaroot'},
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} pikaroot · Built with Docusaurus.`,
      },
      prism: {
        theme: latteTheme,
        darkTheme: frappeTheme,
        additionalLanguages: ['php'],
      },
    }),
};

export default config;
