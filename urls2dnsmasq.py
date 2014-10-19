#!/usr/bin/env python
# -*- coding: UTF-8 -*-
# vim:set shiftwidth=4 tabstop=4 expandtab textwidth=79:
# work with python 2.7
# Author: Landon@CosHiM <tywtyw2002@gmail.com>
# Version: 0.1 Beta
import urllib2
import re
import sys


URLS_PATH = \
'https://raw.githubusercontent.com/zhuzhuor/Unblock-Youku/master/shared/urls.js'


def parse_domain(url):
    url_rule = re.compile("http://([^:/]*)")
    ip_rule  = re.compile("^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$")
    tmp =  url_rule.search(url).group(1)
    
#filter special address
    if tmp == "*":
        tmp = ""
    #elif tmp[0] == "*":
        #tmp = tmp[1:]

#filter ip address
    if ip_rule.match(tmp):
        print "Not Domain: %s" % tmp
        tmp = ""
    return tmp


def parse_urls():
    url_db = []
    
    url_rule = re.compile("\'(http://.+?)\'")

    url = urllib2.urlopen(URLS_PATH)
#   parse urls
    for i in url.readlines():
        i = i.strip()

        #check commit
        if i[:2] == "//":
            continue
        
        if i[:1] == "\'":
           m = url_rule.match(i)
           if m:
               out = parse_domain(m.group(1))
               if out != "" and out not in url_db:
                   print "ADD URL: %s" % out
                   url_db.append(out)

    return url_db

def usage():
    
    print "%s  IP dns_out squid_out" % sys.argv[0]
    sys.exit()
    
def main():
    '''main: Main function

    Description goes here.
    '''
    #check argv first
    if len(sys.argv) != 4:
        usage()

    url_db = parse_urls()
    
    fp = open(sys.argv[2], "w")
    sfp = open(sys.argv[3], "w")
    for i in url_db:
        #*.xxx url 
        if i[:2] == "*.":
            fp.write("address=/%s/%s\n" % (i[1:], sys.argv[1]))
            sfp.write("(^|\.)%s$\n" % i[2:])
        else:
            fp.write("address=/%s/%s\n" % (i, sys.argv[1]))
            sfp.write("^%s$\n" % i)
    fp.close()
    sfp.close()


if __name__ == '__main__':
    main()

