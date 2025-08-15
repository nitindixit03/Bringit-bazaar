import Swal from 'sweetalert2'

const successAlert = (title) => {
    const alert = Swal.fire({
        title: title,
        icon: "success",
        confirmButtonColor : "#00b050" 
    });
    return alert
}

export default successAlert