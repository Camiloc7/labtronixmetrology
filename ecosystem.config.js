module.exports = {
  apps: [
    {
      name: 'labtronix-backend',
      script: './dist/main.js',
      cwd: './backend',
      env: {
        NODE_ENV: 'production',
      },
      max_memory_restart: '512M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      merge_logs: true,
      max_restarts: 10,
      restart_delay: 5000,
    },
    {
      name: 'labtronix-frontend',
      script: 'npm',
      args: 'run start',
      cwd: './frontend',
      env: {
        NODE_ENV: 'production',
      },
      max_memory_restart: '384M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      merge_logs: true,
      max_restarts: 10,
      restart_delay: 5000,
    }
  ]
};
