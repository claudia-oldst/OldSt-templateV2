import { Combobox, Transition } from '@headlessui/react';
import { ChevronDown, Close } from '@ui';
import { Option } from '@ui-types/input';
import clsx from 'classnames';
import { Fragment, useEffect, useMemo, useState } from 'react';
import Checkbox from '../checkbox/checkbox';
import inputStyles from '../input/input.module.scss';
import styles from './dropdown-options.module.scss';

export interface DropdownOptionsProps {
    variant?: 'default' | 'error' | 'disabled',
    label?: string,
    placeholder?: string,
    options: Option[],
    dropPosition?: 'left' | 'right' | 'top',
    isMultiSelect?: boolean,
    helperText?: string,

    /**
     * Enabled if `isMultiSelect === true` and if should have and 'All' option
     */
    withAllOption?: boolean,

    value?: Option[] | Option,
    onChange?: (value: Option[] | Option | null) => void

    name?: string
}

const checkIfWithAll = (arr: Option[]) => arr.some(v => v.value === 'all');
const allOption = { value: 'all', label: 'All' };

const hasDuplicateObjects = (arr: Option[]) => {
    const duplicates: unknown[] = [];

    arr.forEach(nv => {
        const items = arr.filter(n => n.value === nv.value);

        if (items.length > 1 && !duplicates.some(d => duplicates.includes(nv.value))) {
            duplicates.push(items[0].value);
        }
    });

    return duplicates;
};

