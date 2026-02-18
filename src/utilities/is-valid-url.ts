export function isValidUrl(value: string | undefined | null): true | string {
  if (value && !/^https?:\/\/[^\s$.?#].[^\s]*$/i.test(value)) {
    return "Please enter a valid URL.";
  }
  return true;
}
