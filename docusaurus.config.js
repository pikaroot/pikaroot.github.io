// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {latteTheme, frappeTheme} from './src/theme/prism-catppuccin.js';
import {KEVLAR_URL} from './src/data/projects.js';
import {createRedirects} from './redirects.js';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// KEVlar is public (homelab, via Tailscale Funnel). Override with KEVLAR_URL=...
const kevlarUrl = process.env.KEVLAR_URL || KEVLAR_URL;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'pikaroot',
  tagline: 'Offensive security notes, CTF writeups and a daily sudoku.',
  favicon: 'img/favicon.ico?v=2',  // bump ?v= when the icon changes (browsers cache favicons hard)

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://pikaroot.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'pikaroot',
  projectName: 'pikaroot.github.io',

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
  clientModules: ['./src/clientModules/routeTransition.js', './src/clientModules/pageViews.js'],

  // Runs before first paint: the landing-page intro plays once per session,
  // so returning visitors never see it flash.
  headTags: [
    // Sharp vector tab icon for modern browsers (favicon.ico stays as fallback)
    {
      tagName: 'link',
      attributes: {rel: 'icon', type: 'image/svg+xml', href: '/img/logo.svg?v=2'},
    },
    // Home-screen icon on iOS / iPadOS
    {
      tagName: 'link',
      attributes: {rel: 'apple-touch-icon', href: '/img/apple-touch-icon.png?v=2'},
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
    // Keep old Jekyll URLs (pikaroot.github.io before Nov 2026) working
    ['@docusaurus/plugin-client-redirects', {createRedirects}],
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
        docs: false, // only the /ctfs docs instance is used
        blog: {
          showReadingTime: true,
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
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
        copyright: `Copyright © ${new Date().getFullYear()} pikaroot · Code MIT · Content <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a> · Built with Docusaurus.`,
      },
      prism: {
        theme: latteTheme,
        darkTheme: frappeTheme,
        additionalLanguages: ['php'],
      },
    }),
};

export default config;
