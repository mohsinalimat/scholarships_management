# Copyright (c) 2022, repoteq and contributors
# For license information, please see license.txt

import frappe
from frappe.website.website_generator import WebsiteGenerator


class SchoolRegistration(WebsiteGenerator):

    def after_insert(self):
        new_non_accredited_school = frappe.get_doc({
            'doctype': 'Non_accredited Schools',
            'school_name': self.school_name,
            'school_email': self.school_email,
            'school_country': self.school_country,
            'school_city': self.school_city,
            'registered_by': self.owner,
            'school_data_url': 'https://cdafricaa.com/' + self.route,
            'school_manager_email': self.manager_email,
            'vice_manager_email': self.vice_email,
        })
        new_non_accredited_school.insert(ignore_permissions=True)
