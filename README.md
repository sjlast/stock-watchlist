# README

## Origin

This project originated as a take home assessment I did as part of a job application. After encountering the same concept during another job application, I decided it was a common enough project that I would remove all 
references to the original company and publish it as a portfolio project. Just like in a baking show, here's [one I prepared earlier!](https://tvtropes.org/pmwiki/pmwiki.php/Main/OneIPreparedEarlier)
Company APIs were replaced with free tier APIs from other financial data providers.

### Limitations of free APIs

Because this uses free financial data APIs, there are rate limits applied. Ideally a stock watch app would update near real time, but since this is just a portfolio project I'm not paying for the premium features.

## Description

This application was built using React with Mobx for state management and Ruby on Rails to serve up assets. External APIs are also accessed through the Rails backend to keep API tokens encrypted. They are saved encrypted in the `config/credentials.yml.enc` file.

The React app is located in the `app/javascript` directory. For those unfamiliar with a Rails + webpacker app's conventions, UI config files are found in the following locations:

- `package.json` => `/`
- `yarn.lock` => `/`
- `babel.config.js` => `/`
- `tsconfig.json` => `/`
- `webpack.config.js` => `/config/webpack`

## Assumptions

- The exercise was to build a React app, so as much logic was done in React as possible. That means user data was not persisted to a database and is only stored in browser. Clearing browser storage will permanently delete user data.
- The stock search API only returns a little over 100 results with no query, but in a real setting there could be an arbitrarily large selection of stocks to watch. Pagination was added to keep memory usage from ballooning on the end user's device.
- Only US stocks and currency are supported.

### Out of Scope

- User login
- Authenticating backend endpoints
- Error alerting

## Future Improvements

- Draggable cards to support reordering stocks
- Clear all selected stocks button

## Starting Up The App

### Manually

1. Install ruby 3.1.2. If on Mac or Linux, use your package manager to install Ruby version manager `rbenv`, then run

```bash
rbenv install 3.1.2
```

2. Install bundler

```bash
gem install bundler
```

3. Need to have PostgreSQL installed. Create the database (not actually used at the moment)

```bash
bundle exec rake db:create
bundle exec rake db:migrate
```

4. Install gems

```bash
bundle install
```

5. Install node packages. This app uses node 20 and yarn 1.22

```bash
yarn install
```

6. Compile UI assets

```bash
yarn build
```

7. Run the rails server

```bash
bundle exec rails s -p 3000
```
