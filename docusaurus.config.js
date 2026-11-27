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

// KEVlar is public (homelab, via Cloudflare Tunnel). Override with KEVLAR_URL=...
const kevlarUrl = process.env.KEVLAR_URL || KEVLAR_URL;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'pikaroot',
  tagline: 'Offensive security notes, CTF writeups and a daily sudoku.',
  // No `favicon:` here on purpose: the icon links live in headTags below so the
  // daily-accent script can swap them to the day's colour before first paint.

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://pikaroot.com',
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
    // Tab + home-screen icons. Green is the default; the script below swaps
    // them to logo-<accent>.svg / favicon-<accent>.ico / apple-touch-icon-<accent>.png.
    // Bump ?v= when the artwork changes (browsers cache favicons hard).
    {
      tagName: 'link',
      attributes: {rel: 'icon', href: '/img/favicon.ico?v=3', sizes: '48x48', 'data-pk-icon': '1'},
    },
    {
      tagName: 'link',
      attributes: {rel: 'icon', type: 'image/svg+xml', href: '/img/logo.svg?v=3', 'data-pk-icon': '1'},
    },
    {
      tagName: 'link',
      attributes: {rel: 'apple-touch-icon', href: '/img/apple-touch-icon.png?v=3', 'data-pk-icon': '1'},
    },
    // Daily accent colour: green -> orange -> blue -> violet, switching at the
    // visitor's local midnight. Runs before first paint (no flash). Must stay
    // after the icon links above. Preview with ?accent=orange (sticks for the
    // tab); ?accent=auto resets.
    {
      tagName: 'script',
      attributes: {},
      innerHTML:
        "(function(){var A=['green','orange','blue','violet'],a;" +
        "try{var q=new URLSearchParams(location.search).get('accent');" +
        "if(q==='auto')sessionStorage.removeItem('pk-accent');else if(A.indexOf(q)>=0)sessionStorage.setItem('pk-accent',q);" +
        "a=sessionStorage.getItem('pk-accent')}catch(e){}" +
        "if(A.indexOf(a)<0){var d=new Date();a=A[Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/864e5)%A.length]}" +
        "if(a==='green')return;document.documentElement.setAttribute('data-accent',a);" +
        "var L=document.querySelectorAll('link[data-pk-icon]');for(var i=0;i<L.length;i++)" +
        "L[i].href=L[i].getAttribute('href').replace(/(favicon|logo|apple-touch-icon)\\./,'$1-'+a+'.')})()",
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
