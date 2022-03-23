var messageForm = document.getElementById('send-message-form');

// handle submitted Message Form..
messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    // get submitted form data..
    let guest_name = messageForm.elements['name'].value;
    let coded_guest_name = encodeText(guest_name);

    let guest_email = messageForm.elements['email'].value;
    let coded_guest_email = encodeText(guest_email);

    let guest_message_subject = messageForm.elements['subject'].value;
    let coded_guest_message_subject = encodeText(guest_message_subject);

    let guest_message_body = messageForm.elements['message'].value;
    let coded_guest_message_body = encodeText(guest_message_body);

    /*console.log(coded_guest_name);
    console.log(coded_guest_email);
    console.log(coded_guest_message_subject);
    console.log(coded_guest_message_body);*/

    window.location.replace('https://cdafricaa.com/home/messagesent?gst_name=' + btoa(coded_guest_name) + '&gst_mail=' + btoa(coded_guest_email) +
        '&gst_msg_subjt=' + btoa(coded_guest_message_subject) + '&gst_msg_body=' + btoa(coded_guest_message_body))
});

const encodeText = function (srcText) {
    let codedText = '';
    for (let idx = 0; idx < srcText.length; idx++) {
        codedText = codedText + srcText.charCodeAt(idx).toString() + ' ';
    }
    return codedText.trim();
}

