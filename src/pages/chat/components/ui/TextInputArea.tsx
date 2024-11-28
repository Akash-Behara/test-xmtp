import React, { useEffect, useState } from 'react'
import { PaperPlaneTilt, Smiley } from '@phosphor-icons/react';

interface TextInputAreaProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  defaultValue?: string;
  hasIcon?: boolean;
  handleSubmit?: () => void;
}

const TextInputArea = ({ textareaRef, defaultValue, hasIcon = false, handleSubmit }: TextInputAreaProps) => {

  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Adjust height
      setIsExpanded(textareaRef.current.scrollHeight > 40); // Check height to toggle border style
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if(!textareaRef.current?.value) return;
      handleSubmit!();

      if (textareaRef.current) textareaRef.current.value = "";
      handleInputChange(); // Reset the height
    }
  }

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    if(textareaRef.current?.value?.length! > 40) setIsExpanded(true);
  };

  const sendMessage = () => {
    if(!textareaRef.current?.value) return;
    handleSubmit!();
    if (textareaRef.current) textareaRef.current.value = "";
    handleInputChange(); // Reset the height
  }

  useEffect(() => {
    adjustTextareaHeight();
  }, [defaultValue]);

  return (
    <div className={`w-full flex items-center mx-auto relative bg-black70 transition duration-300 ${isExpanded ? "rounded-md" : "rounded-full"}`}>
      <textarea
        ref={textareaRef}
        defaultValue={defaultValue}
        className={`w-full max-w-[97%] px-3 py-2 text-sm text-white88 outline-none resize-none overflow-hidden bg-transparent transition duration-300 ${
          isExpanded ? "rounded-md" : "rounded-full"
        }`}
        placeholder="Type your message..."
        onInput={handleInputChange}
        onKeyDown={handleKeyDown}
        rows={1}
        style={{ minHeight: "auto", maxHeight: "200px" }} // Optional: limit max height
      />
      {hasIcon &&
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <div onClick={sendMessage} className='bg-green-500 rounded-full p-1'><PaperPlaneTilt size={14} weight='fill' className='text-white'/></div>
          <Smiley size={24} className="text-white88"/>
        </div>
      }
    </div>
  )
}

export default TextInputArea