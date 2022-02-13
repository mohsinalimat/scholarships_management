// Quiz Section..

var quizContent = document.getElementById('quiz-content');

frappe.call({
    method: "scholarships_management.www.culturequiz.culturequiz.get_question_option",
    callback: function (r) {
        if (r.message) {
            Object.entries(r.message).forEach(function (value) {
                let questionHeader = document.createElement("h1");
                //frappe.msgprint(frappe.preferred_language);
                frappe.call({
                    method: "scholarships_management.www.culturequiz.culturequiz.get_translated_question",
                    args: {
                        system_langg: frappe.preferred_language,
                        question_text: value[0]
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
                system_lan: frappe.preferred_language,
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
            selected_options: selectedOptions
        },
        callback: function (r) {
            if (r.message) {
                var quizScore = r.message[0];
                var quizStatus = r.message[1];
                window.location.replace('https://ao-erpnext.sky.slnee.com/culturequiz?new=1&quiz_score=' + btoa(quizScore) + '&quiz_status=' + btoa(quizStatus))
            }
        }
    });
    event.preventDefault();
});


