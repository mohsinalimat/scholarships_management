# Copyright (c) 2022, repoteq and contributors
# For license information, please see license.txt

import frappe
from frappe.website.website_generator import WebsiteGenerator


class SchoolRegistration(WebsiteGenerator):
    def after_insert(self):
        new_non_accredited_school = frappe.get_doc({
            'doctype': 'Non_accredited Schools',
            'school_name': self.school_name,
			'school_country': self.school_country,
            'school_city': self.school_city,
			'registered_by': self.owner,
            'school_data_url': 'https://ao-erpnext.sky.slnee.com/' + self.route
        })
        new_non_accredited_school.insert()
