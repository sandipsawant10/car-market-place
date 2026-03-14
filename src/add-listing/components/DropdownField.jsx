import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function DropdownField({item, handleInputChange}) {
  return (
    <div>
      <Select onValueChange={(value) => handleInputChange(item.name, value)} required={item.required} >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={item?.label} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
           { item?.options?.map((option, index) => (
             
             <SelectItem key={index} value={option}>{option}</SelectItem>
           ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export default DropdownField;
