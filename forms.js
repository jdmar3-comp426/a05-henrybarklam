window.addEventListener("load", function(){
        function sendData(){
            const sendRequest = new XMLHttpRequest();
            const signupInfo = new FormData(form);

            sendRequest.addEventListener( "error", function(event){
                    alert('Submission unsuccessful');

            });

            sendRequest.addEventListener("load", function(event){
                alert('Your account has been created');
            });

            sendRequest.open("POST", "http://localhost:5000/app/new/user");
            sendRequest.send(signupInfo);

        }
        const form = document.getElementById("signup");
        form.addEventListener("submit", function(event) {
            event.preventDefault();
            sendData();
        });

    });