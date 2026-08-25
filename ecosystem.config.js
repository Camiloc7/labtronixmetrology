module.exports = {
  apps: [
    {
      name: 'labtronix-backend',
      script: './dist/main.js',
      cwd: './backend',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'labtronix-frontend',
      script: 'npm',
      args: 'run start',
      cwd: './frontend',
      env: {
        NODE_ENV: 'production',
      },
    }
  ]
};
