# Copyright (c) 2022, repoteq and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Non_accreditedSchools(Document):
    pass


@frappe.whitelist(allow_guest=True)
def confirm_school_registration(pschool_name, pschool_email, pschool_country, pschool_city, current_signed_user, pschool_data_url, pschool_manager_email, pvice_manager_email):
    new_accredited_school = frappe.get_doc({
        'doctype': 'Accredited Schools',
        'school_name': pschool_name,
        'school_email': pschool_email,
        'school_country': pschool_country,
        'school_city': pschool_city,
        'accredited_by': current_signed_user,
        'school_data_url': pschool_data_url,
        'school_manager_email': pschool_manager_email,
        'vice_manager_email': pvice_manager_email,
    })
    if new_accredited_school.insert(ignore_permissions=True):
        return True
