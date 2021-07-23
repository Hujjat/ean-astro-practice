# MindArc Astro

The purpose of the Astro Theme is to be a starting point for MindArc developers to build client-centric Shopify stores. It is not a plug and play theme where most things can be configured from the theme settings. The theme settings should be reserved for client data or anything the client would like to edit themselves with minimal risk. Design customisations such as topography and colours should be in code as this is not likely to change frequently.

This project is based off [shopify/slate](https://github.com/Shopify/slate) and [shopify/starter-theme](https://github.com/Shopify/starter-theme).

Slate is a command line tool for developing Shopify Themes. See [Slate docs](https://shopify.github.io/slate) for more information. <span style="color:#dc3545">However, we have decided to remove Slate tools and use [webpack](https://webpack.js.org/) directly.</span>

Starter Theme is the opinionated theme developed by the Shopify Themes Team for Slate projects. We will be modifying and building upon this to suit our needs.

## :warning: After cloning

### :construction: Initial setup
The following items are required before the initial git commit.

1. Create private GitHub repo for the new project

2. Setup the Shopify development store - please follow MindArc's [store URL and naming convention](https://wiki.mindarc.com.au/docs/project-setup)

3. Create private app for theme development and storefront API

4. Update `config.yml`

5. Update values in `src/js/utils/api.js`

5. Clean up new project README
- Remove section above --- _Remove above after cloning_ ---
- Fill in project information placeholders

### :octocat: Reset git

1. Remove the current git history
```
rm -rf .git
```

2. Recreate git and link to your new repo
```
git init
git remote add origin https://github.com/mindarc/<new_project>.git
```

3. Initial commit to new project

:bulb: Get the Astro version fron https://github.com/mindarc/astro/releases
```
git add .
git commit -m "Astro <version>"
git push -u origin master
```

:warning: *Created a new git repo?* Update the access to include **mindarc-development**. Do this from repo > Settings > Manage Access > Invite **mindarc/mindarc-development** team as **Admin**

### :rocket: Deploy theme

If replacing an existing theme e.g. Debut, you will need to clear the config first.

1. Do this from Shopify admin > Online Store > Theme actions > Edit code > config/settings_data.json

2. Replace content with
```
{}
```
3. Deploy theme
```
yarn install
yarn build-dev
theme deploy
```

------------------------ _Remove above after cloning_ ------------------------
# \<project> by MindArc

- DEV - <dev_url>
- PROD - <prod_url>

This project is based off [mindarc/astro](https://github.com/mindarc/astro).

## Getting started
Assumed knowledge:

- Shopify store setup for theme development
- Basic understanding of [ThemeKit](https://shopify.github.io/themekit/)
- Frontend development using Liquid, Sass and VueJS

### Tools required
- [Nodejs.org](http://nodejs.org/download/)
- [Yarn](https://yarnpkg.com/lang/en/docs/install)
- [ThemeKit](https://shopify.github.io/themekit/) - Please understand the commands and features of [ThemeKit](https://shopify.github.io/themekit/)

### Store setup

1. Add Styleguide page
2. Enable customers and payment
3. Create private app for theme development and storefront API

### Project setup

#### Install dependencies
From your project root, run:
```bash
$ yarn install
```

:warning: *Error during `yarn install`?* Try running the following and try again. More information [here](https://github.com/yarnpkg/yarn/issues/660).
```
yarn cache clean
```

#### Theme Kit
Setup `config.yml` file. See [here](https://shopify.github.io/themekit/configuration/) for instructions.

Deploy your theme to your store. See [here](https://shopify.github.io/themekit/commands/#deploy) for instructions.

:warning: *Issues while deploying your theme?* If you are replacing an existing theme with Astro, the old theme's `config/settings_data.json` should be replaced with `{}`. Do this from Shopify admin > Online Store > Theme actions > Edit code.

## Development and deployment

### Local development
Open 2 terminals from your project root and run the following in separate terminals
```
yarn watch
```
```
theme watch
```

:bulb: *Hint* `theme` commands without environment `-e` specified, defaults to `-e development`.

### Production deployment
Build the production ready assets with
```
yarn build-prod
```

Then use Theme Kit to deploy
```
theme deploy -e <env>
```

## Current library stack

(Excluding Slate Libraries)

### CSS
* [Bootstrap](https://getbootstrap.com/)

### JavaScript
* [Vue](https://vuejs.org/)
