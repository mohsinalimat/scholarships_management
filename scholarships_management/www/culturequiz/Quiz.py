import frappe
import json
import six
from bs4 import BeautifulSoup
import random


@frappe.whitelist(allow_guest=True)
def get_quiz_banner(competition_name, system_lang='en'):
    quiz_banner_img = frappe.db.get_value('Quiz Banners', {'quiz_banner_language': system_lang, 'parent': competition_name}, 'quiz_banner_image')
    if quiz_banner_img:
        return quiz_banner_img
    else:
        return frappe.db.get_single_value('Default Quiz Banner', 'default_quiz_icon')


@frappe.whitelist(allow_guest=True)
def get_quiz_description(competition_name, system_lang='en'):
    quiz_description = frappe.db.get_value(
        'Competition', competition_name, 'quiz_description')
    cleantext = BeautifulSoup(quiz_description, "lxml").text

    translated_quiz_description = frappe.db.get_value('Translation',
                                                      {'source_text': cleantext,
                                                       'language': system_lang},
                                                      'translated_text')
    if translated_quiz_description:
        return translated_quiz_description
    else:
        return quiz_description


def get_question_names(competition_title):
    """get active question names based on selected competition"""
    question_names = frappe.db.get_list(
        'Question', filters={'is_active': 1, 'competition': competition_title}, pluck='name', order_by='question_rank')
    return question_names


def get_questions_by_name(question_name_list):
    """get question text based on value of question_name"""
    questions = []
    for qnindx in question_name_list:
        question_text = frappe.db.get_value('Question', qnindx, 'question')
        cleantext = BeautifulSoup(question_text, "lxml").text
        questions.append(cleantext)
    return questions


@frappe.whitelist(allow_guest=True)
def get_translated_question(competition_title, system_lang='en'):
    """ list of ordered translated questions..."""
    question_name_list = get_question_names(competition_title)
    questions_text = get_questions_by_name(question_name_list)

    translated_questions = []
    for qtindx in questions_text:
        translated_question_text = frappe.db.get_value('Translation',
                                                       {'source_text': qtindx,
                                                        'language': system_lang},
                                                       'translated_text')
        if translated_question_text:
            translated_questions.append(translated_question_text)
        else:
            translated_questions.append(qtindx)

    return translated_questions


def get_options_by_name(competition_title):
    """get question ordered options based on value of question_name"""
    question_name_lst = get_question_names(competition_title)
    options_list = []
    for question_name in question_name_lst:
        options_list.append(frappe.db.get_list('Options',
                                               filters={
                                                   'parent': question_name
                                               },
                                               fields='option', order_by='idx', pluck='option'))
    return options_list


@frappe.whitelist(allow_guest=True)
def get_translated_option(competition_title, system_lang='en'):
    options_list = get_options_by_name(competition_title)

    translated_options_lst = []
    for option in options_list:
        translated_optn = []
        for option_text in option:
            trans_optn_text = frappe.db.get_value('Translation',
                                                  {'source_text': option_text,
                                                   'language': system_lang},
                                                  'translated_text')
            if trans_optn_text:
                translated_optn.append(trans_optn_text)
            else:
                translated_optn.append(option_text)
        translated_options_lst.append(translated_optn)
    return translated_options_lst


def random_questions_options(quest_lst, optn_lst):
    quest_optn = list(zip(quest_lst, optn_lst))
    random.shuffle(quest_optn)
    return zip(*quest_optn)


@frappe.whitelist(allow_guest=True)
def get_questions_options(competition_title, random_questions, system_lang='en'):
    # ordered list of questions and options..
    ordered_quest_lst = get_translated_question(competition_title, system_lang)
    ordered_optn_lst = get_translated_option(competition_title, system_lang)
    question_option_dict = {}
    """for indx in range(len(ordered_quest_lst)):
        question_option_dict[ordered_quest_lst[indx]] = ordered_optn_lst[indx]
    return question_option_dict"""

    if random_questions == '1':
        quest_lst = ordered_quest_lst.copy()
        optn_lst = ordered_optn_lst.copy()
        random_quest_lst, random_optn_lst = random_questions_options(quest_lst, optn_lst)
        for indx in range(len(random_quest_lst)):
            question_option_dict[random_quest_lst[indx]] = random_optn_lst[indx]
        return question_option_dict
    else:
        for indx in range(len(ordered_quest_lst)):
            question_option_dict[ordered_quest_lst[indx]] = ordered_optn_lst[indx]
        return question_option_dict


def get_source_text_for_option(selected_option_lst):
    source_text_options = []
    for optn in selected_option_lst:
        src_txt = frappe.db.get_value(
            'Translation', {'translated_text': optn}, 'source_text')
        if src_txt:
            source_text_options.append(src_txt)
        else:
            source_text_options.append(optn)
    return source_text_options


@frappe.whitelist(allow_guest=True)
def get_quiz_score(selected_options, competition_title, passing_score):
    if isinstance(selected_options, six.string_types):
        selected_option_lst = json.loads(selected_options)

    # get source text of translted option..
    selected_option_lst = get_source_text_for_option(selected_option_lst)
    quiz_score = calculate_score(
        selected_option_lst, competition_title, passing_score)[0]

    quiz_status = calculate_score(
        selected_option_lst, competition_title, passing_score)[1]
    # make Contestant data form available
    #frappe.db.sql("""update `tabWeb Form` set published = 1 where name='culturequiz'""")
    return [quiz_score, quiz_status]


def calculate_score(selected_option_lst, competition_title, passing_score):
    correct_options = get_correct_options(competition_title)

    count = 0
    for indx in range(len(selected_option_lst)):
        if selected_option_lst[indx] == correct_options[indx]:
            count += 1

    """for itm in selected_option_lst:
        if itm in correct_options:
            count += 1"""

    total_score = float((count / len(correct_options)) * 100)

    if total_score >= float(passing_score):
        return ["%.3f" % total_score, 'pass']  # f'{total_score:.3f} : pass'
    else:
        return ["%.3f" % total_score, 'fail']  # f'{total_score:.3f} : fail'


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


"""
@frappe.whitelist(allow_guest=True)
def get_question_option(competition_title):
    question_option_dict = {}

    for question_name in get_question_names(competition_title):
        question = get_question_by_name(question_name)
        question_option_lst = get_options_by_name(question_name)
        question_option_dict[question] = question_option_lst

    return question_option_dict


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

"""
