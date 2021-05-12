export const checkEmail = (input) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (input.trim() === "" || re.test(input.trim())) {
        return true;
    } else {
        return false;
    }
}

export const checkPhone = (input) => {
    const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
    if (input.trim() === "" || re.test(input.trim())) {
        return true;
    } else {
        return false;
    }
}

export const validateUsername = (input) => {
    const re = /^(\w){1,15}$/;
    if (input.trim() === "" || re.test(input.trim())) {
        return true;
    } else {
        return false;
    }
}

