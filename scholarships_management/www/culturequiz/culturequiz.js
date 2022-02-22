// Quiz Section..
var urlParams = new URLSearchParams(window.location.search);

var competitionName = urlParams.get('competition_name');
//console.log(competitionName);

var passingScore = urlParams.get('passing_score');
//console.log(passingScore);

var quizBanner = urlParams.get('quiz_banner');
//console.log(quizBanner);
document.getElementById('qz-b').src = atob(quizBanner);

var lang = urlParams.get('_lang');

if (lang == '' || lang == 'null') {
    lang = 'en';
}

// language picker..
frappe.call({
    method: "scholarships_management.www.culturequiz.competitions.get_enabled_languages",
    callback: function (r) {
        if (r.message) {
            var docHeader = document.getElementsByClassName("container")[0];
            
            var langSwitcher = document.createElement('select');
            langSwitcher.id = "langSwitcherID";
            langSwitcher.style.padding = '5px';
            docHeader.appendChild(langSwitcher);

            var opt = document.createElement('option');
            opt.value = '';
            opt.text = 'Select Language';
            langSwitcher.appendChild(opt);
            
            Object.entries(r.message).forEach((value) => {
                var opt = document.createElement('option');
                opt.value = value[1][0];
                opt.text = value[1][1];
                langSwitcher.appendChild(opt);
            });

            langSwitcher.addEventListener('change', function() {
                if (this.value !== ''){
                    lang = this.value;
                    window.location.replace('https://ao-erpnext.sky.slnee.com/culturequiz/culturequiz?competition_name=' + competitionName + '&passing_score=' + passingScore + '&quiz_banner=' + quizBanner + '&_lang=' + lang);
                }
            });
        }
    }
});

var quizContent = document.getElementById('quiz-content');

frappe.call({
    method: "scholarships_management.www.culturequiz.culturequiz.get_question_option",
    args: {
        competition_title: competitionName
    },
    async: false,
    callback: function (r) {
        if (r.message) {
            Object.entries(r.message).forEach(function (value) {
                let questionHeader = document.createElement("h4");
                //console.log(frappe.preferred_language);
                var el = document.createElement('div');
                el.innerHTML = value[0];
                var questionText = el.getElementsByTagName('p')[0].innerHTML;
                frappe.call({
                    method: "scholarships_management.www.culturequiz.culturequiz.get_translated_question",
                    args: {
                        system_lang: lang,
                        question_text: questionText
                    },
                    callback: function (rr) {
                        if (rr.message) {
                            questionHeader.innerHTML = rr.message;
                            quizContent.appendChild(questionHeader);
                            setAnswers(value[1]);
                        } else {
                            questionHeader.innerHTML = value[0];
                            quizContent.appendChild(questionHeader);
                            setAnswers(value[1]);
                        }
                    }
                });
            });

        }
        // create submit quiz button..
        /*let submitBtn = document.createElement("input");
        submitBtn.type = "submit";
        submitBtn.value = "Submit Quiz";
        submitBtn.className = "col-md-3 ml-auto btn btn-block btn-primary text-white py-3 px-5";
        quizContent.appendChild(submitBtn);*/
    }

});


function setAnswers(values) {
    for (let optn in values) {
        // create radio button..
        let radioBtn = document.createElement("input");
        radioBtn.type = "radio";
        radioBtn.name = values[0];
        radioBtn.id = values[optn];
        radioBtn.value = values[optn];
        radioBtn.required = true;
        quizContent.appendChild(radioBtn);
        // create label for radio button..
        let option = document.createElement("label");

        frappe.call({
            method: "scholarships_management.www.culturequiz.culturequiz.get_translated_option",
            args: {
                system_lang: lang,
                option_text: values[optn]
            },
            callback: function (rrr) {
                if (rrr.message) {
                    let optionTxt = document.createTextNode(rrr.message);
                    option.appendChild(optionTxt);
                } else {
                    let optionTxt = document.createTextNode(values[optn]);
                    option.appendChild(optionTxt);
                }
            }
        });

        option.htmlFor = radioBtn.id;
        option.appendChild(radioBtn);
        quizContent.appendChild(option);
        quizContent.appendChild(document.createElement("br"));
    }
}

// handle submitted quiz options..
quizContent.addEventListener('submit', (event) => {
    let selectedOptions = [];
    let outstr = $('#quiz-content').serializeArray();
    outstr.forEach((value) => {
        selectedOptions.push(value['value']);
    });
    //console.log(selectedOptions);
    frappe.call({
        method: "scholarships_management.www.culturequiz.culturequiz.get_quiz_score",
        args: {
            selected_options: selectedOptions,
            competition_title: competitionName,
            passing_score: passingScore
        },
        callback: function (r) {
            if (r.message) {
                var quizScore = r.message[0];
                var quizStatus = r.message[1];
                window.location.replace('https://ao-erpnext.sky.slnee.com/culturequiz?new=1&quiz_score=' + btoa(quizScore) + '&quiz_status=' + btoa(quizStatus) + '&competition=' + competitionName + '&_lang=' + lang)
            }
        }
    });
    event.preventDefault();
});


if (lang == 'ar') {
    for (let qindx = 0; qindx < document.getElementsByClassName('ql-editor read-mode').length; qindx++ ){
        document.getElementsByClassName('ql-editor read-mode')[qindx].style.textAlign='right';
        document.getElementsByClassName('ql-editor read-mode')[qindx].style.direction = 'rtl';
    }
    document.getElementsByClassName('row')[1].style.textAlign='right';
    document.getElementsByClassName('row')[1].style.direction = 'rtl';
}

