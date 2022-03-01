import frappe


@frappe.whitelist(allow_guest=True)
def get_enabled_languages():
    enabled_lang_lst = frappe.db.get_list('Language', filters={'enabled': 1}, fields=[
                                          'language_code', 'language_name'], as_list=True)
    return enabled_lang_lst

@frappe.whitelist(allow_guest=True)
def get_current_selected_language(lang_code):
    current_selected_language = frappe.db.get_value('Language', {'language_code': lang_code}, ['language_name'])
    return current_selected_language