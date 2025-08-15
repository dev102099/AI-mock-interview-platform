import React from 'react'
import {Control, Controller, FieldValues, Path} from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,

    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"

interface FormFieldProps<T extends FieldValues> {
    control:Control<T>,
    name:Path<T>,
    label:string,
    placeholder?:string,
    type?: "text" | "password" | "email" | "file"
}
function FormField({name,control,label,placeholder,type="text"}:FormFieldProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({field})=>(
                <FormItem>
                    <FormLabel className="label">{label}</FormLabel>
                    <FormControl>
                        <Input className="input" type={type} placeholder={placeholder} {...field} />
                    </FormControl>

                    <FormMessage/>
                </FormItem>
        )}/>
    )}

export default FormField
