# NodeJS-EC2-Boilerplate

This repo will be a copy pasta awesomesauce for any new EC2 project. The settings are a good start to not only lint code, but provide a nice workflow with npm.

## Prerequisites

- This application will be deployed to an EC2 instance.
- NodeJS 14.x.x installed and globally available within a shell instance.
- Environment Software

```bash
apt update
apt install cron systemctl

# apt install nano
# Editing crontab requires a text editor. This may not be needed, if a text editor already exists.

systemctl enable cron
```

## Deployment

Unzip the [latest release](./Deployment/releases/latest.zip) to the directory where the application will exist. Open a shell and run this command in the folder where the application is.

```
npm install --production
```

### Application Config

In the root directory where the application, create a file named: `.env`. Use this file to set values on `process.env`. Here's an example:

```
NODE_ENV=DEV
PORT=3001
```

### Cron Job

Set up the application to run as a cron job using the `crontab -e` command from a shell. Add the configuration below.

```bash
# https://cron.help/

0 1 * * * node <PATH_TO_APPLICATION>/index.js
```

After saving the cron definition file, start the `cron` service.

```bash
systemctl start cron
```

### Create Release

Download the repo and install all of the dependencies with `npm install`. Once the code is ready to create a new release, run these commands.

```
npm run build
npm run release
```

The `build` command will use Typescript to transpile the [`./src`](./src) directory into the `./dist` directory and copy the [`./package.json`](./package.json) and [`./package-lock.json`](./package-lock.json). The `release` command will zip the `dist` directory into 2 .zip files in the [`./Deployment/releases`](./Deployment/releases) directory. One zip will always be named [`latest.zip`](./Deployment/releases/latest.zip) and the other will match the `version` within the [`package.json`](./package.json) with a prefix of "v". e.g. v1.0.0.zip
