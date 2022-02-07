import frappe


def get_question_names():
    question_names = frappe.db.get_list(
        'Question', pluck='name', order_by='creation')
    return question_names


def get_question_by_name(question_name):
    return frappe.db.get_value('Question', question_name, 'question')


def get_options_by_name(question_name):
    option_list = frappe.db.get_list('Options',
                                     filters={
                                         'parent': question_name
                                     },
                                     fields='option', order_by='idx', pluck='option')
    return option_list


@frappe.whitelist(allow_guest=True)
def get_question_option():
    question_option_dict = {}

    for question_name in get_question_names():
        question = get_question_by_name(question_name)
        question_option_lst = get_options_by_name(question_name)
        question_option_dict[question] = question_option_lst
    
    return question_option_dict