export function DropdownOptions({
    variant = 'default', label, placeholder = 'Select item', options, dropPosition, isMultiSelect,
    value, onChange, withAllOption, name, helperText
}: DropdownOptionsProps) {
    const [selected, setSelected] = useState<Option | Option[] | null>(((withAllOption && value) ? [allOption, ...(value as Option[])] : value)
        ?? (isMultiSelect ? [] : null));

    const [query, setQuery] = useState('');

    const filteredList = useMemo(() => {
        if (!query) {
            return options;
        }

        return options.filter(opt => opt.label.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, '')));
    }, [query]);

    useEffect(() => {
        onChange && onChange(selected);
    }, [selected]);

    const selectedMultiValues = useMemo(() => {
        if (selected && isMultiSelect) {
            return (selected as Option[])
                .filter(opt => opt.value !== 'all')
                .map(opt => opt.label).join(', ');
        }

        return '';
    }, [selected]);

    const handleClearSelected = (e: React.MouseEvent) => {
        e.stopPropagation();

        setQuery('');
        setSelected(null);
    };

    /**
     * Handles the selection of an option
     *
     * @param {Option} opt - The option that was selected.
     */
    const handleSelect = (opt: Option) => {
        if (isMultiSelect) {

            if (opt.value === 'all') {
                setSelected(checkIfWithAll(selected as Option[])
                    ? [options[0]]
                    : [allOption, ...options]);
            } else {
                let newSelected = selected as Option[];
                const index = newSelected?.findIndex(s => s.value === opt.value);

                if (index === -1) {
                    newSelected = [...newSelected, opt];

                    const ifWithoutAllAndShouldSelectAll =
                        checkIfWithAll(options)
                        && newSelected.filter(s => s.value !== 'all').length === options.length - 1;

                    setSelected(ifWithoutAllAndShouldSelectAll ? options : newSelected);
                } else {
                    newSelected = newSelected.filter(s => s.value !== 'all' && s.value !== opt.value);

                    setSelected([...newSelected]);
                }
            }
        } else {
            setSelected(opt);
        }

        setQuery('');
    };

    /**
     * Handles the keydown event for the component.
     *
     * @param {React.KeyboardEvent} e - The keyboard event object.
     */
    const handleOnKeyDown = (e: React.KeyboardEvent) => {
        if (isMultiSelect && e.key === 'Backspace' && (selected as Option[])?.length && query === '') {
            let newSelected = selected as Option[];

            newSelected = newSelected.filter(s => s.value !== 'all');
            newSelected?.pop();

            setSelected([...newSelected]);
        }

        if (e.key === 'Enter') {
            setQuery('');
        }
    };

    const handleOnChange = (selectedValue: Option | Option[]) => {
        if (isMultiSelect && hasDuplicateObjects(selectedValue as Option[]).length) { // !fixed issue with default value - it's having duplicates
            const newValue = selectedValue as Option[];
            let newValueWithoutDuplicates = newValue.filter(n => !hasDuplicateObjects(selectedValue as Option[]).includes(n.value));

            if (withAllOption) {
                newValueWithoutDuplicates = newValueWithoutDuplicates.filter(n => n.value !== 'all');
            }

            setSelected([...newValueWithoutDuplicates]);

            return;

        } else if (withAllOption) {
            const newValue = selectedValue as Option[];
            const prevValue = selected as Option[];
            const isNewValueWithAll = checkIfWithAll(newValue);
            const isPrevValueWithall = checkIfWithAll(prevValue);

            if ((isNewValueWithAll || isPrevValueWithall)) { // if all was just selected
                setSelected(((isNewValueWithAll && !prevValue.length) || (!isPrevValueWithall && isNewValueWithAll))
                    ? [allOption, ...options]
                    : newValue.filter(s => s.value !== 'all'));

                return;
            } else if (newValue.length === options.length) { // if all options were selected, select 'all' as well
                setSelected([allOption, ...options]);

                return;
            }

        }

        setSelected(selectedValue);
        setQuery('');
    };


    return (
        <div className={styles['dropdown-options']}>
            <Combobox
                value={selected}
                disabled={variant === 'disabled'}
                onChange={handleOnChange}
                name={name}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                multiple={isMultiSelect} nullable={true}>

                {({ open }) => (
                    <div className={
                        clsx(inputStyles['input-wrapper'], {
                            [inputStyles['input-error']]: variant === 'error',
                            [inputStyles['input-disabled']]: variant === 'disabled',
                        })
                    }>
                        <Combobox.Button className={clsx(inputStyles['input-field'], 'w-full')}>
                            {(selectedMultiValues) &&
                                <span className='whitespace-nowrap'>{selectedMultiValues}</span>
                            }
                            <Combobox.Input
                                className={clsx(inputStyles['input'], 'bg-transparent')}
                                displayValue={(opt: Option) => opt?.label}
                                placeholder={placeholder}
                                onChange={(event) => setQuery(event.target.value)}
                                onKeyDown={handleOnKeyDown}
                                value={isMultiSelect ? query : undefined}
                                autoComplete='off'
                            />

                            <Combobox.Label className={clsx(inputStyles['label'], {
                                [inputStyles['label-with-placeholder']]: placeholder?.length !== 0,
                            })}>
                                {label}
                            </Combobox.Label>

                            {(query) &&
                                <div className={inputStyles['input__icon']} onClick={handleClearSelected}>
                                    <Close
                                        aria-hidden="true"
                                        size={20}
                                    />
                                </div>
                            }

                            <div className={inputStyles['input__icon']}>
                                <ChevronDown
                                    aria-hidden="true"
                                    size={20}
                                    className={`transition ease-in ${open ? '-rotate-180' : 'rotate-0'}`} />
                            </div>
                        </Combobox.Button>

                        <div className={inputStyles['helper-text']}>{helperText}</div>

                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            afterLeave={() => setQuery('')}
                        >
                            <Combobox.Options className={clsx(styles['dropdown-options__content'], {
                                'right-0': dropPosition === 'right',
                                'bottom-16': dropPosition === 'top'
                            })}>
                                {(filteredList.length === 0 && query !== '') ? (
                                    <div className={styles['dropdown-options__content-option']}>
                                        Nothing found.
                                    </div>
                                ) : (
                                    <>
                                        {withAllOption &&
                                            <Combobox.Option value={allOption} onClick={() => handleSelect(allOption)} >
                                                {({ selected: selectedValue, active }) => {
                                                    // const isSelected = selectedValue || checkIfWithAll(selected as Option[]);
                                                    return (
                                                        <div className={clsx(styles['dropdown-options__content-option'], { [styles['-selected']]: selectedValue, [styles['-active']]: active })}>
                                                            {isMultiSelect
                                                                ? <Checkbox label={allOption.label} isChecked={selectedValue} />
                                                                : <span>
                                                                    {allOption.label}
                                                                </span>
                                                            }
                                                        </div>
                                                    );
                                                }}
                                            </Combobox.Option>
                                        }
                                        {options.map((item: Option, i) => (
                                            <Combobox.Option key={i} value={item} onClick={() => handleSelect(item)} >
                                                {(props) => {
                                                    const { selected: selectedValue, active } = props;

                                                    const isSelected =
                                                        selectedValue
                                                        || (isMultiSelect
                                                            ? (selected as Option[]).some(v => v.value === item.value)
                                                            : (selected as Option)?.value === item.value);

                                                    return (
                                                        <div className={clsx(styles['dropdown-options__content-option'], { [styles['-selected']]: isSelected, [styles['-active']]: active })}>
                                                            {isMultiSelect
                                                                ? <Checkbox label={item.label} isChecked={isSelected} />
                                                                : <span>
                                                                    {item.label}
                                                                </span>
                                                            }
                                                        </div>
                                                    );
                                                }}
                                            </Combobox.Option>
                                        ))}
                                    </>
                                )}
                            </Combobox.Options>
                        </Transition>
                    </div>
                )}

            </Combobox>
        </div>
    );
}

export default DropdownOptions;
