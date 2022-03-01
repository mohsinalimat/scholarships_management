# Copyright (c) 2022, repoteq and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from datetime import datetime


class Competition(Document):
	pass
"""
	def before_save(self):
		#frappe.throw(f'End-Date: {self.end_date} Start-Date: {self.start_date} current-date: {str(datetime.now().date())}')
		crnt_date = str(datetime.now().date())
		strt_date = self.start_date
		nd_date = self.end_date
		
		if (nd_date < strt_date):
			frappe.throw('End-Date must be greater than Start-Date')
		if (nd_date == strt_date):
			frappe.throw('End-Date Can not equal Start-Date')
		if(strt_date < crnt_date):
			frappe.throw('Start-Date Cannot be less than Current-Date')
		if (nd_date == crnt_date):
			frappe.throw('End-Date Can not equal Current-Date')"""
		

