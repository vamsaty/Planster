# -*- coding: utf-8 -*-
"""
Created on Mon Oct 14 09:19:42 2019

@author: satys
"""

from datetime import datetime, timezone

def getTime():
    """Get user's current time"""
    rightnow = datetime.today()
    return rightnow

def getPrettyTime():
    """Get user's pretty current time"""
    rightnow = datetime.today()
    prettytime = rightnow.ctime()
    return prettytime

yourtime = getTime()
prettytime = getPrettyTime()