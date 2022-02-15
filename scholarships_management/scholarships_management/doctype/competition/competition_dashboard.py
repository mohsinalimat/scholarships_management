from frappe import _


def get_data():
    return {
        'non_standard_fieldnames': {
            'Question': 'Competition',
            'Culturequiz': 'Competition',
        },
        'transactions': [
            {
                'label': _('Competition Questions'),
                'items': ['Question']
            },
            {
                'label': _('Competition Submissions'),
                'items': ['Culturequiz']
            },
        ]
    }
