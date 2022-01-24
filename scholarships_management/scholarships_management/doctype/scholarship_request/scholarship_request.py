# Copyright (c) 2022, repoteq and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.model.naming import getseries
from datetime import date


class ScholarshipRequest(Document):
    def autoname(self):
        country_code = frappe.db.get_value('Country', self.birthplace, 'code')
        prefix = f'{country_code}-{date.today().year}-'
        self.name = prefix + getseries(prefix, 4)

    """def on_submit(self):
        # sender = 'muhammadnassef34@gmail.com'
        #full_name_en = frappe.db.get_value('Scholarship Request', self.name, 'full_name_en')
        #frappe.throw(f'doc name {self.name}, {self.full_name_en}')
        frappe.sendmail(recipients=[self.email], subject='Security Scanner Forum',
                        template='Security Scanner Forum', 
                        args=dict(full_name_en = self.full_name_en, request_ID = self.name))

    def on_trash(self):
        name = frappe.db.get_value('Security Scanner Forum', {
                                   'email': f'{self.email}'}, 'name')
        if not name == None:
            frappe.db.set_value('Security Scanner Forum', name, 'docstatus', 2)
            frappe.delete_doc('Security Scanner Forum', name)"""
