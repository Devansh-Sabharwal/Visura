import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps {
  title: string;
  placeholder: string;
  type: string;
  required: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
}

const Input = ({
  title,
  placeholder,
  required = false,
  type,
  value,
  onChange,
  error,
  disabled,
}: InputProps) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-white mb-1">
        {title}
      </label>
      <input
        disabled={disabled}
        type={type}
        className="text-white w-full px-3 py-2 border border-gray-300/20 rounded-md focus:outline-none"
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
      />
      {error && (
        <div className="mt-2 text-red-400 text-sm text-right">{error}</div>
      )}
    </div>
  );
};

interface PasswordInputProps {
  title: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

export function PasswordInput({
  title,
  value,
  onChange,
  placeholder = "Enter password",
  required = false,
  error,
  disabled,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-white mb-1">
        {title}
      </label>
      <div className="relative">
        <input
          disabled={disabled}
          type={showPassword ? "text" : "password"}
          className="text-white w-full px-3 py-2 border border-gray-300/20 rounded-md focus:outline-none  pr-10"
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-white hover:text-gray-200 focus:outline-none"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
      {error && (
        <div className="mt-2 text-red-500 text-sm text-right">{error}</div>
      )}
    </div>
  );
}
export default Input;
