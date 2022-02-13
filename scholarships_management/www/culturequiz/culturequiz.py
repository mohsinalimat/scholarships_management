import frappe
import json
import six

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


@frappe.whitelist(allow_guest=True)
def get_translated_question(system_lang, question_text):
    translated_question = frappe.db.get_value('Translation',
                                              {'source_text': question_text[36:-10],
                                               'language': system_lang},
                                              'translated_text')
    return translated_question


@frappe.whitelist(allow_guest=True)
def get_translated_option(system_lang, option_text):
    translated_option = frappe.db.get_value('Translation',
                                              {'source_text': option_text,
                                               'language': system_lang},
                                              'translated_text')
    return translated_option

# quiz_logic section..
def get_correct_options():
    correct_options = frappe.db.get_list('Options',
                                         filters={
                                             'is_correct': 1
                                         },
                                         fields='option', pluck='option')
    return correct_options


@frappe.whitelist(allow_guest=True)
def get_quiz_score(selected_options):
    if isinstance(selected_options, six.string_types):
        selected_option_lst = json.loads(selected_options)
    global quiz_score
    quiz_score = calculate_score(selected_option_lst)[0]
    global quiz_status
    quiz_status = calculate_score(selected_option_lst)[1]
    return [quiz_score, quiz_status]


def calculate_score(selected_option_lst):
    correct_options = get_correct_options()
    count = 0
    for itm in selected_option_lst:
        if itm in correct_options:
            count += 1
    total_score = float((count / len(correct_options)) * 100)
    if total_score >= 75:
        return ["%.3f" % total_score, 'pass']  # f'{total_score:.3f} : pass'
    else:
        return ["%.3f" % total_score, 'fail']  # f'{total_score:.3f} : fail'
