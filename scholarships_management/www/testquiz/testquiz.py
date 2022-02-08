import frappe

# question_option section..


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


# quiz_logic section..
def get_correct_options():
    correct_options = frappe.db.get_list('Options',
                                         filters={
                                             'is_correct': 1
                                         },
                                         fields='option', pluck='option')
    return correct_options


@frappe.whitelist(allow_guest=True)
def get_selected_options(selected_options):
    return type(selected_options)


def calculate_score():
    correct_options = get_correct_options()
    selected_options = get_selected_options()
    frappe.msgprint(
        f'DB: {len(correct_options)}, USR: {len(selected_options)}')
    pass
