# How to Kill Running Apps on Specific Ports

## Overview
This guide provides various methods to kill applications running on specific ports, particularly useful when developing with Node.js, NestJS, or other web applications.

## Quick Reference Commands

### Kill by Port Number (Most Effective)
```bash
# Kill any process running on port 3001
lsof -ti:3001 | xargs kill -9

# Kill any process running on port 3000 (common for React apps)
lsof -ti:3000 | xargs kill -9

# Kill any process running on any port
lsof -ti:PORT_NUMBER | xargs kill -9
```

### Kill by Process Name
```bash
# Kill NestJS development server
pkill -f "npm run start:dev"

# Kill Node.js processes
pkill -f node

# Kill specific npm scripts
pkill -f "nest start"
```

## Detailed Methods

### 1. Kill by Port (Recommended)
This is the most reliable method when you know the port number:

```bash
# Find and kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

**Explanation:**
- `lsof -ti:3001` - Lists process IDs using port 3001
- `xargs kill -9` - Passes the PIDs to kill command with force flag

### 2. Find Process First, Then Kill
If you want to see what's running before killing:

```bash
# Find what's running on port 3001
lsof -i:3001

# Alternative method
netstat -tulpn | grep :3001

# Kill by specific PID (replace 12345 with actual PID)
kill -9 12345
```

### 3. Kill by Process Pattern
When you know the application type:

```bash
# Kill NestJS development server
pkill -f "npm run start:dev"

# Kill any Node.js process
pkill -f node

# Kill React development server
pkill -f "react-scripts start"

# Kill Express/Node apps
pkill -f "node.*server"
```

### 4. Nuclear Options (Use with Caution)
These will kill ALL instances of the process type:

```bash
# Kill ALL Node.js processes
killall node

# Kill ALL npm processes
killall npm

# Kill ALL processes with "node" in the name
pkill node
```

## Verification Commands

### Check if Port is Free
```bash
# Check if port 3001 is still in use
netstat -tulpn | grep :3001

# Alternative method
lsof -i:3001

# If nothing is returned, the port is free
```

### List All Node.js Processes
```bash
# See all running Node.js processes
ps aux | grep node

# See processes using specific ports
lsof -i:3001,3000,8080
```

## Common Scenarios

### Development Server Won't Start
```bash
# Error: "Port 3001 is already in use"
lsof -ti:3001 | xargs kill -9

# Then restart your server
npm run start:dev
```

### Multiple Node Processes Running
```bash
# See all Node processes with details
ps aux | grep node

# Kill specific ones by PID
kill -9 PID1 PID2 PID3

# Or kill all Node processes
pkill node
```

### Stuck Background Processes
```bash
# Find background Node processes
jobs

# Kill background job (replace %1 with job number)
kill %1

# Force kill if needed
kill -9 %1
```

## Shell-Specific Commands (Zsh)

### Zsh Functions (Add to ~/.zshrc)
```bash
# Function to kill process on specific port
killport() {
    if [ $# -eq 0 ]; then
        echo "Usage: killport <port_number>"
        return 1
    fi
    lsof -ti:$1 | xargs kill -9
    echo "Killed processes on port $1"
}

# Function to check what's running on a port
checkport() {
    if [ $# -eq 0 ]; then
        echo "Usage: checkport <port_number>"
        return 1
    fi
    lsof -i:$1
}
```

### Usage Examples
```bash
# After adding functions to ~/.zshrc and reloading
source ~/.zshrc

# Kill process on port 3001
killport 3001

# Check what's running on port 3000
checkport 3000
```

## Troubleshooting

### Permission Denied
```bash
# If you get permission denied, try with sudo
sudo lsof -ti:3001 | xargs sudo kill -9

# Or find the process owner
lsof -i:3001
```

### Process Won't Die
```bash
# Use SIGKILL (force kill)
kill -9 PID

# If still running, it might be a system process
sudo kill -9 PID
```

### Can't Find Process
```bash
# Check if it's running under different user
sudo lsof -i:3001

# Check all listening ports
netstat -tulpn
```

## Best Practices

1. **Always check what you're killing first:**
   ```bash
   lsof -i:3001  # See what's running
   lsof -ti:3001 | xargs kill -9  # Then kill it
   ```

2. **Use graceful shutdown first:**
   ```bash
   # Try graceful shutdown first
   kill PID
   
   # If it doesn't work, then force kill
   kill -9 PID
   ```

3. **Verify the port is free:**
   ```bash
   netstat -tulpn | grep :3001
   ```

4. **For development, create aliases:**
   ```bash
   # Add to ~/.zshrc
   alias kill3001="lsof -ti:3001 | xargs kill -9"
   alias kill3000="lsof -ti:3000 | xargs kill -9"
   ```

## Common Error Messages

| Error | Solution |
|-------|----------|
| `EADDRINUSE: address already in use :::3001` | `lsof -ti:3001 \| xargs kill -9` |
| `Port 3001 is already in use` | `lsof -ti:3001 \| xargs kill -9` |
| `listen EADDRINUSE: address already in use` | `lsof -ti:PORT \| xargs kill -9` |
| `Error: Process already running` | `pkill -f "npm run start:dev"` |

## Related Commands

```bash
# See all open files and network connections
lsof

# See network statistics
netstat -tulpn

# See running processes
ps aux

# See processes tree
pstree

# Monitor real-time processes
top
htop
```

---

**Note:** Always be careful when killing processes, especially with `kill -9` (force kill) as it doesn't allow the process to clean up properly. Use graceful shutdown (`kill PID`) when possible.
