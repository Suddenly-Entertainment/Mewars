#!/bin/bash
httpd -d ~/lib/httpd -c "Listen $IP:$PORT" -c "DocumentRoot $HOME/$C9_PID/resources" -X

# re-dev@decisive-media.net 
