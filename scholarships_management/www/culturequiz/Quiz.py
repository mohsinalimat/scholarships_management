import frappe
import json
import six


def get_question_names(competition_title):
    """get active question names based on selected competition"""
    question_names = frappe.db.get_list(
        'Question', filters={'is_active': 1, 'competition': competition_title}, pluck='name', order_by='creation')
    return question_names


def get_question_by_name(question_name):
    """get question text based on value of question_name"""
    return frappe.db.get_value('Question', question_name, 'question')


def get_options_by_name(question_name):
    """get question ordered options based on value of question_name"""
    option_list = frappe.db.get_list('Options',
                                     filters={
                                         'parent': question_name
                                     },
                                     fields='option', order_by='idx', pluck='option')
    return option_list


@frappe.whitelist(allow_guest=True)
def get_question_option(competition_title):
    """get question with related options based on value of competition_title"""
    question_option_dict = {}

    for question_name in get_question_names(competition_title):
        question = get_question_by_name(question_name)
        question_option_lst = get_options_by_name(question_name)
        question_option_dict[question] = question_option_lst

    return question_option_dict


@frappe.whitelist(allow_guest=True)
def get_translated_question(question_text, system_lang='en'):
    translated_question = frappe.db.get_value('Translation',
                                              {'source_text': question_text,
                                               'language': system_lang},
                                              'translated_text')
    return translated_question


@frappe.whitelist(allow_guest=True)
def get_translated_option(option_text, system_lang='en'):
    translated_option = frappe.db.get_value('Translation',
                                            {'source_text': option_text,
                                             'language': system_lang},
                                            'translated_text')
    return translated_option


@frappe.whitelist(allow_guest=True)
def get_quiz_description(competition_name):
    quiz_description = frappe.db.get_value(
        'Competition', competition_name, 'quiz_description')
    return quiz_description


def get_correct_options(competition_title):
    all_correct_options = []
    question_names = get_question_names(competition_title)
    for quest_name in question_names:
        correct_options = frappe.db.get_list('Options',
                                             filters={
                                                 'parent': quest_name,
                                                 'is_correct': 1
                                             },
                                             fields='option', pluck='option')
        all_correct_options += correct_options
    return all_correct_options


@frappe.whitelist(allow_guest=True)
def get_quiz_score(selected_options, competition_title, passing_score):
    if isinstance(selected_options, six.string_types):
        selected_option_lst = json.loads(selected_options)
    global quiz_score
    quiz_score = calculate_score(
        selected_option_lst, competition_title, passing_score)[0]
    global quiz_status
    quiz_status = calculate_score(
        selected_option_lst, competition_title, passing_score)[1]
    return [quiz_score, quiz_status]


def calculate_score(selected_option_lst, competition_title, passing_score):
    correct_options = get_correct_options(competition_title)
    count = 0
    for itm in selected_option_lst:
        if itm in correct_options:
            count += 1
    total_score = float((count / len(correct_options)) * 100)
    if total_score >= float(passing_score):
        return ["%.3f" % total_score, 'pass']  # f'{total_score:.3f} : pass'
    else:
        return ["%.3f" % total_score, 'fail']  # f'{total_score:.3f} : fail'


@frappe.whitelist(allow_guest=True)
def get_quiz_banner(competition_name):
    return frappe.db.get_value('Competition', competition_name, 'quiz_banner')
