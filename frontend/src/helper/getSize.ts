import { SizeType } from "../types/types";

const getSize = (size: SizeType) => {
  switch (size) {
    case "SMALL":
      return "S";
    case "MEDIUM":
      return "M";
    case "LARGE":
      return "L";
    case "XLARGE":
      return "XL";
    case "XXLARGE":
      return "XXL";
  }
};

export default getSize;
