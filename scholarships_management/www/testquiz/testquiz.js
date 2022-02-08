// Personal Information Section..

function StartQuiz() {
    let form = document.querySelector('#user-data-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return false;
    }
    let userdata = get_form_data();
    frappe.msgprint(`user name: ${userdata['first_name']} ${userdata['last_name']}`);
}

function get_form_data() {
    userData = {};
    let inputs = ['first_name', 'last_name', 'phone_number', 'email_address'];
    inputs.forEach((id) => userData[id] = document.getElementById(`${id}`).value);
    return userData
}

// Quiz Section..
var quizContent = document.getElementById('quiz-content');
frappe.call({
    method: "scholarships_management.www.testquiz.testquiz.get_question_option",
    callback: function (r) {
        if (r.message) {
            Object.entries(r.message).forEach(function (value) {


                let questionHeader = document.createElement("h1");
                questionHeader.innerHTML = value[0];
                quizContent.appendChild(questionHeader);

                for (let optn in value[1]) {
                    // create radio button..
                    let radioBtn = document.createElement("input");
                    radioBtn.type = "radio";
                    radioBtn.name = value[1][0];
                    radioBtn.id = value[1][optn];
                    radioBtn.value = value[1][optn];
                    radioBtn.required = true;
                    quizContent.appendChild(radioBtn);
                    // create label for radio button..
                    let option = document.createElement("label");
                    let optionTxt = document.createTextNode(value[1][optn]);
                    option.htmlFor = radioBtn.id;
                    option.appendChild(radioBtn);
                    option.appendChild(optionTxt);
                    quizContent.appendChild(option);
                    quizContent.appendChild(document.createElement("br"));
                }
            });
            // create submit quiz button
            let submitBtn = document.createElement("input");
            submitBtn.type = "submit";
            submitBtn.value = "Submit Quiz";
            submitBtn.className = "col-md-3 ml-auto btn btn-block btn-primary text-white py-3 px-5";
            quizContent.appendChild(submitBtn);
        }
    }
})
