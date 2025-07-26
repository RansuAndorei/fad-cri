import moment from "moment";

export const mobileNumberFormatter = (number: string) => {
  return `+63 (${number.slice(0, 3)}) ${number.slice(3, 6)} ${number.slice(6)}`;
};

export const formatDate = (dateValue: Date) => {
  return moment(dateValue).format("YYYY-MM-DD");
};
