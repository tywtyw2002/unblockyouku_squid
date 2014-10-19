#!/usr/bin/env python
# -*- coding: UTF-8 -*-
# vim:set shiftwidth=4 tabstop=4 expandtab textwidth=79:
# work with python 2.7

import sys
import re


HOSTNAME = "youhostname"
url_reg = re.compile("^http[s]?://%s(?:\:[0-9]+)?/(.*)$" % HOSTNAME)

def modify_url(u):
    list = u.split(" ")
    url = list[0]
    
    m = url_reg.match(url)
    if m:
        return "http://%s\n" %  m.group(1)
    else:
        return "%s\n" % url

def main():


    while 1:
        l = sys.stdin.readline().strip()
        sys.stdout.write(modify_url(l))
        sys.stdout.flush()



if __name__ == '__main__':
    main()

