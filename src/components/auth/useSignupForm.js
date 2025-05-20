import { useState } from "react";
import { SignupValidateField } from "./ValidateField";

export default function useSignupForm(initForm) {

    const [form, setForm] = useState(initForm);
    const [errors, setErrors] = useState({});
    
    const handleChange = (e) => {
        
        const {name, value} = e.target;

        setForm((prev) => ({
            ...prev, [name]:value
        }));
        

        const error = SignupValidateField(name, value);
        
        setErrors((prev) => ({
            ...prev, [name]: error
        }));
    }
    
    return {
        form,
        setForm,
        errors,
        handleChange,
    };
}