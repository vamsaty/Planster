# -*- coding: utf-8 -*-
"""
Created on Mon Oct 14 09:18:41 2019

@author: satys
"""

from wtforms import Form, StringField, validators
from wtforms.validators import DataRequired, Regexp

class myForm(Form):
    """Homepage form."""
    PlotlyURL = StringField('Provide a raw .ipynb URL from Github',
    validators=[
            DataRequired(),
            Regexp(".*\.ipynb$",
            message="Please provide a URL ending in ipynb"),
          ])