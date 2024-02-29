const loginForm = document.getElementById('loginForm');
const passResetForm = document.getElementById('passResetForm');

window.addEventListener('load', async () => {
  
    
})



loginForm.addEventListener('submit', async e => {
        e.preventDefault();
        const data = new FormData(loginForm);
        const obj = {};

        if (e.submitter.id=="local")
        {
            data.forEach((value, key) => obj[key] = value);
            const response = await fetch('/api/sessions/login', {
                method: 'POST',
                body: JSON.stringify(obj),
                headers: {
                    "Content-Type": 'application/json'
                }
            });

            if (response.status === 200) {
                window.location.href='/products';
            }
        }
    })

passResetForm.addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(passResetForm);
    const obj = {};
    if (e.submitter.id=="reset")
    {
        data.forEach((value, key) => obj[key] = value);
        const response = await fetch('/api/sessions/resetLink', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": 'application/json'
            }
        });
        if (response.status === 200) {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Se envio el link, revisa tu correo",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    }
    })