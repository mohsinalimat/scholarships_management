import frappe


@frappe.whitelist(allow_guest=True)
def get_enabled_languages():
    enabled_lang_lst = frappe.db.get_list('Language', filters={'enabled': 1}, fields=[
                                          'language_code', 'language_name'], as_list=True)
    return enabled_lang_lst
