
const resetPassForm = document.getElementById('resetPassForm');

resetPassForm.addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(resetPassForm);
    const obj = {};
    if (e.submitter.id=="reset")
    {
        data.forEach((value, key) => obj[key] = value);
        const response = await fetch('/api/sessions/resetPass', {
            method: 'PUT',
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": 'application/json'
            }
        });
        if (response.status === 200) {
            alert('EXITO - Se modifico el password correctamente, seras redirigido a la pagina de login!')
            window.location.replace('/login');
        } else {
            alert('ERROR - El link de restablecimiento a caducado, genera otro desde la pagina de login')

            window.location.replace('/login');
        }
    }
})