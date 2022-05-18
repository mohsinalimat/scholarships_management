// get data from url..
var urlParams = new URLSearchParams(window.location.search);
var competitionName = urlParams.get('competition_name');
var passingScore = urlParams.get('passing_score');
var RandQuest = urlParams.get('rand_quest');
var clientIpAddress = ''
$.getJSON('https://api.db-ip.com/v2/free/self', function (data) {
    var userSessionData = data;
    clientIpAddress = (userSessionData.ipAddress).toString();
});
// set quiz banner image..
//var quizBanner = urlParams.get('quiz_banner');
//document.getElementById('qz-b').src = atob(quizBanner);
// set page language..
var lang = urlParams.get('_lang');
if (lang == '' || lang == 'null') {
    lang = 'en';
}

const checkTranslation = function (langValue) {
    window.location.replace('https://cdafricaa.com/culturequiz/Quiz?competition_name=' + competitionName + '&passing_score=' + passingScore + '&rand_quest=' + RandQuest + '&_lang=' + langValue);
    /*
    if (langValue === 'ar' || langValue === 'en' || langValue === 'pt' || langValue === 'ha') {
        window.location.replace('https://test.cdafricaa.com/culturequiz/Quiz?competition_name=' + competitionName + '&passing_score=' + passingScore + '&quiz_banner=' + quizBanner + '&_lang=' + langValue);
    } else {
        window.location.replace('https://test.cdafricaa.com/culturequiz/loadingTranslation?_lang=' + langValue);
    }*/
}
// language picker..
frappe.call({
    method: "scholarships_management.www.culturequiz.lang_picker.get_enabled_languages",
    callback: function (r) {
        if (r.message) {
            var docHeader = document.getElementsByClassName("container")[0];

            var langSwitcher = document.createElement('select');
            langSwitcher.id = "langSwitcherID";
            langSwitcher.style.padding = '5px';
            docHeader.appendChild(langSwitcher);

            var defaultopt = document.createElement('option');
            defaultopt.id = 'defaultoptt';
            defaultopt.value = '';
            // make default selected option hidden..
            defaultopt.selected = true;
            defaultopt.disabled = true;
            //defaultopt.style.display = 'none';
            //defaultopt.text = '';
            langSwitcher.appendChild(defaultopt);
            // change default selected option text based on current used language..
            frappe.call({
                method: "scholarships_management.www.culturequiz.lang_picker.get_current_selected_language",
                args: {
                    lang_code: lang
                },
                callback: function (r) {
                    if (r.message) {
                        document.getElementById('defaultoptt').innerHTML = r.message;
                    } else {
                        document.getElementById('defaultoptt').innerHTML = 'Select Language';
                    }
                }
            });
            // list of options based on enabled languages..
            Object.entries(r.message).forEach((value) => {
                var opt = document.createElement('option');
                opt.value = value[1][0];
                opt.text = value[1][1];
                langSwitcher.appendChild(opt);
            });

            langSwitcher.addEventListener('change', function () {
                if (this.value !== '') {
                    lang = this.value;
                    checkTranslation(lang);
                }
            });
        }
    }
});

// quiz banner..
frappe.call({
    method: "scholarships_management.www.culturequiz.Quiz.get_quiz_banner",
    args: {
        competition_name: competitionName,
        system_lang: lang
    },
    callback: function (r) {
        if (r.message) {
            document.getElementById('qz-b').src = r.message;
        }
    }
});

// quiz description..
frappe.call({
    method: "scholarships_management.www.culturequiz.Quiz.get_quiz_description",
    args: {
        competition_name: competitionName,
        system_lang: lang
    },
    callback: function (r) {
        if (r.message) {
            document.getElementById('quizDescription').innerHTML = r.message;
        }
    }
});


var quizContent = document.getElementById('quiz-content');

function changeColor(event) {
    //debugger;
    // The event's `target` property holds the element where the event happened
    const localReferenceToTheTextArea = event.target;
    // The text of a textarea  element lives in its `value` property
    localReferenceToTheTextArea.style.backgroundColor = 'lime';
    //console.log(text);
}

function returnColor(event) {
    //debugger;
    // The event's `target` property holds the element where the event happened
    const localReferenceToTheTextArea = event.target;
    // The text of a textarea  element lives in its `value` property
    localReferenceToTheTextArea.style.backgroundColor = 'yellow';
    //console.log(text);
}


