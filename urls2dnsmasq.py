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
    
    import argparse
    parser = argparse.ArgumentParser(description = 'Convert unblock url rules to squid\
            dstdom_regex and dnsmasq conf.')

    parser.add_argument("-s", "--squid", action='store_true', dest="squid",
            help='generate squid config')
    parser.add_argument('-d', "--dns", type=str, dest="dns",
            help='generate dnsmasq config')

    parser.add_argument("filename", metavar="FILENAME", action="store",
            type=str,  help="output filename")
    
    args = parser.parse_args()

    url_db = parse_urls()
    
    fp = open(args.filename, "w")
    #fp = open(sys.argv[2], "w")
    #sfp = open(sys.argv[3], "w")
    if args:
        for i in url_db:
            #*.xxx url 
            if i[:2] == "*.":
                fp.write("(^|\.)%s$\n" % i[2:])
            else:
                fp.write("^%s$\n" % i)
    else:
        for i in url_db:
            if i[:2] == "*.":
                fp.write("address=/%s/%s\n" % (i[1:], args.dns))
            else:
                fp.write("address=/%s/%s\n" % (i, args.dns))
    fp.close()
    #sfp.close()


if __name__ == '__main__':
    main()

