export const dateToString = (date: string | undefined) => {
  if (!date) {
    return "";
  }
  if (date === "DO OTKAZA") {
    return date;
  }
  if (!date) {
    return "";
  }
  let tempString = "";
  tempString = `${date.substring(0, 10).split("-").reverse().join("-").replaceAll("-", ".")}.`;
  return tempString;
};

export function convertMiliseconds(miliseconds: number) {
  const date = new Date(miliseconds);

  return `${date.getMinutes()}:${date.getSeconds().toString().padStart(2, "0")}`;
}