const setAnswers = function (values) {
    let crntTime = (new Date().getTime()).toString()

    for (let optn in values) {
        // create radio button..
        let radioBtn = document.createElement("input");
        radioBtn.type = "radio";
        radioBtn.name = values[0] + crntTime; // to avoid repeated first name.. 
        radioBtn.id = values[optn] + crntTime; // to avoid multi answers with the same name..
        radioBtn.value = values[optn];
        //radioBtn.required = true;

        radioBtn.addEventListener("click", changeColor);
        radioBtn.addEventListener("blur", returnColor);

        // create label for radio button..
        let option = document.createElement("label");

        if (lang == 'ar' || lang == 'en') {
            option.style.fontFamily = "al-mohannad";
            option.style.fontWeight = "70px";
        } else {
            option.style.fontFamily = "'Times New Roman'";
            option.style.fontWeight = "90px";
            option.style.fontWeight = 'bold';
        }

        let optionTxt = document.createTextNode(values[optn]);
        option.appendChild(optionTxt);
        option.htmlFor = radioBtn.id;

        radioBtn.appendChild(option);
        quizContent.appendChild(radioBtn);
        quizContent.appendChild(option);

        //option.addEventListener("click", changeColor);
        //option.addEventListener("blur", returnColor);

        quizContent.appendChild(document.createElement("br"));//hr
    }
}

const transquets = function () {
    frappe.call({
        method: "scholarships_management.www.culturequiz.Quiz.get_questions_options",
        args: {
            competition_title: competitionName,
            random_questions: RandQuest,
            system_lang: lang
        },
        callback: function (oqn) {
            Object.entries(oqn.message).forEach(function (val) {
                //console.log(val[0]); // question text

                //document.appendChild("<div>");
                let questionHeader = document.createElement("h3");
                questionHeader.innerHTML = val[0];

                if (lang == 'ar' || lang == 'en') {
                    questionHeader.style.fontFamily = "al-mohannad";
                } else {
                    questionHeader.style.fontFamily = "'Times New Roman'";
                }

                questionHeader.style.fontWeight = "100px";
                quizContent.appendChild(questionHeader);
                quizContent.appendChild(document.createElement("br"));

                //console.log(val[1]); // option list
                setAnswers(val[1]);
                //document.appendChild("</div>");
                var horizontalLine = document.createElement("hr");
                horizontalLine.style.width = '100%';
                horizontalLine.style.margin = 'auto';
                horizontalLine.style.borderTop = '1px solid';
                quizContent.appendChild(document.createElement("br"));
                quizContent.appendChild(horizontalLine);
                quizContent.appendChild(document.createElement("br"));
            });
        }
    });
}
transquets();

window.onload = () => {
    // numbering of questions ..
    setTimeout(function () {
        //debugger;
        if (lang == 'ar') {
            document.getElementsByClassName('row')[1].style.textAlign = 'right';
            document.getElementsByClassName('row')[1].style.direction = 'rtl';

            var numOfOptionLabels = document.getElementsByTagName('label').length;
            for (let optnLabelIndx = 0; optnLabelIndx < numOfOptionLabels; optnLabelIndx++) {
                document.getElementsByTagName('label')[optnLabelIndx].style.margin = '5px';
            }

            var numOfQuestions = document.getElementsByTagName('h3').length;
            for (let qustIndx = 0; qustIndx < numOfQuestions; qustIndx++) {
                document.getElementsByTagName('h3')[qustIndx].innerHTML = `${qustIndx + 1}- ` + document.getElementsByTagName('h3')[qustIndx].innerHTML;
            }
        } else {
            var numOfQuestions = document.getElementsByTagName('h3').length;
            for (let qustIndx = 0; qustIndx < numOfQuestions; qustIndx++) {
                document.getElementsByTagName('h3')[qustIndx].innerHTML = `${qustIndx + 1}- ` + document.getElementsByTagName('h3')[qustIndx].innerHTML;
            }
        }

    }, 6000);
}

// handle submitted quiz options..
quizContent.addEventListener('submit', (event) => {
    let selectedOptions = [];
    let outstr = $('#quiz-content').serializeArray();

    outstr.forEach((value) => {
        selectedOptions.push(value['value']);
    });
    // check answer of question number 6...

    if (selectedOptions.length != document.getElementsByTagName('h3').length) {
        //console.log(selectedOptions);
        let warnMsg = 'Please Check Your Selectd Answers!!';
        frappe.msgprint(__(warnMsg));
    } else {
        frappe.call({
            method: "scholarships_management.www.culturequiz.Quiz.get_quiz_score",
            args: {
                selected_options: selectedOptions,
                competition_title: competitionName,
                passing_score: passingScore,
                is_random_questions: RandQuest,
                client_ip_address: clientIpAddress
            },
            callback: function (r) {
                if (r.message) {
                    var quizScore = r.message[0];
                    var quizStatus = r.message[1];
                    //console.log(quizScore);
                    //console.log(quizStatus);
                    window.location.replace('https://cdafricaa.com/culturequiz?new=1&quiz_score=' + btoa(quizScore) + '&quiz_status=' + btoa(quizStatus) + '&competition=' + competitionName + '&_lang=' + lang)
                }
            }
        });
    }
    event.preventDefault();
});
