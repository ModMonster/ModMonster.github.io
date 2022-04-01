function encode() {
    message = document.getElementById("string").value
    key = document.getElementById("key").value

    encrypted = CryptoJS.AES.encrypt(message, key);

    if (message == "") {
        // error
        Swal.fire({
            title: 'Error!',
            text: 'Can\'t encode an empty string!',
            icon: 'error',
            confirmButtonText: 'Close',
        })
    }
    else {
        // success
        Swal.fire({
            title: 'Successfully encoded!',
            html: 'Encoded string:<br><br>' + encrypted,
            icon: 'success',
            confirmButtonText: 'Copy',
            showCancelButton: true,
            cancelButtonText: 'Close',
            preConfirm: () => {navigator.clipboard.writeText(encrypted);}
        })   
    }
}

function decode() {
    message = document.getElementById("string").value
    key = document.getElementById("key").value

    decrypted = CryptoJS.AES.decrypt(message, key).toString(CryptoJS.enc.Utf8);

    if (decrypted == "") {
        // error
        Swal.fire({
            title: 'Error!',
            text: 'Could not decode the string.',
            icon: 'error',
            confirmButtonText: 'Close',
        })
    } else {
        // success
        Swal.fire({
            title: 'Successfully decoded!',
            html: 'The message was:<br><br>' + decrypted,
            icon: 'success',
            confirmButtonText: 'Cool!'
        })
    }
}