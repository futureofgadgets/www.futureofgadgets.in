module.exports = {
  apps: [{
    name: 'future-of-gadgets',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env_file: '.env',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
