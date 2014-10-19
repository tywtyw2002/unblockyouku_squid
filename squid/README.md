# Introduction

Use squid as http server in order to proxy the unblock url rules without pac. For example, the request urls like `http://example.com/hot.vrs.sohu.com/ipad2035683_4618450518293_4069455.m3u8`, the squid will covert it to real url `http://hot.vrs.sohu.com/ipad2035683_4618450518293_4069455.m3u8` and proxy it.

I really hate pac, and safair is not support proxy switch extension. However, the extension youkuhtml5player only support safair for m3u8 source of sohu. So, I just modify some url rules of youkuhtml5player, to make it player m3u8 source video without pac file.

# INSTALL

1. Generate the unblock squid dstdom\_regex with program `urls2dnsmasq.py`
2. Editing the hostname of the url redirector program
3. Configure squid with config in Section `Config` 
4. Modify `youkuhtml5player` url rules.

# Config

##Squid with parent Squid.

In this mode, the squid which as http server to get real url via other squid.

```
acl youku dstdom_regex -i "youku.dst"


http_port 80 accel vhost 
acl proxy dstdomain example.com

http_access allow proxy

redirect_program /usr/local/bin/python2.7 /usr/local/squid/libexec2/sohu_redirector.py
redirect_children 1
redirector_access allow proxy


cache_peer proxy.china  parent 80 0 no-query default 
cache_peer_access proxy.china allow youku
cache_peer_access proxy.china deny all

never_direct allow youku
```

##Squid without parent Squid.

In this mode, the squid which as http server to get real url via gre tunnel.

I donot want to talk much of how to create Gre tunnel in linux with/without gre.

For example, the tunnel ip in this side is `1.1.1.1/30`.

1. Make sure all packet with `1.1.1.1` output via tunnel.

```
ip rule add from 1.1.1.1 table 100
ip ro add default via 1.1.1.2 table 100
```

2. Configure the squid

```
acl youku dstdom_regex -i "youku.dst"

http_port 80 accel vhost 
acl proxy dstdomain example.com

http_access allow proxy

redirect_program /usr/local/bin/python2.7 /usr/local/squid/libexec2/sohu_redirector.py
redirect_children 1
redirector_access allow proxy

tcp_outgoing_address 1.1.1.1 youku   # set the source ip as 1.1.1.1 for all url which match youku.
always_direct allow youku #IMPORT! make squid allow send request directly to origin server.
```





