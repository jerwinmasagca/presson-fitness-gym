'use client'

import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Calendar, Check, ChevronDown, ChevronLeft, ChevronRight, Clock, X } from 'lucide-react'
import { sanitizePhMobileInput } from '@/lib/formsubmit'

interface PhoneInputFieldProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
}

/**
 * Controlled 11-digit Philippine mobile input (09XXXXXXXXX) that restricts entry to digits only.
 */
export function PhoneInputField({
  label,
  name,
  value,
  onChange,
  placeholder = '09270660386',
  required = true,
}: PhoneInputFieldProps) {
  const isComplete = /^09\d{9}$/.test(value)

  return (
    <label className="field">
      <div className="field-label-row">
        <span>{label}</span>
        <span className={`phone-digit-counter ${isComplete ? 'is-complete' : ''}`}>
          {value.length}/11 digits
        </span>
      </div>
      <input
        name={name}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        maxLength={11}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(sanitizePhMobileInput(e.target.value))}
      />
    </label>
  )
}

export interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  required?: boolean
  variant?: 'light' | 'dark'
}

/**
 * Shared Presson custom dropdown matching each form's light or dark surface.
 */
export function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = 'Choose an option',
  required = false,
  variant = 'dark',
}: SelectFieldProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const labelId = useId()
  const selectedOption = options.find((opt) => opt.value === value)

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const variantClass = variant === 'light' ? 'is-light' : 'is-dark'

  return (
    <div className="field custom-select-field" ref={containerRef}>
      <span id={labelId}>{label}</span>
      <input type="hidden" name={name} value={value} required={required} />
      <div className={`custom-select-wrap ${open ? 'is-open' : ''}`}>
        <button
          type="button"
          className={`custom-select-trigger ${variantClass} ${selectedOption ? 'has-value' : 'is-placeholder'}`}
          aria-labelledby={labelId}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="custom-select-value">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={`custom-select-chevron ${open ? 'rotated' : ''}`} size={18} />
        </button>

        {open && (
          <ul
            className={`custom-select-menu ${variantClass}`}
            role="listbox"
            aria-labelledby={labelId}
          >
            {options.map((option) => {
              const isSelected = option.value === value
              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  className={`custom-select-option ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                >
                  <span>{option.label}</span>
                  {isSelected && <Check size={16} strokeWidth={2.5} />}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function parseIsoDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim())
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2]) - 1
  const day = Number(match[3])
  const date = new Date(year, month, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null
  }
  return date
}

function toIsoDate(year: number, monthIndex: number, day: number): string {
  const mm = String(monthIndex + 1).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${year}-${mm}-${dd}`
}

function formatDateDisplay(iso: string): string {
  const parsed = parseIsoDate(iso)
  if (!parsed) return ''
  return `${MONTH_NAMES[parsed.getMonth()]} ${parsed.getDate()}, ${parsed.getFullYear()}`
}

interface DatePickerFieldProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  variant?: 'light' | 'dark'
}

/**
 * Click-anywhere date trigger that opens an interactive calendar popup modal.
 */
export function DatePickerField({
  label,
  name,
  value,
  onChange,
  placeholder = 'Select a date',
  required = false,
  variant = 'light',
}: DatePickerFieldProps) {
  const [open, setOpen] = useState(false)
  const today = useMemo(() => new Date(), [])
  const parsedSelected = useMemo(() => parseIsoDate(value), [value])

  const [viewYear, setViewYear] = useState<number>(() =>
    (parsedSelected ?? today).getFullYear(),
  )
  const [viewMonth, setViewMonth] = useState<number>(() =>
    (parsedSelected ?? today).getMonth(),
  )

  const openModal = () => {
    const anchor = parseIsoDate(value) ?? new Date()
    setViewYear(anchor.getFullYear())
    setViewMonth(anchor.getMonth())
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  const calendarCells = useMemo(() => {
    const firstDayWeekday = new Date(viewYear, viewMonth, 1).getDay()
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const prevMonthLastDate = new Date(viewYear, viewMonth, 0).getDate()

    const cells: { iso: string; day: number; inCurrentMonth: boolean }[] = []

    for (let i = firstDayWeekday - 1; i >= 0; i -= 1) {
      const d = prevMonthLastDate - i
      const prevDate = new Date(viewYear, viewMonth - 1, d)
      cells.push({
        iso: toIsoDate(prevDate.getFullYear(), prevDate.getMonth(), d),
        day: d,
        inCurrentMonth: false,
      })
    }

    for (let d = 1; d <= daysInMonth; d += 1) {
      cells.push({
        iso: toIsoDate(viewYear, viewMonth, d),
        day: d,
        inCurrentMonth: true,
      })
    }

    const remaining = 42 - cells.length
    for (let d = 1; d <= remaining; d += 1) {
      const nextDate = new Date(viewYear, viewMonth + 1, d)
      cells.push({
        iso: toIsoDate(nextDate.getFullYear(), nextDate.getMonth(), d),
        day: d,
        inCurrentMonth: false,
      })
    }

    return cells
  }, [viewYear, viewMonth])

  const todayIso = toIsoDate(today.getFullYear(), today.getMonth(), today.getDate())
  const yearRange = useMemo(() => {
    const base = today.getFullYear()
    const min = Math.min(base - 2, viewYear)
    const max = Math.max(base + 3, viewYear)
    const years: number[] = []
    for (let y = min; y <= max; y += 1) years.push(y)
    return years
  }, [today, viewYear])

  const shiftMonth = (delta: number) => {
    const shifted = new Date(viewYear, viewMonth + delta, 1)
    setViewYear(shifted.getFullYear())
    setViewMonth(shifted.getMonth())
  }

  const displayText = formatDateDisplay(value)

  const modalContent =
    open && typeof document !== 'undefined'
      ? createPortal(
          <div
            className="picker-modal-backdrop"
            role="presentation"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false)
            }}
          >
            <div
              className="picker-modal"
              role="dialog"
              aria-modal="true"
              aria-label={`Choose ${label.replace(/\*/g, '').trim()}`}
            >
              <div className="picker-modal-header">
                <div>
                  <span className="picker-modal-eyebrow">Presson Schedule</span>
                  <h4>{label.replace(/\*/g, '').trim()}</h4>
                </div>
                <button
                  type="button"
                  className="picker-modal-close"
                  aria-label="Close calendar"
                  onClick={() => setOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="calendar-nav">
                <button
                  type="button"
                  className="calendar-nav-btn"
                  aria-label="Previous month"
                  onClick={() => shiftMonth(-1)}
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="calendar-nav-selects">
                  <select
                    aria-label="Select month"
                    value={viewMonth}
                    onChange={(e) => setViewMonth(Number(e.target.value))}
                  >
                    {MONTH_NAMES.map((mName, idx) => (
                      <option key={mName} value={idx}>
                        {mName}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label="Select year"
                    value={viewYear}
                    onChange={(e) => setViewYear(Number(e.target.value))}
                  >
                    {yearRange.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  className="calendar-nav-btn"
                  aria-label="Next month"
                  onClick={() => shiftMonth(1)}
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="calendar-weekdays">
                {WEEKDAYS.map((dayName) => (
                  <span key={dayName}>{dayName}</span>
                ))}
              </div>

              <div className="calendar-grid">
                {calendarCells.map((cell) => {
                  const isSelected = cell.iso === value
                  const isToday = cell.iso === todayIso
                  return (
                    <button
                      key={cell.iso}
                      type="button"
                      className={[
                        'calendar-day-btn',
                        cell.inCurrentMonth ? 'in-month' : 'out-month',
                        isToday ? 'is-today' : '',
                        isSelected ? 'is-selected' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => {
                        onChange(cell.iso)
                        setOpen(false)
                      }}
                    >
                      {cell.day}
                    </button>
                  )
                })}
              </div>

              <div className="picker-modal-footer">
                <button
                  type="button"
                  className="picker-secondary-btn"
                  onClick={() => {
                    onChange(todayIso)
                    setOpen(false)
                  }}
                >
                  Today
                </button>
                {!required && value ? (
                  <button
                    type="button"
                    className="picker-secondary-btn"
                    onClick={() => {
                      onChange('')
                      setOpen(false)
                    }}
                  >
                    Clear
                  </button>
                ) : null}
                <button
                  type="button"
                  className="picker-secondary-btn"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null

  return (
    <div className="field">
      <span>{label}</span>
      <input type="hidden" name={name} value={value} required={required} />
      <button
        type="button"
        className={`picker-trigger ${variant === 'dark' ? 'is-dark' : 'is-light'} ${displayText ? 'has-value' : 'is-placeholder'}`}
        onClick={openModal}
      >
        <span>{displayText || placeholder}</span>
        <Calendar size={17} className="picker-trigger-icon" />
      </button>
      {modalContent}
    </div>
  )
}

interface Parsed12Hour {
  hour12: number
  minute: string
  period: 'AM' | 'PM'
}

function parse24HourTime(raw: string): Parsed12Hour {
  const match = /^(\d{1,2}):(\d{2})$/.exec(raw.trim())
  if (!match) {
    return { hour12: 9, minute: '00', period: 'AM' }
  }
  const h24 = Math.min(23, Math.max(0, Number(match[1])))
  const minute = match[2]
  const period: 'AM' | 'PM' = h24 >= 12 ? 'PM' : 'AM'
  const hour12 = h24 % 12 === 0 ? 12 : h24 % 12
  return { hour12, minute, period }
}

function to24HourTime(hour12: number, minute: string, period: 'AM' | 'PM'): string {
  let h24 = hour12 % 12
  if (period === 'PM') {
    h24 += 12
  }
  return `${String(h24).padStart(2, '0')}:${minute}`
}

function formatTimeDisplay(raw: string): string {
  if (!raw.trim()) return ''
  const parsed = parse24HourTime(raw)
  return `${parsed.hour12}:${parsed.minute} ${parsed.period}`
}

const HOURS_12 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const MINUTES_5 = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']

interface TimePickerFieldProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  variant?: 'light' | 'dark'
}

/**
 * Click-anywhere time trigger that opens a popup modal with explicit AM/PM toggle, hour, and minute selection.
 */
export function TimePickerField({
  label,
  name,
  value,
  onChange,
  placeholder = 'Select a time',
  required = false,
  variant = 'dark',
}: TimePickerFieldProps) {
  const [open, setOpen] = useState(false)
  const [draftHour, setDraftHour] = useState<number>(9)
  const [draftMinute, setDraftMinute] = useState<string>('00')
  const [draftPeriod, setDraftPeriod] = useState<'AM' | 'PM'>('AM')

  const openModal = () => {
    const parsed = parse24HourTime(value)
    setDraftHour(parsed.hour12)
    setDraftMinute(parsed.minute)
    setDraftPeriod(parsed.period)
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  const displayText = formatTimeDisplay(value)

  const modalContent =
    open && typeof document !== 'undefined'
      ? createPortal(
          <div
            className="picker-modal-backdrop"
            role="presentation"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false)
            }}
          >
            <div
              className="picker-modal time-picker-modal"
              role="dialog"
              aria-modal="true"
              aria-label={`Choose ${label.replace(/\*/g, '').trim()}`}
            >
              <div className="picker-modal-header">
                <div>
                  <span className="picker-modal-eyebrow">Gym Hours · 8:00 AM – 10:00 PM</span>
                  <h4>{label.replace(/\*/g, '').trim()}</h4>
                </div>
                <button
                  type="button"
                  className="picker-modal-close"
                  aria-label="Close time picker"
                  onClick={() => setOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="time-preview-bar">
                <div className="time-preview-readout">
                  {String(draftHour).padStart(2, '0')} : {draftMinute}
                  <span>{draftPeriod}</span>
                </div>
                <div className="period-toggle" role="group" aria-label="AM or PM">
                  {(['AM', 'PM'] as const).map((period) => (
                    <button
                      key={period}
                      type="button"
                      className={`period-btn ${draftPeriod === period ? 'is-active' : ''}`}
                      onClick={() => setDraftPeriod(period)}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              <div className="time-section-block">
                <p className="time-section-label">Hour</p>
                <div className="time-grid-4">
                  {HOURS_12.map((hr) => (
                    <button
                      key={hr}
                      type="button"
                      className={`time-chip-btn ${draftHour === hr ? 'is-selected' : ''}`}
                      onClick={() => setDraftHour(hr)}
                    >
                      {hr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="time-section-block">
                <p className="time-section-label">Minute</p>
                <div className="time-grid-4">
                  {MINUTES_5.map((min) => (
                    <button
                      key={min}
                      type="button"
                      className={`time-chip-btn ${draftMinute === min ? 'is-selected' : ''}`}
                      onClick={() => setDraftMinute(min)}
                    >
                      :{min}
                    </button>
                  ))}
                </div>
              </div>

              <div className="picker-modal-footer">
                {!required && value ? (
                  <button
                    type="button"
                    className="picker-secondary-btn"
                    onClick={() => {
                      onChange('')
                      setOpen(false)
                    }}
                  >
                    Clear
                  </button>
                ) : null}
                <button
                  type="button"
                  className="picker-secondary-btn"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="picker-primary-btn"
                  onClick={() => {
                    onChange(to24HourTime(draftHour, draftMinute, draftPeriod))
                    setOpen(false)
                  }}
                >
                  Set Time
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null

  return (
    <div className="field">
      <span>{label}</span>
      <input type="hidden" name={name} value={value} required={required} />
      <button
        type="button"
        className={`picker-trigger ${variant === 'dark' ? 'is-dark' : 'is-light'} ${displayText ? 'has-value' : 'is-placeholder'}`}
        onClick={openModal}
      >
        <span>{displayText || placeholder}</span>
        <Clock size={17} className="picker-trigger-icon" />
      </button>
      {modalContent}
    </div>
  )
}

