# Linux Commands Cheatsheet

## Basic Navigation & File Management

-   `ls` — list directory contents
-   `ls -la` — detailed list including hidden files
-   `cd /path/to/folder` — change directory
-   `pwd` — print working directory
-   `mkdir foldername` — create directory
-   `rm file` — delete file
-   `rm -r folder` — delete folder recursively
-   `cp source dest` — copy file/folder
-   `mv source dest` — move/rename file/folder
-   `cat file` — print file content
-   `less file` — scrollable file viewer
-   `head -n 10 file` — show first 10 lines
-   `tail -n 10 file` — show last 10 lines
-   `tail -f file` — live update (good for logs)

## File Permissions & Ownership

-   `chmod 644 file` — change file permissions
-   `chmod +x file` — make file executable
-   `chown user:group file` — change owner and group
-   `ls -l` — show permissions and ownership

## Process & System Monitoring

-   `ps aux` — show running processes
-   `top` or `htop` — interactive process viewer (htop better if installed)
-   `kill PID` — terminate process by PID
-   `kill -9 PID` — force kill process
-   `df -h` — disk space usage
-   `free -m` — memory usage
-   `uptime` — system uptime and load

## Networking

-   `ip a` or `ifconfig` — show network interfaces
-   `ping example.com` — check connectivity
-   `curl http://url` — fetch URL content (also test endpoints)
-   `netstat -tulpn` — list open ports and services (sudo for process info)
-   `ss -tulpn` — modern alternative to netstat

## Package Management (Ubuntu/Debian)

-   `sudo apt update` — refresh package lists
-   `sudo apt upgrade` — upgrade installed packages
-   `sudo apt install package_name` — install package
-   `sudo apt remove package_name` — remove package

## Systemctl / Services

-   `sudo systemctl status service` — check service status
-   `sudo systemctl start service` — start service
-   `sudo systemctl stop service` — stop service
-   `sudo systemctl restart service` — restart service
-   `sudo systemctl enable service` — enable service on boot
-   `sudo systemctl disable service` — disable service on boot

## Editing Files

-   `vim filename` — open file with vim
-   `nano filename` — simple terminal editor
-   `sudo nano /etc/nginx/nginx.conf` — edit config with root permissions

## Git

-   `git status` — see changes
-   `git add file` — stage file
-   `git commit -m "message"` — commit changes
-   `git pull origin branch` — pull updates
-   `git push origin branch` — push changes

## Miscellaneous

-   `history` — show command history
-   `clear` — clear terminal screen
-   `whoami` — show current user
-   `sudo !!` — repeat last command with sudo
