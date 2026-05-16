import Select from "react-select";

const controlStyles =
  "min-h-[46px] rounded-md border bg-white text-sm shadow-none transition hover:border-slate-400";

export default function SearchSelect({
  id,
  value,
  options,
  onChange,
  placeholder = "Select",
  isClearable = false,
  isDisabled = false,
}) {
  const normalizedOptions = options.map((option) =>
    typeof option === "string" ? { label: option, value: option } : option
  );
  const selected = normalizedOptions.find((option) => option.value === value) || null;

  return (
    <Select
      classNamePrefix="search-select"
      inputId={id}
      isClearable={isClearable}
      isDisabled={isDisabled}
      isSearchable
      menuPortalTarget={document.body}
      onChange={(option) => onChange(option?.value || "")}
      options={normalizedOptions}
      placeholder={placeholder}
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 80 }),
      }}
      unstyled
      value={selected}
      classNames={{
        control: ({ isFocused, isDisabled: disabled }) =>
          `${controlStyles} ${disabled ? "cursor-not-allowed opacity-60" : ""} ${
            isFocused ? "border-brand-600 ring-2 ring-brand-100" : "border-slate-300"
          }`,
        valueContainer: () => "px-3 py-2",
        input: () => "text-slate-900",
        singleValue: () => "font-semibold text-slate-900",
        placeholder: () => "text-slate-400",
        indicatorsContainer: () => "px-2 text-slate-500",
        clearIndicator: () => "cursor-pointer p-1 hover:text-red-700",
        dropdownIndicator: () => "cursor-pointer p-1 hover:text-brand-700",
        menu: () => "mt-1 overflow-hidden rounded-md border border-slate-200 bg-white py-1 shadow-soft",
        option: ({ isFocused, isSelected }) =>
          `cursor-pointer px-3 py-2 text-sm font-semibold ${
            isSelected
              ? "bg-brand-700 text-white"
              : isFocused
                ? "bg-brand-50 text-brand-800"
                : "text-slate-800"
          }`,
        noOptionsMessage: () => "px-3 py-2 text-sm font-semibold text-slate-500",
      }}
    />
  );
}
