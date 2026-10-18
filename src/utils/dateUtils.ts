/**
 * Utilities for Date of Birth parsing, calculation, and formatting
 */

export function calculateAge(dobString: string): number {
  if (!dobString) return 25;
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return 25;
  
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age > 0 ? age : 18;
}

export function formatDateOfBirth(dobString: string): string {
  if (!dobString) return '';
  const date = new Date(dobString);
  if (isNaN(date.getTime())) return dobString;

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function formatFullDob(dobString: string): string {
  if (!dobString) return '';
  const date = new Date(dobString);
  if (isNaN(date.getTime())) return dobString;

  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function formatDobWithAge(dobString: string, fallbackAge?: number): string {
  if (!dobString) return fallbackAge ? `${fallbackAge} Yrs` : '';
  const formatted = formatDateOfBirth(dobString);
  const calculatedAge = calculateAge(dobString) || fallbackAge;
  return `${formatted} (${calculatedAge} Yrs)`;
}
