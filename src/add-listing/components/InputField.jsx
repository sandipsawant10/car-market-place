import React from 'react'
import { Input } from "@/components/ui/input"


function InputField({item, handleInputChange, carInfo}) {
  return (
    <div>
      <Input 
      type={item?.fieldType} 
      name={item?.name}  
      onChange={(e) => handleInputChange(item.name, e.target.value)}
      defaultValue={carInfo?.[item.name]}
      />
    </div>
  )
}

export default InputField